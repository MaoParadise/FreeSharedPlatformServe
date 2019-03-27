const mongoose = require('mongoose');
const { Schema, model} = mongoose

const PhotoSchema = new Schema({
    title: String,
    imageURL: String,
    public_id: String
})

module.exports = mongoose.model('Photo', PhotoSchema);