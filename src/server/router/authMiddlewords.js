const authUser = (req, res, next) => {
    if (req.session.userData)
        if (req.session.userData.Confirmado == 1){
            return next();
        } else {
            return res.redirect('/')
        }
    else
        return res.redirect('/');
};

const authApiAdmin = (req,res,next) => {
    if (req.session.userData) {
        if (req.session.userData.Confirmado = 1) {
            if (req.session.userData.Rol == 3) {
                return next();
            } else {
                return res.status(401).redirect('/')
            };
        } else {
            console.log('Usuario no confirmado')
            return res.redirect('/')                
        }
    }else {
        console.log('No ha iniciado sesion')
        return res.redirect('/')
    };
};

const authApiClient = (req,res,next) => {
    if (req.session.userData) {
        if (req.session.userData.Confirmado = 1) {
            if (req.session.userData.Rol != 3) {
                return next();
            } else {
                return res.status(401).redirect('../')
            };
        } else {
            console.log('Usuario no confirmado')
            return res.redirect('/')  
        }
    }else {
        console.log('No ha iniciado sesion')
        return res.redirect('/')
    };
};

const authToken = (req,res,next) => {
    const jwt = require('jwt-simple');
    const moment = require("moment");
    const config = require('../config/config');

    const token = req.params.token;
    const secret = config.TOKEN_SECRET_KEY;
    if(token == undefined) {
        return res.redirect('/')
    };
    try {
        const decoded = jwt.decode(token,secret);
        if (decoded.exp <= moment().unix()) {
            req.tokenInfo = 'Error'
            return next();
        } else {
            req.userId = decoded.sub;
            return next();
        };
    } catch (e) {
        req.tokenInfo = 'Error'
        return next();
    };
};

module.exports = {authUser,authApiAdmin,authApiClient,authToken};