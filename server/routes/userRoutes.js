const express = require('express');
const router = express.Router();
const passport = require('passport');

const user = require('../controllers/userController');
const { isAuthenticated,verifyToken, checkCredentials } = require('../helpers/auth');

const User = require('../models/user/user');
const jwt = require('jsonwebtoken');



router.get('/', isAuthenticated, verifyToken, user.getUsers);
router.get('/:id', user.getUser);
router.post('/', user.createLocalUser);
router.put('/:id', user.editUser);
router.delete('/:id', user.deleteUser);



router.post('/auth/signin', (req, res, next) => {
    passport.authenticate('local-login', {
      successRedirect: '/api/user/auth/localSuccess/'+req.body.email,
      failureRedirect: '/api/user/auth/localFailure'
    })(req, res, next);
});

router.get('/auth/check', checkCredentials);

router.get('/auth/localSuccess/:email', async (req, res) => {
    const { email } = req.params;
    const query = await User.find(
        {
        $or: [{'local.email' : email}, {'local.user': email}] 
        }
    )
    if(query[0]){
        let payload = { subject :query[0]._id }
        let token =  jwt.sign(payload, 'BakoParadise57145894');
        res.json({
            status : 'User Saved',
            success : true,
            id: query[0]._id, 
            _bodyInfo: {
                _trak_: token,
                _prik: query[0]._id,
                _email: query[0].local.email,
                _crtU: query[0].local.user,
                _crtPU: query[0].local.publicName,
                _crtImg: query[0].local.urlProfile,
                _crtSts: query[0].local.statusProfile
            }
        });
    }else{
        res.json({
            status : `The User isn't validated`,
            success : false,
            id: 'invalid _id',   
            token: 'invalid Token'
        });
    }
});

router.get('/auth/localFailure', (req, res) => {
    res.json({
        status : `The User isn't validated`,
        success : false,
        id: 'invalid _id',   
        token: 'invalid Token'
    });
});

router.get('/auth/logout', isAuthenticated, (req, res) => {
    req.logout();
    return res.status(200).json({
        status : `Logout successfully`,
        success : true,
    })
});
 
module.exports = router;