'use estrict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../db');
const {authUser} = require('./authMiddlewords')
const {sendEmail} = require('../mail.js')

let session,nombre,apellido,empresa,email,rol,pass1,pass2,queryvalues;

router.get('/register', (req,res) => {
    const info = req.query.i;
    if(req.session.userData){
        return res.redirect('../');
    } else if (info != undefined) {
        res.render('./auth/register',{title:'Registro',info:info});
    } else {
        res.render('./auth/register',{title:'Registro'});
    }
});

router.post('/register', ({body},res) => {
    nombre = body.names;
    apellido = body.lastname;
    empresa = body.company;
    email = body.email;
    rol = body.rol;
    pass1 = body.password;
    pass2 = body.pass2;

    connection.query(
        `SELECT Id FROM usuarios WHERE Email = '${email}';`, (err,result) => {
            if (!err) {
                if(result.length > 0) {
                    return res.redirect('./register?i=1')
                } else  {
                    if( nombre == null || nombre.length == 0 ){
                        return res.redirect('./register?i=2')
                    }else if( apellido == null || apellido.length == 0 ){
                        return res.redirect('./register?i=3')
                    }else if( empresa == null || empresa.length == 0 ){
                        return res.redirect('./register?i=4')
                    }else if( !(/\S+@\S+\.\S+/.test(email.value) || email.length > 0) ) {
                        return res.redirect('./register?i=5')
                    }else if( pass1 == null || pass1.length < 8 ) {
                        return res.redirect('./register?i=6')
                    }else if( pass1 != pass2 ) {
                        return res.redirect('./register?i=7')
                    }else {
                        const hash = bcrypt.hashSync(body.password, 10);
                    
                        queryvalues = `'${nombre}','${apellido}','${empresa}','${email}','${hash}',${rol},0`;

                        connection.query(
                            `INSERT INTO usuarios (Nombre,Apellido,Empresa,Email,Passwords,Rol,Confirmado) VALUES (${queryvalues});`, err => {
                                if (err) {
                                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                                } else {
                                    console.log('Se ha guardado el registro exitosamente.')
                                }
                            }
                        )
                        res.redirect('./register?i=8')
                    }
                }
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

router.get('/login', (req,res) => {
    if(req.session.userData){
        res.redirect('../');
    } else {
        res.render('./auth/login',{title:'Iniciar Sesion'});
    }
});

router.post('/login', (req,res) => {
    connection.query(
        `SELECT * FROM usuarios WHERE Email = '${req.body.email}';`, (err,result) => {
            if (!err) {
                if(result.length < 1) {
                    res.send('El usuario no existe, registrate ahora!')
                } else {
                    const infoUsuario = result[0];
                    const isValidUser = req.body.email == infoUsuario.Email;
                    const isValidPass = bcrypt.compareSync(req.body.password, infoUsuario.Passwords);    
                    if(isValidUser && isValidPass){
                        session=req.session;
                        session.userData=infoUsuario;
                        res.redirect('../');
                    }
                    else{
                        res.status(401).render('./statusResponse/401');
                    }
                }
                
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

router.get('/logout',authUser,(req,res) => {
    session.destroy();
    res.redirect('../');    
});

router.get('/forgottenPassword', (req,res) =>{
    const info = req.query.i;
    if (info != undefined) {
        res.render('./clientsTools/forgottenPassword',{title:'Reestablecer contrasena',info:info});
    } else {
        res.render('./clientsTools/forgottenPassword',{title:'Reestablecer contrasena'});
    }
    
});

router.get('/resetPassword', (req,res) =>{
    res.render('./clientsTools/resetPassword',{title:'Reestablecer contrasena'})
});


router.post('/forgottenPassword', ({body},res) => {
    const email = body.email;
    connection.query(
        `SELECT Confirmado FROM usuarios WHERE Email = '${email}';`, (err,result) => {
            if (!err) {
                if(result.length > 0) {
                    if(result[0].Confirmado == 1){
                        sendEmail(email,'resetPassword')
                        return res.redirect('./forgottenPassword?i=10')    
                    } else {
                        return res.redirect('./forgottenPassword?i=11')
                    }
                } else  {
                    return res.redirect('./forgottenPassword?i=12')
                };
            };
        }
    )
});

module.exports = router;