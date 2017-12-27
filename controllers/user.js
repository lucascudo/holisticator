const jwt = require('jsonwebtoken');

const config = require('../config/app');
const User = require("../models/user");

module.exports = {

  signup: (req, res) => {
    if (!req.body || !req.body.username || !req.body.password) {
      return res.json({success: false, msg: 'Please pass username and password.'});
    }
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save((err) => {
      return (err)
        ? res.json({success: false, msg: 'Username already exists.'})
        : res.json({success: true, token: 'JWT ' + jwt.sign({_id: newUser._id}, config.secret)});
    });
  },

  signin: (req, res) => {
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.status(401).json({success: false, msg: 'Authentication failed. User not found.'});
      }
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        return (!err && isMatch)
          ? res.json({success: true, token: 'JWT ' + jwt.sign({_id: user._id}, config.secret)})
          : res.status(401).json({success: false, msg: 'Authentication failed. Wrong password.'});
      });
    });
  }

};
