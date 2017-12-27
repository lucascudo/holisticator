const passport = require('passport');
const express = require('express');
const userCtl = require('./user_controller');
const router = express.Router();

require('../../config/passport')(passport);

router.post('/signup', userCtl.signup)
.post('/signin', userCtl.signin);

module.exports = router;
