'use estrict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../db');
const {authUser} = require('./authMiddlewords')
let session,nombre,apellido,empresa,email,rol,pass1,pass2,queryvalues;

router.get('/register', (req,res) => {
    if(req.session.userData){
        return res.redirect('../');
    }
    res.render('./auth/register',{title:'Registro'});
});

router.post('/register', ({body},res) => {
    nombre = body.name;
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
                    return res.send('Ya existe un usuario con el correo electronico ingresado.')
                } else  {
                    //Validar campos del formulario
                    //Validar nombre
                    if( nombre == null || nombre.length == 0 ){
                        return res.send('Ingrese un nombre valido')
                    }else if( apellido == null || apellido.length == 0 ){
                        return res.send('Ingrese un apellido valido')
                    }else if( empresa == null || empresa.length == 0 ){
                        return res.send('Ingrese una empresa valida')
                    }else if( !(/\S+@\S+\.\S+/.test(email.value) || email.length > 0) ) {
                        return res.send('Ingrese un email valido')
                    }else if( pass1 == null || pass1.length < 8 ) {
                        return res.send('Ingrese una contrasena valida')
                    }else if( pass1 != pass2 ) {
                        return res.send('Las contrasenas no coinciden')
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
                        res.render('./statusResponse/200')
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

module.exports = router;