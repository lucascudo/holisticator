const jwt = require('jsonwebtoken');
const imageType = require('image-type');
const readChunk = require('read-chunk');
const fs = require('fs');

const config = require('../config/app');
const Pokemon = require('../models/pokemon');
const getToken = require('./get_token');

module.exports = {

  get: (req, res) => {
    const token = getToken(req.headers);
    if (!token) {
      return res.status(403).json({success: false, msg: 'Unauthorized.'});
    }
    if (req.params.number) {
      Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
        return (err || !pokemon)
          ? res.json({success: false, msg: 'Pokemon not found'})
          : res.json({success: true, pokemon: pokemon.format()});
      });
    } else {
      Pokemon.find((err, pokemons) => {
        return (err || !pokemons)
          ? next(err)
          : res.json(pokemons.map((pokemon) => pokemon.format(true)));
      });
    }
  },

  create: (req, res) => {
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
          : res.json({success: true, pokemon: newPokemon.format()});
      });
    });
  },

  remove: (req, res) => {
    const token = getToken(req.headers);
    if (!token) {
      return res.status(403).json({success: false, msg: 'Unauthorized.'});
    }
    Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
      if (err || !pokemon) {
        return res.json({ success: false, msg: 'Failed to delete pokemon' });
      }
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != pokemon.author) {
          return res.json({ success: false, msg: 'That pokemon is not yours' });
        }
        pokemon.remove();
        return res.json({ success: true});
      });
    });
  },

  updateImage: (req, res) => {
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
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != pokemon.author) {
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
              : res.json({ success: true, pokemon: pokemon.format() });
          });
        });
      });
    });
  }

};
