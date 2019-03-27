
const frameClass = require('./frame')

const uploadClass = {
    episode: { type: Number },
    dateUpload: { type: Date },
    updateUpload: { type: Date },
    statusUpload: { type: Number},
    frames: [frameClass]
};

module.exports = uploadClass;