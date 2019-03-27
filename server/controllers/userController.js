const User = require('../models/user/user');
const jwt = require('jsonwebtoken');


const userCtrl = {};

userCtrl.getUsers = async (req, res) =>{
    const user = await User.find()
    res.json(user)
}

userCtrl.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
}

userCtrl.getCurrentUser = async (req, res) => {
    let passportSession = req.session.passport;
    let token = req.headers.authorization.split(' ')[1]
    let payload = jwt.decode(token, 'BakoParadise57145894');
    if(JSON.stringify(passportSession.user) == JSON.stringify(payload.subject)){
        const user = await User.findById(passportSession.user);
        if(user != null){  
            return res.json({
                success : true,
                local: {
                    _email: user.local.email,
                    _crtU: user.local.user,
                    _crtSts: user.local.status,
                    _crtPU: user.local.publicName,
                    _crtImg: user.local.urlProfile
                },
                facebook: {
                    _email: user.facebook.email,
                    _crtU: user.facebook.user,
                    _crtSts: user.facebook.status,
                    _crtPU: user.facebook.publicName,
                    _crtImg: user.facebook.urlProfile
                },
                google: {
                    _email: user.google.email,
                    _crtU: user.google.user,
                    _crtSts: user.google.status,
                    _crtPU: user.google.publicName,
                    _crtImg: user.google.urlProfile
                }
            });
        }else{
            return res.status(401).json({
                status : `The credentials are not for this user`,
                success : false,
            });
        }    
    }else{
        return res.status(401).json({
            status : `The credentials are not for this user`,
            success : false,
        });
    }
}

userCtrl.createLocalUser = async (req, res) => {
    const user = new User();
    const query = await User.find(
        {
        $or: [{'local.email' : req.body.email}, {'local.user': req.body.user}] 
        }
    )
    if(query[0]){
        res.json({
            status : 'The email of user already exits in the data base',
            success : false,   
            token: 'invalid Token'
        });
    }else{
        user.local.email = req.body.email;
        user.local.user = req.body.user;
        user.local.password = user.generateHash(req.body.password);
        user.local.publicName = req.body.publicName;
        if(req.body.urlProfile){
            user.local.urlProfile = req.body.urlProfile;
        }else{
            user.local.urlProfile = 'no-profile';
        }
        if(user.local.statusProfile){
            user.local.statusProfile = req.body.statusProfile;
        }else{
            user.local.statusProfile = 200;
        }
        await user.save();
        let payload = { subject : user._id }
        let token =  jwt.sign(payload, 'BakoParadise57145894');
        res.json({
            status : 'User Saved',
            success : true,
            _bodyInfo: {
                _trak_: token,
                _prik: user._id,
                _email: user.local.email,
                _crtU: user.local.user,
                _crtPU: user.local.publicName,
                _crtImg: user.local.urlProfile,
                _crtSts: user.local.statusProfile
            }
        });
    }
    
   
}


userCtrl.editUser = async (req,res) =>{
    let passportSession = req.session.passport;
    let sameEmail = 'available-email';
    const id  = passportSession.user
    const user = await User.findById(id);
    const query = await User.find({'local.email' : req.body.email});


    if(query[0]){
        console.log(query[0]);
        if(query[0].local.email == user.local.email){
            sameEmail = 'same-email';
        }else{
            sameEmail = 'occupied-email'
        }
    }else{
        sameEmail = 'available-email';
    }
 
    if(user.local != null){ 
        if(req.body.email != '' && req.body.email != null){
            if(sameEmail == 'same-email'){
                user.local.email = req.body.email;
            }else if(sameEmail == 'occupied-email'){
                return res.json({
                    status: 'Error, the email is occupied by other user',
                    error: sameEmail,
                    'success' : false
                })
            }else if(sameEmail == 'available-email'){
                user.local.email = req.body.email;
            }
        } 
        if(req.body.user != '' && req.body.user != null){
            user.local.user = req.body.user
        }
        if(req.body.password != '' && req.body.password != null){
            user.local.password = req.body.password
        }
        if(req.body.publicName != '' && req.body.publicName != null){
            user.local.publicName = req.body.publicName;
        }
        if(req.body.urlProfile != '' && req.body.urlProfile != null){
            user.local.urlProfile = req.body.urlProfile;
        }
        if(req.body.statusProfile != '' && req.body.statusProfile != null){
            user.local.statusProfile = req.body.statusProfile
        }
    }

    await user.save();
    res.json({
        status: 'User updated',
        urlProfile: user.local.urlProfile,
        'success' : true
    })
}


userCtrl.deleteUser = async (req, res) =>  {
    const { id } = req.params;
    await User.findByIdAndRemove(id);
    res.json({
        status: 'User removed',
        'success' : true
    })
}

userCtrl.verifyIdentity = async (req, res) => {
    let passportSession = req.session.passport;
    let token = req.headers.authorization.split(' ')[1]
    let payload = jwt.decode(token, 'BakoParadise57145894');
    if(JSON.stringify(passportSession.user) == JSON.stringify(payload.subject)){
        return res.status(200).json({
            status : `The credentials are available for this specify user`,
            success : true,
        });
    }else{
        return res.status(401).json({
            status : `The credentials are not for this user`,
            success : false,
        });
    }
}

module.exports = userCtrl;