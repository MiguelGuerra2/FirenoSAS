'use estrict';

//External imports
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body , validationResult } = require('express-validator');

//Local imports
const connection = require('../utils/db');
const { isValidUser , isAdmin } = require('./authMiddlewords');
const { findElementById, findUserByEmail, findMachineBySpecs, findClientByName } = require('../utils/searchingFunctions');

//Get all users and machines info
router.get( '/getElements',isValidUser,isAdmin , (req,res) => {
    
    let queryTxt
    
    // Get users (q=1) and Get Machines (q=2)
    req.query.q == 1 
    ? queryTxt = `SELECT u.*, c.Compania FROM usuarios AS u INNER JOIN clients AS c ON u.Empresa = c.Id WHERE u.Id != ${req.session.userData.Id} ORDER BY u.Id DESC;`
    : queryTxt = `SELECT e.*, u.*,e.id AS Id FROM equipos AS e INNER JOIN usuarios AS u ON u.Id = e.Cliente ORDER BY e.Id DESC;`

    // Get all users info
    connection.query(

        queryTxt, (err,result) => {

            if (!err) {

                return res.send(result)

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500)

            }
        }
    )

});

//Get all info from specific user
router.get('/getElement',isValidUser,isAdmin,(req,res) => {

    connection.query(
       
        `SELECT * FROM usuarios AS u INNER JOIN clients AS c ON u.Empresa = c.Id WHERE u.Id = '${req.query.id}';`, (err,result) => {
       
            if (!err) {
       
                return res.send(result)
       
            } else {
       
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500)
       
            }
        }
    )
});

//Get list of clients companys
router.get('/getClients',isValidUser,isAdmin,(req,res) => {
    
    connection.query(
    
        `SELECT * FROM clients ORDER BY Id DESC;`, (err,result) => {
    
            if (!err) {
    
                return res.send(result)
    
            } else {
    
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500)
    
            }
        }
    )
});

//Create a new user
router.post('/createUser',
  isValidUser,
  isAdmin,

  // Form validations

  body('names').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}),
  body('lastname').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}),
  body('company').isInt(),
  body('email').isEmail().normalizeEmail().bail().custom( value => {
    return findUserByEmail(value).then(users => {
        if ( users.length > 0 ) {
          return Promise.reject('El email ya existe');
        };
    })
  }),
  body('rol').isInt(),
  body('password').isStrongPassword(),
  body('pass2').isStrongPassword().bail().custom( ( value , { req } ) => {
    if (value !== req.body.password) {
      throw new Error('Las contrasenas no coinciden');
    } else {
        return true;
    }
  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    // Hash password
    const hash = bcrypt.hashSync(req.body.password, 10);

    const queryvalues = `'${req.body.names}','${req.body.lastname}','${req.body.company}','${req.body.email}','${hash}','${req.body.rol}',1`;

    connection.query(

        `INSERT INTO usuarios (Nombre,Apellido,Empresa,Email,Passwords,Rol,Confirmado) VALUES (${queryvalues});`, err => {
        
            if (err) {
        
                console.log(`Ha ocurrido el siguiente error: ${err}`);
        
            } else {
        
                console.log('Se ha guardado el registro exitosamente.')
                return res.redirect('/tools/users?m=3')

            };
        }
    );
           
});

