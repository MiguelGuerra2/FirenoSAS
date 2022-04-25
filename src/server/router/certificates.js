'use estrict';

// External imports
const express = require('express');
const router = express.Router();
const connection = require('../utils/db');

// Admin Middleword
const authAdmin = (req,res,next) => {
    if (req.session.admin) {
        return next();
    }else {
        return res.redirect('/');
    };
};

// Home
router.get('/',(req,res) => {
    if(req.session.admin){
        return res.redirect('/admin');
    } else {
        return res.render('./certificates/certificatesHome',{title:'Consultas'});
    };
});

// Home-Post : Show query results
router.post('/',(req,res) => {
    const id = req.body.id;
    connection.query( 
        `SELECT * FROM certificates WHERE Id = ${id} OR Cc = ${id}`, (err,result) => {
            if (!err) {
                if (result.length < 1) {
                    return res.render('./certificates/certificatesHome',{title: 'Consultas',certificateInfo:'noCertificate'});
                }
                return res.render('./certificates/certificatesHome',{title: 'Consultas',certificateInfo:result[0]});
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            };
        }
    );
});

// Admin Home
router.get('/admin',authAdmin,(req,res) => {
    return res.render(`./admin`,{title:'Inicio Administrador',header:'off'});
});

// Update certificate
router.get('/update',authAdmin,(req,res) => {
    return res.render(`./update`,{title:'Actualizar Informacion'});
});

module.exports = router;