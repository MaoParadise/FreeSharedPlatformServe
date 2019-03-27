const express = require('express');
const router = express.Router();

const media = require('../controllers/mediaController');

//borrar despues de trasladar a los controllers
const Photo = require('../models/media/Photo')


const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
const fs = require('fs-extra')

// 

router.post('/', media.createUpload);

router.post('/find/title', media.getMediaByTitle);

router.post('/images/add', async (req, res)=> {
    const {title} = req.body;
    if(req.file.size > 1048576){
        await fs.unlink(req.file.path);
        return res.json('el peso de la imagen supera lo permitido');
    }else{
        const result = await cloudinary.v2.uploader.upload(req.file.path, {height: 400, width: 640, crop: "scale"});
        const newPhoto = new Photo({
            title,
            imageURL: result.url,
            public_id: result.public_id
        })
        console.log(req.file);
        await newPhoto.save(); 
        await fs.unlink(req.file.path);
        return res.json('received') 
    }
})

module.exports = router;