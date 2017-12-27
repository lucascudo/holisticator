const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const integerValidator = require('mongoose-integer');

const PokemonSchema = new Schema({
    number: {
        type: Number,
        unique: true,
        integer: true,
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

PokemonSchema.methods.format = function (omitAuthor = false) {
  let pokemon = {
    number: this.number,
    name: this.name,
    image: this.image
  };
  if (!omitAuthor) { pokemon.author = this.author; }
  return pokemon;
};

PokemonSchema.plugin(integerValidator);
module.exports = mongoose.model('Pokemon', PokemonSchema);
