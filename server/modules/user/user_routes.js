const passport = require('passport');
const express = require('express');
const userCtl = require('./user_controller');
const router = express.Router();

require('./passport')(passport);

router.post('/signup', userCtl.signup)
.post('/signin', userCtl.signin)
.get('/oauth/facebook', passport.authenticate('facebook', { session: false }))
.get('/oauth/google', passport.authenticate('google', {
  session: false,
  scope: [
    // View your email address
    'https://www.googleapis.com/auth/userinfo.email',
    // View your basic profile info
    'https://www.googleapis.com/auth/userinfo.profile',
    // View your phone numbers
    'https://www.googleapis.com/auth/user.phonenumbers.read',
    // View your street addresses
    'https://www.googleapis.com/auth/user.addresses.read',
    // View your complete date of birth
    'https://www.googleapis.com/auth/user.birthday.read',
    // Know the list of people in your circles, your age range, and language
    'https://www.googleapis.com/auth/plus.login',
    // View your email addresses
    //'https://www.googleapis.com/auth/user.emails.read',
    // View your contacts
    //'https://www.googleapis.com/auth/contacts.readonly',
    // Manage your contacts
    //'https://www.googleapis.com/auth/contacts',
  ]
}))
.get('/oauth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  res.json({success: true, token: req.user.generateToken()});
})
.get('/oauth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  res.json({success: true, token: req.user.generateToken()});
});


module.exports = router;