//Update user info
router.post('/updateUser',
  isValidUser,
  isAdmin,

  // Form validations

  body('id').isInt().bail().custom( ( value , { req } ) => { 
    return findElementById( value , 'usuarios' ).then( element => {
        if ( value == req.session.userData.Id || element.length == 0 ) {
          return Promise.reject('Invalid user');
        };
    })
  }),
  body('names').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}).optional({ checkFalsy: true }),
  body('lastname').isLength({min:3, max:50}).isAlpha('es-ES', {ignore: ' '}).optional({ checkFalsy: true }),
  body('company').isInt().optional({ checkFalsy: true }),
  body('rol').isInt().optional({ checkFalsy: true }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    // Build query string

    let queryTxt =`UPDATE usuarios SET `;

    req.body.names ? queryTxt += `Nombre = '${req.body.names}',` : null
    req.body.lastname ? queryTxt += `Apellido = '${req.body.lastname}',` : null
    req.body.company ? queryTxt += `Empresa = '${req.body.company}',` : null
    req.body.rol ? queryTxt += `Rol = '${req.body.rol}',` : null

    queryTxt += ` Id = ${req.body.id} WHERE Id = '${req.body.id}';`;

    // Verify one change at least

    if (!req.body.names && !req.body.lastname && !req.body.company && !req.body.rol) {

        return res.redirect('/tools/users?m=10')
    
    };
    
    connection.query(

        queryTxt, (err,result) => {
            
            if (!err) {

                console.log('Registro actualizado exitosamente')
                return res.status(200).redirect('/tools/users?m=4')
            
            } else {
            
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500).redirect('/tools/users?m=5')
            
            };
        }
    );
});

