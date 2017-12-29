const jwt = require('jsonwebtoken');
const imageType = require('image-type');
const readChunk = require('read-chunk');

const config = require('../../config/app');
const getToken = require('../../utils/get_token');
const Subject = require('./subject_model');

const toScriptKiddos = 'That subject is not yours!';

module.exports = {

  get: (req, res) => {
    if (req.params.id) {
      Subject.findOne({id: req.params.id}, (err, subject) => {
        return (err || !subject)
          ? res.json({success: false, msg: 'Subject not found.'})
          : res.json({success: true, subject: subject.format()});
      });
    } else {
      Subject.find((err, subjects) => {
        return (err || !subjects)
          ? next(err)
          : res.json(subjects.map((subject) => subject.format(true)));
      });
    }
  },

  create: (req, res) => {
    const token = getToken(req, res);
    jwt.verify(token, config.secret, (err, user) => {
      const newSubject = new Subject({
        id: req.body.id,
        name: req.body.name,
        author: user._id
      });
      newSubject.save((err) => {
        return (err)
          ? res.json({success: false, msg: 'Failed to create subject.'})
          : res.json({success: true, subject: newSubject.format()});
      });
    });
  },

  update: (req, res) => {
    const token = getToken(req, res);
    Subject.findOne({id: req.params.id}, (err, subject) => {
      if (err || !subject) {
        return res.json({ success: false, msg: 'Failed to update subject.' });
      }
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != subject.author) {
          return res.json({ success: false, msg: toScriptKiddos });
        }
        subject.id = req.body.id || subject.id;
        subject.name = req.body.name || subject.name;
        subject.save((error) => {
          return (error)
            ? res.json({ success: false, msg: 'Failed to update subject.' })
            : res.json({ success: true, subject: subject.format() });
        });
      });
    });
  },

  remove: (req, res) => {
    const token = getToken(req, res);
    Subject.findOne({id: req.params.id}, (err, subject) => {
      if (err || !subject) {
        return res.json({ success: false, msg: 'Failed to delete subject.' });
      }
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != subject.author) {
          return res.json({ success: false, msg: toScriptKiddos });
        }
        subject.remove();
        return res.json({ success: true});
      });
    });
  },

  changeImage: (req, res) => {
    const token = getToken(req, res);
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, msg: "Missing image file." });
    }
    const image = req.files.image;
    const buffer = image.data;
    const imgExif = imageType(buffer);
    const imgExt = imageType(buffer).ext;
    if (!imgExif || ['png', 'gif', 'jpg', 'jpeg'].indexOf(imgExt) < 0)  {
      return res.status(400).json({ success: false, msg: "Invalid image format." });
    }
    Subject.findOne({id: req.params.id}, (err, subject) => {
      if (err || !subject) {
        return res.json({ success: false, msg: 'Failed to update subject image.' });
      }
      jwt.verify(token, config.secret, (err, user) => {
        if (user._id != subject.author) {
          return res.json({ success: false, msg: toScriptKiddos });
        }
        subject.addImage(buffer, imgExt, (err) => {
          return (err)
            ? res.json({ success: false, msg: 'Failed to update subject image.' })
            : res.json({ success: true, subject: subject.format() });
        });
      });
    });
  }

};
