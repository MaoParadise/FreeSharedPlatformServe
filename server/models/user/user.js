const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

// const userSchema = new Schema({
//     email: { type: String, required: true},
//     user: { type: String, require: true },
//     password: { type: String, required: true},
//     publicName: { type: String },
//     urlProfile: { type: String, required: true},
//     statusProfile: { type: Number, required : true}
// });

const userSchema = new Schema({
    local: {
        email: String,
        user: String,
        password: String,
        publicName: String,
        urlProfile: String,
        statusProfile: Number     
    },
    facebook: {
        email: String,
        user: String,
        password: String,
        publicName: String,
        urlProfile: String,
        statusProfile: Number,
        _faceId: String,
        token: String
    },
    twitter: {
        email: String,
        user: String,
        password: String,
        publicName: String,
        urlProfile: String,
        statusProfile: Number,
        _twiId: String,
        token: String
    },
    google: {
        email: String,
        user: String,
        password: String,
        publicName: String,
        urlProfile: String,
        statusProfile: Number,
        _gooId: String,
        token: String
    }
});

userSchema.methods.generateHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};


userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
  };

module.exports = mongoose.model('user', userSchema);