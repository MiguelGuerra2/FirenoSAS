const isNoLoggedUser = (req, res, next) => {
 
    if ( req.session.userData ) { 

        if ( req.session.userData.Confirmado == 1 ){
    
            return res.redirect('/')

        } else {

            return next();

        }
    
    } else {
    
        return next();

    };

}

const isValidUser = (req, res, next) => {
 
    if ( req.session.userData ) { 
    
        return next();        
    
    } else {
    
        console.log('No ha iniciado sesion')
        return res.redirect('/');

    };

}

const isAdmin = (req,res,next) => {
    
    if (req.session.userData.Rol == 3) {

        return next();

    } else {

        return res.status(401).redirect('/')

    };

};

const isClient = (req,res,next) => {
    
    if ( req.session.userData.Rol == 1 || req.session.userData.Rol == 2 ) {
        
        return next();
    
    } else {
    
        return res.status(401).redirect('../')
    
    };

};

const isCertificatesAdmin = (req,res,next) => {
    
    if ( req.session.userData.Rol == 4 ) {
        
        return next();
    
    } else {
    
        return res.status(401).redirect('../')
    
    };

};

const isExtinguishersUser = (req,res,next) => {
    
    if ( req.session.userData.Rol == 5 || req.session.userData.Rol == 6 ) {
        
        return next();
    
    } else {
    
        return res.status(401).redirect('../')
    
    };

};

const isExtinguishersAdmin = (req,res,next) => {
    
    if ( req.session.userData.Rol == 5 ) {
        
        return next();
    
    } else {
    
        return res.status(401).redirect('../')
    
    };

};

const isExtinguishersClient = (req,res,next) => {
    
    if ( req.session.userData.Rol == 6 ) {
        
        return next();
    
    } else {
    
        return res.status(401).redirect('../')
    
    };

};

const authToken = (req,res,next) => {

    const jwt = require('jwt-simple');
    const moment = require("moment");
    const config = require('../config/config');

    const token = req.params.token;
    const secret = config.TOKEN_SECRET_KEY;

    if( token == undefined ) {
    
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



module.exports = {
    isNoLoggedUser,
    isValidUser,
    isAdmin,
    isClient,
    isCertificatesAdmin,
    isExtinguishersUser,
    isExtinguishersAdmin,
    isExtinguishersClient,
    authToken
};