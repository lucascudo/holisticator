const passport = require('passport');
const express = require('express');
const router = express.Router();
const subjectCtl = require('./subject_controller');

require('../user/passport')(passport);

router.get('/', subjectCtl.get)
.get('/:id', subjectCtl.get)
.post('/', passport.authenticate('bearer', { session: false }), subjectCtl.create)
.put('/:id', passport.authenticate('bearer', { session: false }), subjectCtl.update)
.delete('/:id', passport.authenticate('bearer', { session: false }), subjectCtl.remove)
.post('/:id/image', passport.authenticate('bearer', { session: false }), subjectCtl.changeImage);

module.exports = router;
