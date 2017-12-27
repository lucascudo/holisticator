const passport = require('passport');
const express = require('express');
const router = express.Router();
const pokemonCtl = require('./pokemon_controller');

require('../../config/passport')(passport);

router.get('/', pokemonCtl.get)
.get('/:number', pokemonCtl.get)
.post('/', passport.authenticate('jwt', { session: false}), pokemonCtl.create)
.put('/:number', passport.authenticate('jwt', { session: false}), pokemonCtl.update)
.delete('/:number', passport.authenticate('jwt', { session: false}), pokemonCtl.remove)
.post('/:number/image', passport.authenticate('jwt', { session: false}), pokemonCtl.changeImage);

module.exports = router;
