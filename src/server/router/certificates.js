'use estrict';

// External imports
const express = require('express');
const router = express.Router();
const connection = require('../utils/db');
const { body , validationResult } = require('express-validator');

// Local imports
const { isValidUser, isCertificatesAdmin } = require('./authMiddlewords');

// Get all clients info
router.get('/apiClients', (req,res) => {
    connection.query( 
        `SELECT * FROM clients;`, (err,result) => {
            if (!err) {
                res.send(result);
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            };
        }
    );
});

// Home
router.get('/',(req,res) => {
    if(req.session.Rol == 4){
        return res.redirect('/admin');
    } else {
        return res.render('./certificates/certificatesHome',{title:'Consultas'});
    };
});

// Home-Post : Show query results
router.post('/',
  body('id').isInt(),

  (req,res) => {

    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query( 
        
        `SELECT * FROM certificates AS ce INNER JOIN clients AS cl WHERE ce.Id = ${req.body.id} OR ce.Cc = ${req.body.id}`, (err,result) => {
        
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
router.get('/admin',isValidUser,isCertificatesAdmin, (req,res) => {
    
    const firstName = req.session.userData.Nombre.split(' ')[0];

    return res.render('./certificates/adminCertificates',{title:'Inicio Administrador', rol:req.session.userData.Rol, header:'off', name1:firstName});

});

module.exports = router;