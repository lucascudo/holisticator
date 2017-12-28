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
    image: {
        type: String,
        required: false,
        default: ''
    }
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

module.exports = mongoose.model('Subject', SubjectSchema);
