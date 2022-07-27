//External imports
const express = require('express');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs');
const { body , validationResult } = require('express-validator'); 

// Local imports
const { isValidUser , isCertificatesAdmin } = require('./authMiddlewords');
const connection = require('../utils/db');
const { findCertificateByCc } = require('../utils/searchingFunctions')

// Multer is used to save PDF files on server
const upload = multer({
    storage: multer.diskStorage({
        destination: __dirname+'/../../webapp/public/certificates',
        filename: (req, file, cb) => {
            cb( null, req.body.cc + '.pdf');
        }
    })
});

// Get all certificates from DB
router.get('/getCertificates',isValidUser,isCertificatesAdmin,(req,res) => {
    connection.query( 
        `SELECT ce.*, cl.Compania ,ce.Id AS Id FROM certificates AS ce INNER JOIN clients AS cl WHERE ce.Client = cl.Id ORDER BY Valid_Until`, (err,result) => {
            if (!err) {
                return res.send(result);
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            };
        }
    );
});

// Save new certificate on DB and save PDF file on server
router.post('/createCertificate',
  isValidUser,
  isCertificatesAdmin,
  
  upload.single('certificate'),

  body('names').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}),
  body('lastname').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}), 
  body('cc').isInt(),
  body('created_at').isDate(),
  body('valid_until').isDate(),
  body('client').isInt(),

  ( req , res ) => {
  
    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }    
    
    const data = req.body;

    const queryvalues = `'${data.names}','${data.lastname}','${data.cc}','${data.created_at}','${data.valid_until}','${data.client}'`;
  
    connection.query( 
  
        `INSERT INTO certificates (Name,Lastname,Cc,Created_At,Valid_Until,Client) VALUES (${queryvalues});`, (err,result) => {
  
            if (!err) {
  
                return res.redirect('/')
  
            } else {
  
                console.log(`Ha ocurrido el siguiente ${err}`);
  
            };
  
        }
  
    );

});

// Update certificates info
router.post('/updateCertificate',
  isValidUser,
  isCertificatesAdmin,

  body('updateId').isInt().bail().custom( value => {

    return findElementById(value,'certificates').then( certificates => {
    
        if ( certificates.length == 0 ) {
            
            return Promise.reject('Certificate doesnt exists');
    
        };
    
    })
  
  }),
  body('actualCc').isInt().bail().custom( value => {

    return findCertificateByCc( value ).then( certificates => {
    
        if ( certificates.length == 0 ) {
            
            return Promise.reject('Certificate doesnt exists');
    
        };
    
    })

  }),
  body('newName').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}).optional({ checkFalsy: true }),
  body('newLastname').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}).optional({ checkFalsy: true }), 
  body('newCc').isInt().optional({ checkFalsy: true }),
  body('newCreated_at').isDate().optional({ checkFalsy: true }),
  body('newValid_until').isDate().optional({ checkFalsy: true }),
  body('newClient').isInt().optional({ checkFalsy: true }),

  ( req , res ) => { 

    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    let queryTxt =`UPDATE certificates SET `;

    req.body.newName ? queryTxt += `Name = '${req.body.newName}',` : null
    req.body.newLastname ? queryTxt += `Lastname = '${req.body.newLastname}',` : null
    req.body.newCreated_at ? queryTxt += `Created_At = '${req.body.newCreated_at}',` : null 
    req.body.newValid_until ? queryTxt += `Valid_Until = '${req.body.newValid_until}',` : null
    req.body.newClient ? queryTxt += `Client = '${req.body.newClient}',` : null
    req.body.newCc ? queryTxt += `Cc = '${req.body.newCc}',` : null    
    
    queryTxt += ` Id = '${req.body.updateId}' WHERE Id = '${req.body.updateId}';`

    connection.query( 

        queryTxt, ( err , result ) => {
        
            if ( !err ) {
        
                console.log('Registro actualizado exitosamente')
         
                if ( req.body.newCc ) {
         
                    fs.rename(__dirname+`/../../webapp/public/certificates/${req.body.actualCc}.pdf`,__dirname+`/../../webapp/public/certificates/${req.body.newCc}.pdf`, err => {
                        
                        if (err) {
                        
                            console.log(err);
                        
                        };
                    
                    })
                
                };

                return res.redirect('/');

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);

            };

        }

    );
    
});

// Delete certificate
router.post('/deleteCertificate',
  isValidUser,
  isCertificatesAdmin,
  
  body('cc').isInt().bail().custom( value => {

    return findCertificateByCc(value).then( certificates => {
    
        if ( certificates.length == 0 ) {
            
            return Promise.reject('Certificate doesnt exists');
    
        };
    
    })
  
  }),

  ( req , res ) => {

    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    connection.query( 
        `DELETE FROM certificates WHERE Cc = ${req.body.cc}`, (err,result) => {
            
            if (!err) {
            
                // Delete PDF file on server
                const fs = require('fs');
                const path = `/../../webapp/public/certificates/${req.body.cc}.pdf`;
            
                try {
            
                    fs.unlinkSync(__dirname+path);
            
                } catch(err) {
            
                    console.log(err.message);
            
                }
            
                return res.redirect('/');
            
            } else {
            
                console.log(`Ha ocurrido el siguiente ${err}`);
            
            };
        
        }

    );

});

module.exports = router;