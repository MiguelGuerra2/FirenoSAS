'use estrict';

// External imports
const express = require('express');
const router = express.Router();
const connection = require('../utils/db');

// Admin Middleword
const authAdmin = (req,res,next) => {
    if (req.session.userData) {
        if ( req.session.userData.Rol == 5 ) {
            return next();
        } else {
            return res.redirect('/');
        }
    }else {
        return res.redirect('/');
    };
};

// Client Middleword
const authClient = (req,res,next) => {
    if (req.session.userData) {
        if (req.session.userData.Confirmado = 1) {
            if (req.session.userData.Rol == 6 || req.session.userData.Rol == 5 ) {
                return next();
            } else {
                console.log('Usuario no autorizado')
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

// Home
router.get('/', authClient, (req,res) => {
    if(req.session.userData.Rol == 5){
        return res.render('./extinguishers/extinguishersAdmin',{title:'Admin Extintores', header:'off'});
    } else {
        return res.render('./extinguishers/extinguishersClient',{title:'Extintores', header:'off'});
    };
});

router.get('/maintenances', authClient, (req,res) => {
    if(req.session.userData.Rol == 5){
        return res.render('./extinguishers/maintenancesAdmin',{title:'Mantenimientos', header:'off'});
    } else {
        return res.render('./extinguishers/maintenancesClient',{title:'Mantenimientos', header:'off'});
    };
});

module.exports = router;