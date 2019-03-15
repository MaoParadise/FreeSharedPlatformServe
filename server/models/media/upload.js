const mongoose = require('mongoose');
const { Schema } = mongoose;
const frameClass = require('./frame')

const uploadSchema = new Schema({
    _idUser: { type: String, required : true },
    _idMedia: { type: String, required : true },
    episode: { type: Number, required : true },
    dateUpload: { type: Date, required: true },
    updateUpload: { type: Date, required: true },
    statusUpload: { type: Number, required : true },
    frames: [frameClass],
    references: [{type: String}]
});

module.exports = mongoose.model('upload', uploadSchema);