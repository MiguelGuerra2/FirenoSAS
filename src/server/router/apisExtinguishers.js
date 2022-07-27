//External imports
const express = require('express');
const router = express.Router();
const { body , param , validationResult } = require('express-validator');

//Local imports
const connection = require('../utils/db');
const { isValidUser, isExtinguishersUser , isExtinguishersAdmin } = require('./authMiddlewords');
const { findExtinguisherById, findElementById, findAgentById } = require('../utils/searchingFunctions')

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

// Get specific extinguisher
router.get('/getExtinguisher/:extinguisherID',
  isValidUser,
  isExtinguishersUser,
  param('extinguisherID').isInt().bail().custom( (value , { req } ) => { 

    return findExtinguisherById( value ).then( element => {

        if ( element.length == 0 || ( req.session.userData.Rol == 6 && element[0].Client != req.session.userData.Empresa ) ) {
        
            return Promise.reject('Invalid extinguisher');
    
        };
    
    })
  
  }),
  
  (req,res) => {

    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(403).send( 'No tiene permisos para ver este extintor' ) }

    connection.query( 

        `SELECT * FROM extintores AS ex INNER JOIN clients AS cl ON ex.Client = cl.Id INNER JOIN agents AS ag ON ex.Agent = ag.Id_Agent WHERE Id_Extinguisher = ${req.params.extinguisherID} ORDER BY ex.Id_Extinguisher DESC;`, (err,result) => {

            if (!err) {

                return res.send(result);

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);

            };

        }

    );

});

// Create extinguisher
router.post('/createExtinguisher',isValidUser,isExtinguishersAdmin, 
    body('client').isInt().bail().custom( value => {
        return findElementById(value,'clients').then(clients => {
            if ( clients.length < 1 ) {
              return Promise.reject('Usuario invalido');
            };
        })
    }),
    body('agent').isInt().bail().custom( value => {
        return findAgentById(value).then(agents => {
            if ( agents.length < 1 ) {
              return Promise.reject('Agente invalido');
            };
        })
    }),
    body('capacity').isDecimal(),
    (req,res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    const queryvalues = `'${req.body.client}','${req.body.agent}','${req.body.capacity}'`;

    connection.query(
        `INSERT INTO extintores (Client,Agent,Capacity) VALUES (${queryvalues});`, err => {
            if (err) {  
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha guardado el registro exitosamente.')
            }
        }
    )

    return res.redirect('../extinguishers')

});

// Update extinguisher
router.post('/updateExtinguisher',isValidUser,isExtinguishersAdmin, 
    body('id').isInt().bail().custom( value => {
        return findExtinguisherById(value).then(extinguishers => {
            if ( extinguishers.length < 1 ) {
            return Promise.reject('Extintor invalido');
            };
        })
    }),
    body('client').isInt().bail().custom( value => {
        return findElementById(value,'clients').then(clients => {
            if ( clients.length < 1 ) {
              return Promise.reject('Usuario invalido');
            };
        })
    }).optional({ checkFalsy: true }),
    body('agent').isInt().bail().custom( value => {
        return findAgentById(value).then(agents => {
            if ( agents.length < 1 ) {
              return Promise.reject('Agente invalido');
            };
        })
    }).optional({ checkFalsy: true }),
    body('capacity').isDecimal().optional({ checkFalsy: true }),
    (req,res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    let queryTxt =`UPDATE extintores SET `;

    req.body.client ? queryTxt += `Client = '${req.body.client}',` : null
    req.body.agent ? queryTxt += `Agent = '${req.body.agent}',` : null
    req.body.capacity ? queryTxt += `Capacity = '${req.body.capacity}',` : null 
    
    queryTxt += ` Id_Extinguisher = '${req.body.id}' WHERE Id_Extinguisher = '${req.body.id}';`

    connection.query(
        queryTxt, err => {
            if (err) {  
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha guardado el registro exitosamente.')
            }
        }
    )

    return res.redirect(`../extinguishers/maintenances/${req.body.id}`)

});

