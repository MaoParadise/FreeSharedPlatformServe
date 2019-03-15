const jwt = require('jsonwebtoken');
const helpers = {}


helpers.isAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).send('Unauthorized request >:( ')
}

helpers.checkCredentials = (req, res, next) =>{
    let sessionCredentials = false;
    let tokenCredentials = true;

    if(req.isAuthenticated()){
        sessionCredentials = true;
    }
    try {
        if(!req.headers.authorization){
            tokenCredentials = false;
        }
        let token = req.headers.authorization.split(' ')[1]
        if(token === 'null'){
            tokenCredentials = false;
        }
        let payload = jwt.verify(token, 'BakoParadise57145894');
        if(!payload) {
            tokenCredentials = false;
        }
        req._id = payload.subject;
    } catch (error) {
        tokenCredentials = false;
    }

    if(sessionCredentials === true && tokenCredentials === true){
        return res.status(200).json({
            status : `Credentials are available`,
            success : true,
        })
    }else{
        return res.json({
            status : `Credentials are not available`,
            success : false,
        })
    }

    
}

helpers.verifyToken = (req, res, next) => {
    try {
        if(!req.headers.authorization){
            return res.status(401).send('Unauthorized request >:( ')
        }
        let token = req.headers.authorization.split(' ')[1]
        if(token === 'null'){
            return res.status(401).send('Unauthorized request >:( ')
        }
        let payload = jwt.verify(token, 'BakoParadise57145894');
        if(!payload) {
            return res.status(401).send('Unauthorized request >:( ')
        }
        req._id = payload.subject;
    } catch (error) {
        return res.status(401).send('Unauthorized request >:( ')
    }
    next();
}


module.exports = helpers