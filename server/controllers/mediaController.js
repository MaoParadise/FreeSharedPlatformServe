const Media = require('../models/media/media');

const mediaCtrl = {};

mediaCtrl.getMediaByTitle = async (req, res) => {
    const media = await Media.find({title: {$regex: req.body.title}});
    res.json(media);
}

mediaCtrl.createUpload = async (req, res) => {
    try{
        const media = new Media(req.body);
        await media.save();
        return res.json({
            'status': 'Media Saved',
            'success' : true
        });
    }catch(err){
        return res.status(401).json({
            'status': 'Failure the credentials of users',
            'error': err,
            'success' : false
        });
    }
    
}

module.exports = mediaCtrl;