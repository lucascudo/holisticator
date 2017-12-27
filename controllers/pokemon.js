const jwt = require('jsonwebtoken');
const imageType = require('image-type');
const readChunk = require('read-chunk');
const fs = require('fs');

const config = require('../config/app');
const Pokemon = require('../models/pokemon');
const getToken = require('../utils/get_token');

const toTeamRocket = 'That pokemon is not yours!';

module.exports = {

  get: (req, res) => {
    if (req.params.number) {
      Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
        return (err || !pokemon)
          ? res.json({success: false, msg: 'Pokemon not found.'})
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
    const token = getToken(req, res);
    jwt.verify(token, config.secret, (err, user) => {
      const newPokemon = new Pokemon({
        number: req.body.number,
        name: req.body.name,
        author: user._id
      });
      newPokemon.save((err) => {
        return (err)
          ? res.json({success: false, msg: 'Failed to create pokemon.'})
          : res.json({success: true, pokemon: newPokemon.format()});
      });
    });
  },

  update: (req, res) => {
    const token = getToken(req, res);
    Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
      if (err || !pokemon) {
        return res.json({ success: false, msg: 'Failed to update pokemon.' });
      }
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != pokemon.author) {
          return res.json({ success: false, msg: toTeamRocket });
        }
        pokemon.number = req.body.number || pokemon.number;
        pokemon.name = req.body.name || pokemon.name;
        pokemon.save((error) => {
          return (error)
            ? res.json({ success: false, msg: 'Failed to update pokemon.' })
            : res.json({ success: true, pokemon: pokemon.format() });
        });
      });
    });
  },

  remove: (req, res) => {
    const token = getToken(req, res);
    Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
      if (err || !pokemon) {
        return res.json({ success: false, msg: 'Failed to delete pokemon.' });
      }
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != pokemon.author) {
          return res.json({ success: false, msg: toTeamRocket });
        }
        pokemon.remove();
        return res.json({ success: true});
      });
    });
  },

  changeImage: (req, res) => {
    const token = getToken(req, res);
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, msg: "Missing image file." });
    }
    const image = req.files.image;
    const buffer = image.data;
    const imgExif = imageType(buffer);
    const imgExt = imageType(buffer).ext;
    if (!imgExif || ['png', 'gif', 'jpg', 'jpeg'].indexOf(imgExt) < 0)  {
      return res.status(400).json({ success: false, msg: "Invalid image format." });
    }
    Pokemon.findOne({number: req.params.number}, (err, pokemon) => {
      if (err || !pokemon) {
        return res.json({ success: false, msg: 'Failed to update pokemon image.' });
      }
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != pokemon.author) {
          return res.json({ success: false, msg: toTeamRocket });
        }
        const filename = pokemon.number + '.' + imgExt;
        const filepath = __dirname + '/../public/images/' + filename;
        fs.writeFile(filepath, buffer.toString('binary'), "binary", (err) => {
          if (err) throw err;
          pokemon.image = filename;
          pokemon.save((err) => {
            return (err)
              ? res.json({ success: false, msg: 'Failed to update pokemon image.' })
              : res.json({ success: true, pokemon: pokemon.format() });
          });
        });
      });
    });
  }

};
