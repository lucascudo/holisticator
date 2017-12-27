const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const integerValidator = require('mongoose-integer');

const PokemonSchema = new Schema({
    number: {
        type: Number,
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

PokemonSchema.plugin(integerValidator);
module.exports = mongoose.model('Pokemon', PokemonSchema);
