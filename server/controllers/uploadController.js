const Upload = require('../models/media/upload');


const uploadCtrl = {};

uploadCtrl.getUploads = async (req, res) =>{
    const upload = await Upload.find()
    res.json(upload)
}

uploadCtrl.getUpload = async (req, res) => {
    const upload = await Upload.findById(req.params.id);
    res.json(upload);
}

uploadCtrl.createUpload = async (req, res) => {
    const upload = new Upload({
        _idUser: req.body._idUser,
        episode: req.body.episode, 
        dateUpload: req.body.dateUpload,
        updateUpload: req.body.updateUpload,
        statusUpload: req.body.statusUpload,
        frames: req.body.frames
    });
    await upload.save();
    res.json({
        'status': 'Upload Saved',
        'success' : true
    });
}

uploadCtrl.editUpload = async (req, res) => {
    const { id } = req.params;
    const upload = {
        updateUpload: req.body.updateUpload,
        statusUpload: req.body.statusUpload
    };
    await Upload.findByIdAndUpdate(id, {$set: upload}, {new: true});
    res.json({
        status: 'Upload updated',
        'success' : true
    })
}

uploadCtrl.pushFrame = async (req, res) => {
    const { id } = req.params;
    await Upload.findByIdAndUpdate(id, {$push: 
    { 
        frames: req.body
    }
    });

    res.json({
        status: 'Frame pushed',
        'success' : true
    })
}

uploadCtrl.deleteUpload = async (req, res) =>  {
    const { id } = req.params;
    await Upload.findByIdAndRemove(id);
    res.json({
        status: 'Upload removed',
        'success' : true
    })
}

module.exports = uploadCtrl;