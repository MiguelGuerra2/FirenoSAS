'use estrict';

// External imports
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body , query , validationResult } = require('express-validator');


// Local imports
const connection = require('../utils/db');
const { isValidUser , isClient } = require('./authMiddlewords');

//Function to find elements from specific table on DB by Id
const findElementById = ( id , table ) => {
    
    return new Promise((resolve, reject) => {

        connection.query(

            `SELECT * FROM ${table} WHERE Id = ${id};`, (err,result) => {
    
                if (!err) {
                                        
                    resolve(result);
                
                } else {
                
                    console.log(`Ha ocurrido el siguiente ${err}`)
                    
                    reject(err);
                
                }
            }
        )     
    })
}

// Get last coords of machines
router.get('/getCoordsRealTime',isValidUser,isClient,(req,res) => {
    
    let queryString;

    req.session.userData.Rol == 1 ? queryString = `SELECT * FROM informacion AS i INNER JOIN equipos AS e ON i.Equipo = e.Id INNER JOIN usuarios AS u ON e.Cliente = u.Id INNER JOIN clients AS cl ON cl.Id = u.Empresa WHERE i.Id IN (SELECT MAX(Id) FROM informacion GROUP BY Equipo) AND e.Cliente = ${req.session.userData.Id};` : null
    req.session.userData.Rol == 2 ? queryString = `SELECT * FROM informacion AS i INNER JOIN equipos AS e ON i.Equipo = e.Id INNER JOIN usuarios AS u ON e.Cliente = u.Id INNER JOIN clients AS cl ON cl.Id = u.Empresa WHERE i.Id IN (SELECT MAX(Id) FROM informacion GROUP BY Equipo);` : null
    
    connection.query(

        queryString, (err,result) => {

            if (!err) {

                return res.send(result);

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
                return res.status(500);

            };

        }

    );

});

// get coords between two dates
router.get('/getCoordsRecord',
  isValidUser,
  isClient,

  query('machine').isInt(),  
  query('idate').isDate(),
  query('fdate').isDate(),

  ( req , res ) => {
    // Initial date
    const idate = req.query.idate;
    // Final date
    const fdate = req.query.fdate;
    // Machine number
    const machine = req.query.machine;

    let queryString;
    req.session.userData.Rol == 1 ? queryString = `SELECT * FROM informacion AS i INNER JOIN equipos AS e ON i.Equipo = e.Id WHERE e.Cliente = ${req.session.userData.Id} AND i.Equipo = ${machine} AND (i.Hora_envio BETWEEN '${idate}' AND '${fdate}');` : null
    req.session.userData.Rol == 2 ? queryString = `SELECT * FROM informacion AS i INNER JOIN equipos AS e ON i.Equipo = e.Id WHERE i.Equipo = ${machine} AND (i.Hora_envio BETWEEN '${idate}' AND '${fdate}');` : null
    
    connection.query(

        queryString , (err,result) => {
        
            if (!err) {
        
                return res.send(result);
        
            } else {
        
                console.log(`Ha ocurrido el siguiente ${err}`);
                return res.status(500);
        
            };
        
        }
    
    );

});

// Update user info
router.post('/updateInfo',
  isValidUser,
  
  body('id').isInt().bail().custom( ( value , { req } ) => { 

    return findElementById( value , 'usuarios' ).then( element => {
    
        if ( value != req.session.userData.Id || element.length == 0 ) {
    
            return Promise.reject('Invalid user');
    
        };
    
    })
  
  }),

  body('newName').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}).optional({ checkFalsy: true }),
  body('newLastname').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}).optional({ checkFalsy: true }),

  (req,res) => {

    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    let queryTxt =`UPDATE usuarios SET `;

    if ( req.body.newName ) {
        queryTxt += `Nombre = '${req.body.newName}',`
        req.session.userData.Nombre  = req.body.newName
    }

    if ( req.body.newName ) {
        queryTxt += `Apellido = '${req.body.newLastname}',`
        req.session.userData.Apellido = req.body.newLastname
    }

    queryTxt += `Id = ${req.body.id} WHERE Id = '${req.body.id}';`;

    connection.query(

        queryTxt, (err,result) => {

            if (!err) {
    
                console.log('Registro actualizado exitosamente')
                return res.status(200).redirect('/tools/profile?info=3')
    
            } else {
    
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500).redirect('/tools/profile?info=4')
    
            };

        }

    );
    
});

// Update user password
router.post('/updatePassword',
  isValidUser,
  
  body('id').isInt().bail().custom( ( value , { req } ) => { 

    return findElementById( value , 'usuarios' ).then( element => {
    
        if ( value != req.session.userData.Id || element.length == 0 ) {
    
            return Promise.reject('Invalid user');
    
        };
    
    })
  
  }),
  body('oldPassword').isStrongPassword().bail().custom( ( value , { req } ) => {

    if ( !bcrypt.compareSync( value , req.session.userData.Passwords ) ) { 
        throw new Error('La contrasena actual no es correcta'); 
    } else { return true }
  
  }),
  body('newPassword').isStrongPassword().bail().custom( ( value , { req } ) => {

    if ( value == req.body.oldPassword ) { 
        throw new Error('La nueva contrasena debe ser diferente a la actual'); 
    } else { return true }
  
  }),
  body('newPassword2').isStrongPassword().bail().custom( ( value , { req } ) => {

    if (value !== req.body.newPassword ) { throw new Error('Las contrasenas no coinciden'); } else { return true }
  
  }),

  (req,res) => {

    const errors = validationResult(req);
    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    const hash = bcrypt.hashSync(req.body.newPassword, 10);
    req.session.userData.Password = hash;

    connection.query(

        `UPDATE usuarios SET Passwords = '${hash}' WHERE Id = '${req.body.id}';`, (err,result) => {
        
            if (!err) {
        
                console.log('Registro actualizado exitosamente')
                return res.status(200).redirect('/tools/profile?info=3')
        
            } else {
        
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500).redirect('/tools/profile?info=4')
        
            };
        
        }
    
    );
    
});


module.exports = router;