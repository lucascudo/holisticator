let mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');
const imageType = require('image-type');
const readChunk = require('read-chunk');
const fs = require('fs');

const router = express.Router();
const config = require('../config/app');
const User = require("../models/user");
const Pokemon = require("../models/pokemon");
require('../config/passport')(passport);

function getToken(headers) {
  if (!headers || !headers.authorization) { return null; }
  const parted = headers.authorization.split(' ');
  if (parted.length !== 2) { return null; }
  return parted[1];
}

function formatPokemon(pokemon) {
  return (pokemon.number && pokemon.name && pokemon.author)
    ? {
      number: pokemon.number,
      name: pokemon.name,
      image: pokemon.image,
      author: pokemon.author
    }
    : false;
}

// Authentication
router.post('/signup', (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.json({success: false, msg: 'Please pass username and password.'});
  }
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  // save the user
  newUser.save((err) => {
    return (err)
      ? res.json({success: false, msg: 'Username already exists.'})
      : res.json({success: true, token: 'JWT ' + jwt.sign({_id: newUser._id}, config.secret)});
  });
})
.post('/signin', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(401).json({success: false, msg: 'Authentication failed. User not found.'});
    }
    // check if password matches
    user.comparePassword(req.body.password, (err, isMatch) => {
      return (!err && isMatch)
        ? res.json({success: true, token: 'JWT ' + jwt.sign({_id: newUser._id}, config.secret)})
        : res.status(401).json({success: false, msg: 'Authentication failed. Wrong password.'});
    });
  });
})

// Pokemons
.get('/pokemon', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  if (!token) {
    return res.status(403).json({success: false, msg: 'Unauthorized.'});
  }
  Pokemon.find((err, pokemons) => {
    if (err) return next(err);
    const formattedPokemons = pokemons.map((pokemon) => formatPokemon(pokemon));
    res.json(formattedPokemons);
  });
})
.get('/pokemon/:number', passport.authenticate('jwt', { session: false}), (req, res) => {
  Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
    return (err || !pokemon)
      ? res.json({success: false, msg: 'Failed to get pokemon: ' + req.params.number})
      : res.json({success: true, pokemon: formatPokemon(pokemon)});
  });
})
.post('/pokemon', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  if (!token) {
    return res.status(403).json({success: false, msg: 'Unauthorized.'});
  }
  jwt.verify(token, config.secret, (err, user) => {
    const newPokemon = new Pokemon({
      number: req.body.number,
      name: req.body.name,
      author: user._id
    });
    newPokemon.save((err) => {
      return (err)
        ? res.json({success: false, msg: 'Pokemon creation failed.'})
        : res.json({success: true, pokemon: formatPokemon(pokemon)});
    });
  });
})
.post('/pokemon/:number/image', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  if (!token) {
    return res.status(403).json({success: false, msg: 'Unauthorized.'});
  }
  if (!req.files || !req.files.image) {
    return res.status(400).json({ success: false, msg: "Missing image file" });
  }
  const image = req.files.image;
  const buffer = image.data;
  const imgExif = imageType(buffer);
  const imgExt = imageType(buffer).ext;
  if (!imgExif || ['png', 'gif', 'jpg', 'jpeg'].indexOf(imgExt) < 0)  {
    return res.status(400).json({ success: false, msg: "Invalid image format" });
  }
  Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
    if (err || !pokemon) {
      return res.json({ success: false, msg: 'Failed to update pokemon image' });
    }
    if (token._id != pokemon.author) {
      return res.json({ success: false, msg: 'That pokemon is not yours' });
    }
    const filename = pokemon.number + '.' + imgExt;
    const filepath = __dirname + '/../public/images/' + filename;
    fs.writeFile(filepath, buffer.toString('binary'), "binary", (err) => {
      if (err) throw err;
      pokemon.image = 'images/' + filename;
      pokemon.save((err) => {
        return (err)
          ? res.json({ success: false, msg: 'Failed to update pokemon image' })
          : res.json({ success: true, pokemon: formatPokemon(pokemon) });
      });
    });
  });
});

module.exports = router;
