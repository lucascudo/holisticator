const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const PasswordGenerator = require('password-generator-js')
const config = require('../../config/app');
const User = require('./user_model');


module.exports = (passport) => {
  passport.use(new BearerStrategy((jwt_payload, done) => {
    User.findOne({id: jwt_payload.id}, (err, user) => {
        if (err) { return done(err, false); }
        done(null, user || false);
    });
  }));
  passport.use(new GoogleStrategy({
    clientID: config.gClientID,
    clientSecret: config.gClientSecret,
    callbackURL: config.uriHost + config.uriRoot + "/oauth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOrCreate({ 'profile.id' : profile.id }, {
      username: profile.emails[0].value,
      password: PasswordGenerator.generatePassword(),
      profile: profile
    }, (err, user) => done(err, user));
  }));
};
