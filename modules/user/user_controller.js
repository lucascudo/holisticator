
const config = require('../../config/app');
const User = require("./user_model");

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
        : res.json({ success: true, token: user.generateToken() });
    });
  },

  signin: (req, res) => {
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) throw err;
      return (!user)
        ? res.status(401).json({success: false, msg: 'Authentication failed. User not found.'})
        : user.comparePassword(req.body.password, (err, isMatch) => {
          return (err || !isMatch)
            ? res.status(401).json({success: false, msg: 'Authentication failed.'})
            : res.json({success: true, token: user.generateToken()});
        });
    });
  }

};
