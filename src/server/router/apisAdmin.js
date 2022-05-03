'use estrict';

//External imports
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//Local imports
const connection = require('../utils/db');
const {authApiAdmin} = require('./authMiddlewords');

//Get all users and machines info
router.get('/getElements',authApiAdmin,(req,res) => {
    if (req.query.q == 1) {
        connection.query(
            `SELECT * FROM usuarios WHERE Id != ${req.session.userData.Id} ORDER BY Id DESC;`, (err,result) => {
                if (!err) {
                    return res.send(result)
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`)
                    return res.status(500)
                }
            }
        )
    } else if (req.query.q == 2) {
        connection.query(
            `SELECT * FROM equipos ORDER BY Id DESC;`, (err,result) => {
                if (!err) {
                    return res.send(result)
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`)
                    return res.status(500)
                }
            }
        )
    };
});

//Get all info from specific user
router.get('/getElement',authApiAdmin,(req,res) => {
    const id = req.query.id;
    connection.query(
        `SELECT * FROM usuarios WHERE Id = '${id}';`, (err,result) => {
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
router.post('/createUser',authApiAdmin,({body},res) => {
    const nombre = body.name;
    const apellido = body.lastname;
    const empresa = body.company;
    const email = body.email;
    const rol = body.rol;
    const pass1 = body.password;
    const pass2 = body.pass2;

    connection.query(
        `SELECT Id FROM usuarios WHERE Email = '${email}';`, (err,result) => {
            if (!err) {
                if(result.length > 0) {
                    return res.send('Ya existe un usuario con el correo electronico ingresado.');
                } else  {
                    if( nombre == null || nombre.length == 0 ){
                        return res.send('Ingrese un nombre valido');
                    }else if( apellido == null || apellido.length == 0 ){
                        return res.send('Ingrese un apellido valido');
                    }else if( empresa == null || empresa.length == 0 ){
                        return res.send('Ingrese una empresa valida');
                    }else if( !(/\S+@\S+\.\S+/.test(email.value) || email.length > 0) ) {
                        return res.send('Ingrese un email valido');
                    }else if( pass1 == null || pass1.length < 8 ) {
                        return res.send('Ingrese una contrasena valida');
                    }else if( pass1 != pass2 ) {
                        return res.send('Las contrasenas no coinciden');
                    }else {
                        const hash = bcrypt.hashSync(body.password, 10);
                    
                        queryvalues = `'${nombre}','${apellido}','${empresa}','${email}','${hash}',${rol},1`;

                        connection.query(
                            `INSERT INTO usuarios (Nombre,Apellido,Empresa,Email,Passwords,Rol,Confirmado) VALUES (${queryvalues});`, err => {
                                if (err) {
                                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                                } else {
                                    console.log('Se ha guardado el registro exitosamente.')
                                };
                            }
                        );
                        res.render('./statusResponse/200')
                    };
                };
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            };          
        }
    );    
});

//Update user info
router.post('/updateUser',authApiAdmin,(req,res) => {
    let session = req.session;
    const id = req.body.id;
    const nuevoNombre = req.body.name;
    const nuevoApellido = req.body.lastname;
    const nuevaEmpresa = req.body.company;
    const nuevoRol = req.body.rol;
    let queryTxt =`UPDATE usuarios SET `;
    if ((nuevoNombre != null && nuevoNombre != undefined) && nuevoNombre != ''){
        queryTxt += `Nombre = '${nuevoNombre}',`;
    }
    if ((nuevoApellido != null && nuevoApellido != undefined) && nuevoApellido != ''){
        queryTxt += `Apellido = '${nuevoApellido}',`;
    }
    if ((nuevaEmpresa != null && nuevaEmpresa != undefined) && nuevaEmpresa != ''){
        queryTxt += `Empresa = '${nuevaEmpresa}',`;
    }
    if ((nuevoRol != null && nuevoRol != undefined) && nuevoRol != 0 && nuevoRol != ''){
        queryTxt += `Rol = '${nuevoRol}',`;
    }
    queryTxt += ` Id = ${id} WHERE Id = '${id}';`;
    connection.query(
        queryTxt, (err,result) => {
            if (!err) {
                if (session.userData.Id == id){
                    if ((nuevoNombre != null && nuevoNombre != undefined) && nuevoNombre != ''){
                        session.userData.Nombre  = nuevoNombre;
                    };
                    if ((nuevoApellido != null && nuevoApellido != undefined) && nuevoApellido != ''){
                        session.userData.Apellido = nuevoApellido;
                    };
                    if ((nuevaEmpresa != null && nuevaEmpresa != undefined) && nuevaEmpresa != ''){
                        session.userData.Empresa = nuevaEmpresa;
                    };
                    if ((nuevoRol != null && nuevoNombre != undefined) && nuevoRol != 0 && nuevoRol != ''){
                        session.userData.Rol = nuevoRol;
                    };
                };
                console.log('Registro actualizado exitosamente')
                res.status(200).redirect('../tools/updateUser?m=1')
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect('../tools/updateUser?m=2')
            };
        }
    );
});

//Confirm user account
router.get('/confirmUser',authApiAdmin,(req,res) => {
    const id = req.query.id;
    connection.query(
        `SELECT Confirmado FROM usuarios WHERE Id = '${id}';`, (err,result) => {
            if (!err) {
                if (result[0].Confirmado == 1) {
                    console.log('El usuario ya ha sido confirmado');
                    return res.redirect('../tools/users');
                } else {
                    connection.query(
                        `UPDATE usuarios SET Confirmado = 1 WHERE Id = ${id}`, (err,result) => {
                            if (!err) {
                                console.log('Usuario confirmado exitosamente');
                                return res.redirect('../tools/users');
                            } else {
                                console.log(`Ha ocurrido el siguiente ${err}`);
                                res.status(500).redirect('../tools/users');                
                            };
                        }
                    );
                };
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect('../tools/users');
            };
        }
    );
});

//Delete specific user
router.get('/deleteUser',authApiAdmin,(req,res) => {
    const id = req.query.id;
    connection.query(`DELETE FROM usuarios WHERE Id = ${id}`,(err,result) => {
            if (!err) {
                return res.redirect('../tools/users?m=1');
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect('../tools/updateUser?m=2')
            }
        }   
    )
});

//Create a new machine
router.post('/createMachine',authApiAdmin,({body},res) => {
    const numero = body.number;
    const referencia = body.reference;
    const marca = body.trademark;
    const cliente = body.clients;

    connection.query(
        `SELECT Id FROM equipos WHERE Numero = '${numero}' AND Referencia = '${referencia}' AND marca = '${marca}' AND cliente = '${cliente}';`, (err,result) => {
            if (!err) {
                if(result.length > 0) {
                    return res.send('Ya existe una maquina con los datos ingresados.');
                } else  {
                    if( referencia == null || referencia.length == 0 ){
                        return res.send('Ingrese una referencia valida');
                    }else if( marca == null || marca.length == 0 ){
                        return res.send('Ingrese una marca valida');
                    }else if( isNaN(numero) || numero%1 != 0 ){
                        return res.send('Ingrese un numero valido');
                    }else if( isNaN(cliente) || cliente%1 != 0 ) {
                        return res.send('Ingrese un cliente valido');
                    }else {
                    
                        queryvalues = `'${referencia}','${marca}','${numero}','${cliente}'`;

                        connection.query(
                            `INSERT INTO equipos (Referencia,Marca,Numero,Cliente) VALUES (${queryvalues});`, err => {
                                if (err) {
                                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                                } else {
                                    console.log('Se ha creado la maquina exitosamente.');
                                    return res.redirect('/tools/machines');
                                };
                            }
                        );
                        
                    };
                };
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
                return res.re
            };          
        }
    );    
});

//Update machine info
router.post('/updateMachine',authApiAdmin,({body},res) => {
    const id = body.id;
    const nuevoNumero = body.number;
    const nuevaReferencia = body.reference;
    const nuevaMarca = body.trademark;
    let queryTxt =`UPDATE equipos SET `;
    if (nuevoNumero){
        queryTxt += `Numero = '${nuevoNumero}',`;
    };
    if (nuevaReferencia){
        queryTxt += `Referencia = '${nuevaReferencia}',`;
    };
    if (nuevaMarca){
        queryTxt += `Marca = '${nuevaMarca}',`;
    };
    queryTxt += `Id = ${id} WHERE Id = '${id}';`;
    connection.query(
        queryTxt, (err,result) => {
            if (!err) {
                console.log('Registro actualizado exitosamente')
                res.status(200).redirect(`../tools/machines`)
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect(`../tools/machines`)
            };
        }
    );
});

//Delete specific machine
router.get('/deleteMachine',authApiAdmin,(req,res) => {
    const id = req.query.id;
    connection.query(`DELETE FROM equipos WHERE Id = ${id}`,(err,result) => {
            if (!err) {
                return res.redirect('../tools/machines?m=1');
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
                res.status(500).redirect('../tools/machines?m=2');
            }
        }   
    )
});

module.exports = router;