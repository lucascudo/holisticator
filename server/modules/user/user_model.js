const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const config = require('../../config/app'); 

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: Object,
        required: false,
        default: {}
    }
});

UserSchema.plugin(findOrCreate);

UserSchema.pre('save', function (next) {
    let user = this;
    if (!this.isModified('password') && !this.isNew) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
        if (err) { return cb(err); }
        cb(null, isMatch);
    });
};

UserSchema.methods.generateToken = function () {
  return 'Bearer ' + jwt.sign({
      _id: this._id,
      username: this.username,
  }, config.secret, { expiresIn: 3600 });
}

module.exports = mongoose.model('User', UserSchema);
