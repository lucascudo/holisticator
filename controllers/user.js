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
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'})
      }
      const token = 'JWT ' + jwt.sign({
          _id: newUser._id,
          username: newUser.username,
      }, config.secret, { expiresIn: 3600 });
      return res.json({ success: true, token: token });
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
        if (!err && isMatch) {
          const token = 'JWT ' + jwt.sign({
              _id: user._id,
              username: user.username,
          }, config.secret, { expiresIn: 3600 });
          return res.json({success: true, token: token});
        }
        return res.status(401).json({success: false, msg: 'Authentication failed.'});
      });
    });
  }

};
