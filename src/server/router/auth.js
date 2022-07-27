'use estrict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require("moment");
const { body , validationResult } = require('express-validator');

const config = require('../config/config');
const connection = require('../utils/db');
const { isNoLoggedUser , isValidUser , authToken } = require('./authMiddlewords')
const { sendEmail } = require('../utils/mail.js')
const { findUserByEmail } = require('../utils/searchingFunctions')

router.get('/register' , isNoLoggedUser , (req,res) => {
    return res.render('./auth/register',{title:'Registro',info:req.query.i});
});

router.post('/register', isNoLoggedUser ,

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
    
    const hash = bcrypt.hashSync(req.body.password, 10);

    const queryvalues = `'${req.body.names}','${req.body.lastname}','${req.body.company}','${req.body.email}','${hash}',${req.body.rol},0`;

    connection.query(
        `INSERT INTO usuarios (Nombre,Apellido,Empresa,Email,Passwords,Rol,Confirmado) VALUES (${queryvalues});`, err => {
            if (err) {
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            } else {
                console.log('Se ha guardado el registro exitosamente.')
            }
        }
    )
    return res.redirect('./register?i=8')
    
});

router.get('/login', isNoLoggedUser , (req,res) => {
    return res.render('./auth/login',{title:'Iniciar Sesion',info:req.query.i});
});

router.post('/login', isNoLoggedUser , 

  body('email').isEmail().normalizeEmail().bail().custom( value => {
    return findUserByEmail(value).then(users => {
        if ( users.length < 1 ) {
          return Promise.reject('Usuario o contrasena incorrectos');
        };
    })
  }),
//   body('password').isStrongPassword(),

  (req,res) => {
    
    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query( 
        
        `SELECT u.*, c.Compania FROM usuarios AS u INNER JOIN clients AS c ON u.Empresa = c.Id WHERE u.Email = '${req.body.email}';`, (err,result) => {
            
            if (!err) {
                
                if ( result.length < 1 ) {
                    
                    return res.redirect('./login?i=0');
                
                } else {
                
                    const isValidUser = req.body.email == result[0].Email.toLowerCase();
                    const isValidPass = bcrypt.compareSync(req.body.password, result[0].Passwords);   

                    if ( isValidUser && isValidPass ){

                        if ( result[0].Confirmado == 0 ) { 
                        
                            return res.redirect('../?confirmed=0');
                        
                        } else {
                        
                            req.session.userData=result[0];

                            return res.redirect('../');
                        
                        }
                    } else {
                       
                        return res.redirect('./login?i=14');
                    
                    }
                }
                
            } else {

                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

router.get('/logout',isValidUser,(req,res) => {
    req.session.destroy();
    return res.redirect('../');    
});

router.get('/forgottenPassword', (req,res) =>{
    if(req.session.userData) {
        return res.render('./auth/forgottenPassword',{title:'Reestablecer contrasena',info:req.query.i, rol:req.session.userData.Rol});
    } else {
        return res.render('./auth/forgottenPassword',{title:'Reestablecer contrasena',info:req.query.i});
    }
});

router.get('/resetPassword/:token?/:i?', authToken,(req,res) =>{
    if(req.tokenInfo == 'Error') {
        return res.render('./errors/error', 
        {
        title:'Error',
        errorName:'La solicitud es invalida',
        error:'No es posible realizar el cambio de contrasena. Esto puede deberse a que su solicitud caduco.Verifique que su peticion haya sido ralizada hace menos de una hora.',
        solution:'Para solucionar esto puede realizar una nueva solicitud',
        link:'Nueva solicitud', 
        linkHref:'/auth/forgottenPassword', 
        });
    } else {
        return res.render('./auth/resetPassword',
        {
        title:'Reestablecer contrasena',
        token:req.params.token,
        info:req.params.i, 
        });
    };
});

router.post('/resetPassword/:token', 
  authToken, 
  
  body('newPassword').isStrongPassword(),
  body('newPassword2').isStrongPassword().bail().custom( ( value , { req } ) => {
    if (value !== req.body.newPassword) {
      throw new Error('Las contrasenas no coinciden');
    } else {
        return true;
    }
  }),

  (req,res) =>{

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    const hash = bcrypt.hashSync(req.body.newPassword, 10);

    connection.query(

        `UPDATE usuarios SET Passwords = '${hash}' WHERE Id = '${req.userId}';`, err => {

            if (err) {

                console.log(`Ha ocurrido el siguiente error: ${err}`);

                return res.redirect('/')

            } else {

                console.log('Se ha modificado la contrasena exitosamente.')
                return res.redirect('../login?i=13')

            };

        }

    );

});

router.post('/forgottenPassword', 
  body('email').isEmail().normalizeEmail().bail().custom( value => {
    return findUserByEmail(value).then(users => {
        if ( users.length < 1 || users[0].Confirmado != 1 ) {
          return Promise.reject('El usuario no es valido');
        };
    })
  }),

  ( req , res ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) { return res.status(400).send( errors['errors'] ) }

    connection.query(

        `SELECT Id, Confirmado FROM usuarios WHERE Email = '${req.body.email}';`, (err,result) => {
        
            if (!err) {
        
                if(result.length > 0) {

                    const userId = result[0].Id; 
                    const createToken = (id) => {
                        const secretKey = config.TOKEN_SECRET_KEY;
                        const payload = {
                            sub: id,
                            iat: moment().unix(),
                            exp: moment().add(3600, 'seconds').unix(),
                        };
                        return jwt.encode(payload,secretKey);
                    };
                    const token = createToken(userId);
                    sendEmail(req.body.email,'resetPassword',token)

                    return res.redirect('./login?i=10')    
                    
                } else  {
                    return res.redirect('./forgottenPassword?i=12')
                };
            };
        }
    )
});

module.exports = router;