// Delete extinguisher
router.post('/deleteExtinguisher',isValidUser,isExtinguishersAdmin, 
    body('id').isInt().bail().custom( value => {
        return findExtinguisherById(value).then(extinguishers => {
            if ( extinguishers.length < 1 ) {
              return Promise.reject('Extintor invalido');
            };
        })
    }),
    (req,res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query(
        `DELETE FROM extintores WHERE Id_Extinguisher = ${req.body.id}`, err => {
            if (err) {  
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha eliminado el registro exitosamente.')
            }
        }
    )

    return res.redirect('../extinguishers')

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

// Get maintenances from specific extinguisher
router.get('/getMaintenances/:extinguisherID',
  isValidUser, 
  isExtinguishersUser,
  param('extinguisherID').isInt().bail().custom( (value , { req } ) => { 

    return findExtinguisherById( value ).then( element => {

        if ( element.length == 0 || ( req.session.userData.Rol == 6 && element[0].Client != req.session.userData.Empresa ) ) {
    
            return Promise.reject('Invalid extinguisher');
    
        };
    
    })
  
  }),
  
  (req,res) => {

    const errors = validationResult(req);
    
    if ( !errors.isEmpty() ) { return res.status(403).send( 'No tiene permisos para ver este mantenimiento' ) }

    connection.query( 

        `SELECT ma.Id, ma.Created_At, ma.Valid_Until, ma.Comment FROM mantenimientos AS ma INNER JOIN extintores AS ex ON ex.Id_Extinguisher = ma.Extinguisher_Id WHERE ma.Extinguisher_Id = ${req.params.extinguisherID} ORDER BY ma.Id DESC`, (err,result) => {

            if (!err) {

                return res.send(result);

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);

            };

        }

    );

});

// Create extinguisher
router.post('/createMaintenance',isValidUser,isExtinguishersAdmin, 
    body('extinguisher_id').isInt().bail().custom( value => {
        return findExtinguisherById(value).then(clients => {
            if ( clients.length < 1 ) {
                return Promise.reject('Extintor invalido');
            };
        })
    }),
    body('created_at').isDate(),
    body('valid_until').isDate(),
    body('comment').escape(),
    (req,res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    let comment
    req.body.comment ? comment = req.body.comment : comment = 'Sin comentarios.'

    const queryvalues = `'${req.body.extinguisher_id}','${req.body.created_at}','${req.body.valid_until}','${comment}'`;

    connection.query(
        `INSERT INTO mantenimientos (Extinguisher_Id,Created_At,Valid_Until,Comment) VALUES (${queryvalues});`, err => {
            if (err) {  
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha guardado el registro exitosamente.')
            }
        }
    )

    return res.redirect(`../extinguishers/maintenances/${req.body.extinguisher_id}`)

});

router.post('/updateMaintenance',isValidUser,isExtinguishersAdmin, 
    body('extinguisher_id').isInt().optional({ checkFalsy: true}).bail().custom( value => {
        return findExtinguisherById(value).then(clients => {
            if ( clients.length < 1 ) {
                return Promise.reject('Extintor invalido');
            };
        })
    }),
    body('maintenance_id').isInt().bail().custom( value => {
        return findElementById(value,'mantenimientos').then(clients => {
            if ( clients.length < 1 ) {
                return Promise.reject('Mantenimiento invalido');
            };
        })
    }),
    body('created_at').isDate().optional({ checkFalsy: true}),
    body('valid_until').isDate().optional({ checkFalsy: true}),
    body('comment').escape().optional({ checkFalsy: true}),
    (req,res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    let queryTxt =`UPDATE mantenimientos SET `;

    req.body.created_at ? queryTxt += `Created_At = '${req.body.created_at}',` : null
    req.body.valid_until ? queryTxt += `Valid_Until = '${req.body.valid_until}',` : null
    req.body.comment ? queryTxt += `Comment = '${req.body.comment}',` : `Comment = 'Sin comentarios.'`
    
    queryTxt += ` Id = '${req.body.maintenance_id}' WHERE Id = '${req.body.maintenance_id}';`

    connection.query(
        queryTxt, err => {
            if (err) {  
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha guardado el registro exitosamente.')
            }
        }
    )

    return req.body.extinguisher_id ? res.redirect(`../extinguishers/maintenances/${req.body.extinguisher_id}`) : res.redirect(`../extinguishers/maintenances/`)

});

// Delete maintenance
router.post('/deleteMaintenance',isValidUser,isExtinguishersAdmin, 
    body('id').isInt().bail().custom( value => {
        return findElementById(value,'mantenimientos').then(maintenances => {
            if ( maintenances.length < 1 ) {
              return Promise.reject('Mantenimiento invalido');
            };
        })
    }),
    body('extinguisherId').isInt(),
    (req,res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query(
        `DELETE FROM mantenimientos WHERE Id = ${req.body.id}`, err => {
            if (err) {  
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha eliminado el registro exitosamente.')
            }
        }
    )

    return res.redirect(`../extinguishers/maintenances/${req.body.extinguisherId}`)

});

module.exports = router;