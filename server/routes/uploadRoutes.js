const express = require('express');
const router = express.Router();

const upload = require('../controllers/uploadController');

router.get('/', upload.getUploads);
router.get('/:id', upload.getUpload);
router.post('/', upload.createUpload);

router.put('/:id', upload.editUpload);
router.put('/push/:id', upload.pushFrame);

router.delete('/:id', upload.deleteUpload);


module.exports = router;