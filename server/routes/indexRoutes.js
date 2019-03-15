const express = require('express');
const router = express.Router();


router.get('/', (req, res) =>{
    res.json({
        message : ' Bako API ',
        version : ' 0.0.1',
        Author : 'MaoParadise',
        condition: 'private'
    })
});

module.exports = router;