//Confirm user account
router.post('/confirmUser',
  isValidUser,
  isAdmin,

  // Form validations

  body('id').isInt().bail().custom( ( value ) => { 

    return findElementById( value , 'usuarios' ).then( element => {

        if ( element.length == 0 ) { return Promise.reject('Invalid user') }

        if ( element[0].Confirmado == 1 ) { return Promise.reject('User already confirmed') }

    })

  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    connection.query(

        `UPDATE usuarios SET Confirmado = 1 WHERE Id = ${req.body.id}`, (err,result) => {

            if (!err) {

                console.log('Usuario confirmado exitosamente');
                return res.redirect('/tools/users?m=9');

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
                res.status(500).redirect('/tools/users');                

            };
        }
        
    );      
    
});

//Delete specific user
router.post('/deleteUser',
  isValidUser,
  isAdmin,

  // Form validations

  body('id').isInt().bail().custom( ( value ) => { 

    return findElementById( value , 'usuarios' ).then( element => {

        if ( element.length == 0 ) { return Promise.reject('Invalid user') }

    })

  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    connection.query(

        `DELETE FROM usuarios WHERE Id = ${req.body.id}`, (err,result) => {

            if (!err) {

                console.log('Usuario eliminado exitosamente');
                return res.redirect('/tools/users?m=1');

            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
                res.status(500).redirect('/tools/users');                

            };
        }
        
    );      
    
});

//Create a new machine
router.post('/createMachine',
  isValidUser,  
  isAdmin,

  // Form validations

  body('number').isInt(),
  body('reference').isAlphanumeric('en-US',{ignore: ' '}),
  body('trademark').isAlphanumeric('en-US',{ignore: ' '}),
  body('clients').isInt().bail().custom( ( value , { req } ) => {
    return findMachineBySpecs( req.body ).then( element => {

        if ( element.length > 0 ) { return Promise.reject('Machine already exists') }

    })

  }),

  ( req , res ) => {

    const errors = validationResult(req);

    // Handle validation errors
    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    const queryvalues = `'${req.body.reference}','${req.body.trademark}','${req.body.number}','${req.body.clients}'`;

    connection.query(
        `INSERT INTO equipos (Referencia,Marca,Numero,Cliente) VALUES (${queryvalues});`, err => {
            if (err) {
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha creado la maquina exitosamente.');
                return res.redirect('/tools/machines?m=3');
            };
        }
    );
                
});

//Update machine info
router.post('/updateMachine',
  isValidUser,
  isAdmin,

  // Form validations

  body('id').isInt().bail().custom( ( value , { req } ) => { 
    return findElementById( value , 'equipos' ).then( element => {
        if ( element.length == 0 ) {
          return Promise.reject('Invalid machine');
        };
    })
  }),
  body('number').isInt().optional({ checkFalsy: true }),
  body('reference').isAlphanumeric('en-US',{ignore: ' '}).optional({ checkFalsy: true }),
  body('trademark').isAlphanumeric('en-US',{ignore: ' '}).optional({ checkFalsy: true }),
  body('clients').isInt().bail().custom( ( value , { req } ) => {
    return findMachineBySpecs( req.body ).then( element => {

      if ( element.length > 0 ) { return Promise.reject('Machine already exists') }

    })
  
  }).optional({ checkFalsy: true }),

  ( req , res ) => {

    const errors = validationResult(req);

    // Handle validation errors

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    let queryTxt =`UPDATE equipos SET `;
    
    req.body.number ? queryTxt += `Numero = '${req.body.number}',` : null
    req.body.reference ? queryTxt += `Referencia = '${req.body.reference}',` : null
    req.body.trademark ? queryTxt += `Marca = '${req.body.trademark}',` : null
    req.body.clients ? queryTxt += `Cliente = '${req.body.clients}',` : null
    
    queryTxt += `Id = ${req.body.id} WHERE Id = '${req.body.id}';`;

    connection.query(

        queryTxt, (err,result) => {
        
            if (!err) {
        
                console.log('Registro actualizado exitosamente')
                return res.status(200).redirect(`/tools/machines?m=4`)
        
            } else {
        
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500).redirect(`/tools/machines?m=5`)
        
            };
        }
    );
});

//Delete specific machine
router.post('/deleteMachine',
  isValidUser,
  isAdmin,
  
  // Form validations

  body('id').isInt().bail().custom( ( value ) => {

    return findElementById( value , 'equipos' ).then( element => {

        if ( element.length == 0 ) { return Promise.reject('Invalid machine') }

    })

  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query(`DELETE FROM equipos WHERE Id = ${req.body.id}`,(err,result) => {
          
        if (!err) {
        
            return res.redirect('/tools/machines?m=1');
        
        } else {
        
            console.log(`Ha ocurrido el siguiente ${err}`);
            return res.status(500).redirect('/tools/machines?m=2');
            
        }
        
    })

});

//Create a new client
router.post('/createClient',
  isValidUser,
  isAdmin,

  // Form validations
  body('name').isAlphanumeric('en-US',{ignore: ' '}).bail().custom( ( value ) => { 
    return findClientByName( value ).then( element => {
        
        if ( element.length > 0 ) {
        
            return Promise.reject('Client already exists');
        
        };
    
    })
  
  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }
    
    connection.query(

        `INSERT INTO clients (Compania) VALUES ('${req.body.name}');`, err => {
            
            if ( !err ) {

                console.log('Se ha creado el cliente exitosamente.');
                return res.redirect('/tools/clients?m=3');
                
            } else {
                
                console.log(`Ha ocurrido el siguiente error: ${err}`);                
                return res.redirect('/tools/clients?m=6');

            };
        
        }
    
    );
                        
});

//Update client info
router.post('/updateClient',
  isValidUser,
  isAdmin,

  // Form validations
  body('id').isInt().bail().custom( ( value ) => { 
    return findElementById( value , 'clients' ).then( element => {
        
        if ( element.length == 0 ) {
        
            return Promise.reject('Invalid client');
        
        };
    
    })
  
  }),
  body('names').isAlphanumeric('en-US',{ignore: ' '}).bail().custom( ( value ) => { 
    return findClientByName( value ).then( element => {
        
        if ( element.length > 0 ) {
        
            return Promise.reject('Client already exists');
        
        };
    
    })
  
  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query(

        `UPDATE clients SET Compania = '${req.body.names}' WHERE Id = '${req.body.id}';`, (err,result) => {
        
            if (!err) {
        
                console.log('Registro actualizado exitosamente')
                return res.status(200).redirect(`/tools/clients?m=4`)
        
            } else {
        
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500).redirect(`/tools/clients`)
        
            };
        
        }
    
    );

});

//Delete specific machine
router.post('/deleteClient',
  isValidUser,
  isAdmin,

  // Form validations

  body('id').isInt().bail().custom( ( value ) => {

    return findElementById( value , 'clients' ).then( element => {

        if ( element.length == 0 ) { return Promise.reject('Invalid client') }

    })

  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query(`DELETE FROM clients WHERE Id = ${req.body.id}`,(err,result) => {

        if (!err) {

            return res.redirect('/tools/clients?m=1');

        } else {

            console.log(`Ha ocurrido el siguiente ${err}`);
            return res.status(500).redirect('/tools/clients?m=2');
            
        }
        
    })

});

module.exports = router;