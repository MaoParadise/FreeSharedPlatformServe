const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user/user');

passport.serializeUser((user, done) =>{
    done(null, user._id);
});

passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})
     
    
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
},
(req, email, password, done) =>{ 
    User.findOne(
        {
            $or: [{'local.email' : email}, {'local.user': email}] 
        },
        (err, user)=>{
    if(err){
        console.log('ERROR');
        return done(null, false, { message: 'ERROR'});
    }
    if(!user){
        console.log('Not User found');
        return done(null, false, { message: 'Not User found'});
        
    }else{
        if(user.validatePassword(password)){
            console.log('aqui 3');
            return done(null, user);
            
        }else{
            console.log('password error');
            return done(null, false, (null, false, { message: 'password error'}))

        }
    }
})}));
