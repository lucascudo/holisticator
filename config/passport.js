const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../modules/user/user_model');
const config = require('./app');

module.exports = (passport) => {
  passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: config.secret
  }, (jwt_payload, done) => {
    User.findOne({id: jwt_payload.id}, (err, user) => {
        if (err) { return done(err, false); }
        done(null, user || false);
    });
  }));
};
