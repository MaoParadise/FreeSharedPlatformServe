const mongoose = require('mongoose');
const { Schema } = mongoose;
const user = require('../user/user');
const uploadClass = require('./upload');

const mediaSchema = new Schema({
    _idUser: { type: Schema.ObjectId, ref: 'user' },
    title: {type: String, required : true },
    description: {type: String, required : true },
    totalEpisodes: {type: Number, required : true },
    studio: {type: String, required : true },
    miniature_id: { type: String },
    miniature: { type: String },
    releaseDate: {type: Date},
    // here start the references to other class
    upload: [uploadClass],
    references: [{type: String}],
    statusMedia: {type: Number, required : true }
});

module.exports = mongoose.model('medias', mediaSchema);