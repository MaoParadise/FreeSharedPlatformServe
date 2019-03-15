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

userCtrl.editUser = async (req, res) => {
    const { id } = req.params;
    const user = {
        email: req.body.email,
        user: req.body.user,
        password: req.body.password,
        publicName: req.body.publicName,
        urlProfile: req.body.urlProfile,
        statusProfile: req.body.statusProfile
    };
    await User.findByIdAndUpdate(id, {$set: user}, {new: true});
    res.json({
        status: 'User updated',
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


module.exports = userCtrl;