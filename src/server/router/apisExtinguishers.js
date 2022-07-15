//External imports
const express = require('express');
const router = express.Router();
const { param , validationResult } = require('express-validator');

//Local imports
const connection = require('../utils/db');
const { isValidUser, isExtinguishersUser , isExtinguishersAdmin } = require('./authMiddlewords');

//Function to find elements from specific table on DB by Id
const findExtinguisherById = ( id , req ) => {
    
    return new Promise((resolve, reject) => {

        connection.query(

            `SELECT * FROM extintores WHERE Id_Extinguisher = ${id};`, (err,result) => {
    
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

// Get all extinguishers from DB
router.get('/getExtinguishers',isValidUser,isExtinguishersUser, (req,res) => {
    
    let queryTxt =''
    req.session.userData.Rol == 6 
    ? queryTxt = `SELECT * FROM extintores AS ex INNER JOIN clients AS cl ON ex.Client = cl.Id INNER JOIN agents AS ag ON ex.Agent = ag.Id_Agent WHERE ex.Client = ${req.session.userData.Empresa} ORDER BY ex.Id_Extinguisher DESC` 
    : queryTxt = `SELECT * FROM extintores AS ex INNER JOIN clients AS cl ON ex.Client = cl.Id INNER JOIN agents AS ag ON ex.Agent = ag.Id_Agent ORDER BY ex.Id_Extinguisher DESC`
    
    connection.query( 

        queryTxt, (err,result) => {

            if (!err) {

                return res.send(result);

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);

            };

        }

    );
    
});

// Get all maintenances from DB
router.get('/getMaintenances',isValidUser,isExtinguishersAdmin, (req,res) => {
   
    connection.query( 
   
        `SELECT * FROM mantenimientos AS ma INNER JOIN extintores AS ex ON ex.Id_Extinguisher = ma.Extinguisher_Id ORDER BY ma.Id DESC`, (err,result) => {
   
            if (!err) {
   
                return res.send(result);
   
            } else {
   
                console.log(`Ha ocurrido el siguiente ${err}`);
   
            };
   
        }
   
    );

});

// Get maintentnaces from specific extinguisher
router.get('/getMaintenances/:extinguisherID',
  isValidUser, 
  isExtinguishersUser,
  param('extinguisherID').isInt().bail().custom( (value , { req } ) => { 

    return findExtinguisherById( value ).then( element => {

        if ( element.length == 0 || element[0].Client != req.session.userData.Empresa ) {
    
            return Promise.reject('Invalid extinguisher');
    
        };
    
    })
  
  }),
  
  (req,res) => {

    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(400).send( 'No tiene permisos para ver este mantenimiento' ) }

    let queryTxt

    req.session.userData.Rol == 6 
    ? queryTxt = `SELECT * FROM mantenimientos AS ma INNER JOIN extintores AS ex ON ex.Id_Extinguisher = ma.Extinguisher_Id WHERE ex.Client = ${req.session.userData.Empresa} AND ma.Extinguisher_Id = ${req.params.extinguisherID} ORDER BY ma.Id DESC`
    : queryTxt = `SELECT * FROM mantenimientos AS ma INNER JOIN extintores AS ex ON ex.Id_Extinguisher = ma.Extinguisher_Id WHERE ma.Extinguisher_Id = ${req.params.extinguisherID} ORDER BY ma.Id DESC`

    connection.query( 

        queryTxt, (err,result) => {

            if (!err) {

                return res.send(result);

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);

            };

        }

    );

});

module.exports = router;