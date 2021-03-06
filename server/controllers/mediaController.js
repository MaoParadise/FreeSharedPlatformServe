const Media = require('../models/media/media');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
const fs = require('fs-extra')

const mediaCtrl = {};

mediaCtrl.getMediaByTitle = async (req, res) => {
    const media = await Media.find({title: {$regex: req.body.title}});
    res.json(media);
}

mediaCtrl.getMediaById = async (req, res) => {
    let passportSession = req.session.passport;
    const media = await Media.find({_idUser: passportSession.user});
    res.json(media);
}

mediaCtrl.createUpload = async (req, res) => {
    try{
        let passportSession = req.session.passport;
        const {title, totalEpisodes, description, studio, releaseDate} = req.body;
        const media = new Media();
        /* */
        media._idUser = passportSession.user;
        media.title = title;
        media.totalEpisodes =  parseInt(totalEpisodes);
        media.description = description;
        media.studio = studio;
        media.releaseDate = releaseDate;
        media.statusMedia = 200
        
        if(req.file === null || req.file === undefined){
            media.miniature_id = 'no-id';
            media.miniature = '';
        }else{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {height: 400, width: 640, crop: "scale"});
            media.miniature_id = result.public_id;
            media.miniature = result.url;
            await fs.unlink(req.file.path);
        } 

        await media.save();

        return res.json({ 
            'status': 'Media Saved',
            '_id': media._id,
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

mediaCtrl.pushFrame = async (req, res) =>{
    
}

mediaCtrl.pushReferences = async (req, res) => {
    try{
        const { id, references } = req.body;
        await Media.findByIdAndUpdate(id, 
        { 
            references: references
        }
        );
    
        res.json({
            status: 'References updated',
            'success' : true
        })
    }catch(err){
        return res.status(401).json({
            'status': 'Failure',
            'error': err,
            'success' : false
        });
    }
}


mediaCtrl.modifiedMedia = async (req, res) => {
    try{
        const { _id, 
            title, 
            studio, 
            statusMedia, 
            releaseDate, 
            miniature_id, 
            miniature,
            description,
            totalEpisodes,
            references,
            upload
        } = req.body;

        await Media.findByIdAndUpdate(_id, 
            {
                title: title,
                studio: studio,
                statusMedia: 200,
                releaseDate: releaseDate,
                miniature_id: miniature_id,
                miniature: miniature,
                description: description,
                totalEpisodes: totalEpisodes,
                references: references,
                upload: upload
            });
        res.json({
            status: 'Media updated',
            'success' : true
        })
    }catch(err){
        return res.status(401).json({
            'status': 'Failure',
            'error': err,
            'success' : false
        });
    }
}


module.exports = mediaCtrl;