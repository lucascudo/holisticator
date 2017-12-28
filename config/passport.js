const BearerStrategy = require('passport-http-bearer').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../modules/user/user_model');
const config = require('./app');

module.exports = (passport) => {
  passport.use(new BearerStrategy((jwt_payload, done) => {
    User.findOne({id: jwt_payload.id}, (err, user) => {
        if (err) { return done(err, false); }
        done(null, user || false);
    });
  }));
};
