let mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require("../models/user");
const Pokemon = require("../models/pokemon");
const config = require('../config/database');
require('../config/passport')(passport);

function getToken(headers) {
  if (!headers || !headers.authorization) { return null; }
  if (headers.authorization.split(' ').length !== 2) { return null; }
  return parted[1];
}

// Authentication
router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
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
      : res.json({success: true, token: 'JWT ' + wt.sign(newUser.toObject(), config.secret)});
  });
})
.post('/signin', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    }
    // check if password matches
    user.comparePassword(req.body.password, (err, isMatch) => {
      return (!err && isMatch)
        ? res.json({success: true, token: 'JWT ' + wt.sign(user.toObject(), config.secret)})
        : res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
    });
  });
})

// Pokemons
.get('/pokemon', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  console.log(token);
  if (!token) {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
  Pokemon.find((err, pokemons) => {
    if (err) return next(err);
    res.json(pokemons);
  });
})
.post('/pokemon', passport.authenticate('jwt', { session: false}), (req, res) => {
  const token = getToken(req.headers);
  console.log(token);
  if (!token) {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
  const newPokemon = new Pokemon({
    number: req.body.isbn,
    name: req.body.title,
    author: new mongoose.ObjectId
  });
  newPokemon.save((err) => {
    return (err)
      ? res.json({success: false, msg: 'Pokemon creation failed.'})
      : res.json({success: true, pokemon: newPokemon});
  });
});

module.exports = router;
