const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [ { type: String } ]
});

SubjectSchema.methods.format = function (showAuthor = false) {
  let subject = {
    id: this.id,
    name: this.name,
    image: this.image
  };
  if (showAuthor) { subject.author = this.author; }
  return subject;
};

SubjectSchema.methods.addImage = function (imgBuffer, imgExt, done) {
  const filename = this.id + '_'  + Math.floor(Math.random()*8999999999999+1000000000000) + '.' + imgExt;
  const filepath = __dirname + '/../../public/images/' + filename;
  fs.writeFile(filepath, buffer.toString('binary'), "binary", (err) => {
    if (err) throw err;
    this.image.push(filename);
    this.save(done);
  });
}

module.exports = mongoose.model('Subject', SubjectSchema);
