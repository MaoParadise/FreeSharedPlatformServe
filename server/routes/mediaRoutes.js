const express = require('express');
const router = express.Router();
const { isAuthenticated,verifyToken, checkCredentials } = require('../helpers/auth');
const media = require('../controllers/mediaController');


router.post('/',isAuthenticated, media.createUpload);

router.post('/find/title',isAuthenticated, media.getMediaByTitle);

router.get('/find/id',isAuthenticated, media.getMediaById);

router.post('/push/references', media.pushReferences);

module.exports = router;