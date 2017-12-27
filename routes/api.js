const passport = require('passport');
const express = require('express');
const router = express.Router();

const userCtl = require('../controllers/user');
const pokemonCtl = require('../controllers/pokemon');
require('../config/passport')(passport);

router
.post('/signup', userCtl.signup)
.post('/signin', userCtl.signin)
.get('/pokemon', passport.authenticate('jwt', { session: false}), pokemonCtl.get)
.get('/pokemon/:number', passport.authenticate('jwt', { session: false}), pokemonCtl.get)
.post('/pokemon', passport.authenticate('jwt', { session: false}), pokemonCtl.create)
.put('/pokemon/:number', passport.authenticate('jwt', { session: false}), pokemonCtl.update)
.delete('/pokemon/:number', passport.authenticate('jwt', { session: false}), pokemonCtl.remove)
.post('/pokemon/:number/image', passport.authenticate('jwt', { session: false}), pokemonCtl.changeImage);
module.exports = router;
