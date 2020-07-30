const jwt = require('jsonwebtoken');
require('dotenv').config();


const uploadAuth = (req, res, next) => {
    if(req.id){
        next();
    }else{
        throw  new Error('Required Login');
    }
};

const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,process.env.SecrectKEY );
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.id = decodedToken.id;
    next();
};



module.exports = {
    isAuth,
    uploadAuth

};