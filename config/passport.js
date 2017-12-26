const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('./database');

module.exports = (passport) => {
  passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: config.secret
  }, (jwt_payload, done) => {
    User.findOne({id: jwt_payload.id}, (err, user) =>
        done(err || null, user || false));
  }));
};
