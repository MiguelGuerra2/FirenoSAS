//External imports
const express = require('express');
const router = express.Router();
const path = require('path')
const multer  = require('multer')
const fs = require('fs');

const connection = require('../utils/db');

// Multer is used to save PDF files on server
const upload = multer({
    storage: multer.diskStorage({
        destination: __dirname+'/../../webapp/public/certificates',
        filename: (req, file, cb) => {
            cb( null, req.body.cc + path.parse(file.originalname).ext);
        }
    })
});

// Admin middleword
const authAdmin = (req,res,next) => {
    if (req.session.userData) {
        if (req.session.userData.Rol == 4) {
            return next();
        }else {
            return res.redirect('/');
        };
    };
};

// Get all certificates from DB
router.get('/getCertificates',authAdmin,(req,res) => {
    connection.query( 
        `SELECT * FROM certificates ORDER BY Valid_Until`, (err,result) => {
            if (!err) {
                return res.send(result);
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            };
        }
    );
});

// Save new certificate on DB and save PDF file on server
router.post('/createCertificate',authAdmin, upload.single('certificate') ,(req,res) => {
    const data = req.body;
    const queryvalues = `'${data.name}','${data.lastname}','${data.cc}','${data.created_at}','${data.valid_until}','${data.client}'`;
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
router.post('/updateCertificate',authAdmin,(req,res) => {
    const cc = req.body.updateId;
    const newName = req.body.newName;
    const newLastname = req.body.newLastname;
    const newCc = req.body.newCc;
    const newCreatedAt = req.body.newCreated_at;
    const newValidUntil = req.body.newValid_until;
    const newClient = req.body.newClient;

    let queryTxt =`UPDATE certificates SET `;

    if (newName){
        queryTxt += `Name = '${newName}',`;
    }
    if (newLastname){
        queryTxt += `Lastname = '${newLastname}',`;
    }
    if (newCc){
        queryTxt += `Cc = '${newCc}',`;
    }
    if (newCreatedAt){
        queryTxt += `Created_At = '${newCreatedAt}',`;
    }
    if (newValidUntil){
        queryTxt += `Valid_Until = '${newValidUntil}',`;
    }
    if (newClient){
        queryTxt += `Client = '${newClient}'`;
    }    
    if (newCc) {
        queryTxt += `Cc = '${newCc}' WHERE Cc = '${cc}';`;
    }else {
        queryTxt += ` Cc = '${cc}' WHERE Cc = '${cc}';`;
    };
    
    connection.query( 
        queryTxt, (err,result) => {
            if (!err) {
                console.log('Registro actualizado exitosamente')
                if (newCc) {
                    fs.rename(__dirname+`/../public/certificates/${cc}.pdf`,__dirname+`/../public/certificates/${newCc}.pdf`, err => {
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
router.get('/deleteCertificate',authAdmin,(req,res) => {
    const cc = req.query.cc;
    connection.query( 
        `DELETE FROM certificates WHERE Cc = ${cc}`, (err,result) => {
            if (!err) {
                // Delete PDF file on server
                const fs = require('fs');
                const path = `/../../webapp/public/certificates/${cc}.pdf`;
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