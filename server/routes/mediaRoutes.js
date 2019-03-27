const express = require('express');
const router = express.Router();

const media = require('../controllers/mediaController');

router.post('/', media.createUpload);

router.post('/find/title', media.getMediaByTitle);

module.exports = router;