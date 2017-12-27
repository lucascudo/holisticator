const passport = require('passport');
const express = require('express');
const router = express.Router();
const pokemonCtl = require('./pokemon_controller');

require('../../config/passport')(passport);

router.get('/pokemon', pokemonCtl.get)
.get('/pokemon/:number', pokemonCtl.get)
.post('/pokemon', passport.authenticate('jwt', { session: false}), pokemonCtl.create)
.put('/pokemon/:number', passport.authenticate('jwt', { session: false}), pokemonCtl.update)
.delete('/pokemon/:number', passport.authenticate('jwt', { session: false}), pokemonCtl.remove)
.post('/pokemon/:number/image', passport.authenticate('jwt', { session: false}), pokemonCtl.changeImage);

module.exports = router;
