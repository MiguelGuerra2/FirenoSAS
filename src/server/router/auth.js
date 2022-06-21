'use estrict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require("moment");

const config = require('../config/config');
const connection = require('../utils/db');
const {authUser,authToken} = require('./authMiddlewords')
const {sendEmail} = require('../utils/mail.js')

router.get('/register', (req,res) => {
    if(req.session.userData){
        return res.redirect('../');
    } else {
        return res.render('./auth/register',{title:'Registro',info:req.query.i});
    };
});

router.post('/register', ({body},res) => {
    const nombre = body.names;
    const apellido = body.lastname;
    const empresa = body.company;
    const email = body.email.toLowerCase();
    const rol = body.rol;
    const pass1 = body.password;
    const pass2 = body.pass2;

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
                    
                        const queryvalues = `'${nombre}','${apellido}','${empresa}','${email}','${hash}',${rol},0`;

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
        return res.redirect('../');
    } else {
        return res.render('./auth/login',{title:'Iniciar Sesion',info:req.query.i});
    };
});

router.post('/login', (req,res) => {
    connection.query( 
        `SELECT u.*, c.Compania FROM usuarios AS u INNER JOIN clients AS c ON u.Empresa = c.Id WHERE u.Email = '${req.body.email}';`, (err,result) => {
            if (!err) {
                if(result.length < 1) {
                    return res.redirect('./login?i=0');
                } else {
                    const infoUsuario = result[0];
                    const isValidUser = req.body.email.toLowerCase() == infoUsuario.Email.toLowerCase();
                    const isValidPass = bcrypt.compareSync(req.body.password, infoUsuario.Passwords);    
                    if(isValidUser && isValidPass){
                        session=req.session;
                        session.userData=infoUsuario;
                        connection.relase
                        res.redirect('../');
                    }
                    else{
                        return res.redirect('./login?i=14');
                    }
                }
                
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            }
        }
    )
});

router.get('/logout',authUser,(req,res) => {
    req.session.destroy();
    res.redirect('../');    
});

router.get('/forgottenPassword', (req,res) =>{
    if(req.session.userData) {
        return res.render('./auth/forgottenPassword',{title:'Reestablecer contrasena',info:req.query.i, rol:req.session.userData.Rol});
    } else {
        return res.render('./auth/forgottenPassword',{title:'Reestablecer contrasena',info:req.query.i, rol:undefined});
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
        rol:req.session.userData.Rol
        });
    } else {
        return res.render('./auth/resetPassword',
        {
        title:'Reestablecer contrasena',
        token:req.params.token,
        info:req.params.i, 
        rol:req.session.userData.Rol
        });
    };
});

router.post('/resetPassword/:token', authToken, (req,res) =>{
    const newPassword = req.body.newPassword;
    const newPassword2 = req.body.newPassword2;
    if( newPassword == null || newPassword.length < 8 ) {
        return res.redirect(`./${req.params.token}/6`)
    } else if( newPassword2 == null || newPassword2.length < 8 || newPassword!=newPassword2) {
        return res.redirect(`./${req.params.token}/7`)
    } else {
        const hash = bcrypt.hashSync(newPassword, 10);
        connection.query(
            `UPDATE usuarios SET Passwords = '${hash}' WHERE Id = '${req.userId}';`, err => {
                if (err) {
                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                    res.redirect('/')
                } else {
                    console.log('Se ha modificado la contrasena exitosamente.')
                    res.redirect('../login?i=13')
                };
            }
        );
    };
});

router.post('/forgottenPassword', ({body},res) => {
    const email = body.email;
    connection.query(
        `SELECT Id, Confirmado FROM usuarios WHERE Email = '${email}';`, (err,result) => {
            if (!err) {
                if(result.length > 0) {
                    if(result[0].Confirmado == 1){
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
                        sendEmail(email,'resetPassword',token)

                        return res.redirect('./login?i=10')    
                    } else {
                        return res.redirect('./login?i=11')
                    }
                } else  {
                    return res.redirect('./forgottenPassword?i=12')
                };
            };
        }
    )
});

module.exports = router;