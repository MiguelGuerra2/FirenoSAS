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
            `SELECT u.*, c.Compania FROM usuarios AS u INNER JOIN clients AS c ON u.Empresa = c.Id WHERE u.Id != ${req.session.userData.Id} ORDER BY u.Id DESC;`, (err,result) => {
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
            `SELECT e.*, u.*,e.id AS id FROM equipos AS e INNER JOIN usuarios AS u ON u.Id = e.Cliente ORDER BY e.Id DESC;`, (err,result) => {
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
        `SELECT * FROM usuarios AS u INNER JOIN clients AS c ON u.Empresa = c.Id WHERE u.Id = '${id}';`, (err,result) => {
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
router.get('/getClients',authApiAdmin,(req,res) => {
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
router.post('/createUser',authApiAdmin,({body},res) => {
    const nombre = body.names;
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
                    return res.redirect('/tools/users?m=6')
                } else  {
                    if( nombre == null || nombre.length == 0 ){
                        return res.redirect('/tools/users?m=8')
                    }else if( apellido == null || apellido.length == 0 ){
                        return res.redirect('/tools/users?m=8')
                    }else if( empresa == null || empresa.length == 0 ){
                        return res.redirect('/tools/users?m=8')
                    }else if( !(/\S+@\S+\.\S+/.test(email.value) || email.length > 0) ) {
                        return res.redirect('/tools/users?m=8')
                    }else if( pass1 == null || pass1.length < 8 ) {
                        return res.redirect('/tools/users?m=8')
                    }else if( pass1 != pass2 ) {
                        return res.redirect('/tools/users?m=7')
                    }else {
                        const hash = bcrypt.hashSync(body.password, 10);
                    
                        const queryvalues = `'${nombre}','${apellido}','${empresa}','${email}','${hash}',${rol},1`;

                        connection.query(
                            `INSERT INTO usuarios (Nombre,Apellido,Empresa,Email,Passwords,Rol,Confirmado) VALUES (${queryvalues});`, err => {
                                if (err) {
                                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                                } else {
                                    console.log('Se ha guardado el registro exitosamente.')
                                };
                            }
                        );
                        res.redirect('/tools/users?m=3')
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
    const nuevoNombre = req.body.names;
    const nuevoApellido = req.body.lastname;
    const nuevaEmpresa = req.body.company;
    const nuevoRol = req.body.rol;
    let queryTxt =`UPDATE usuarios SET `;
    if (nuevoNombre){
        queryTxt += `Nombre = '${nuevoNombre}',`;
    }
    if (nuevoApellido){
        queryTxt += `Apellido = '${nuevoApellido}',`;
    }
    if (nuevaEmpresa){
        queryTxt += `Empresa = '${nuevaEmpresa}',`;
    }
    if (nuevoRol){
        queryTxt += `Rol = '${nuevoRol}',`;
    }
    if (!nuevoNombre && !nuevoApellido && !nuevaEmpresa && !nuevoRol) {
        return res.redirect('/tools/users?m=8')
    }
    queryTxt += ` Id = ${id} WHERE Id = '${id}';`;
    connection.query(
        queryTxt, (err,result) => {
            if (!err) {
                if (session.userData.Id == id){
                    if (nuevoNombre){
                        session.userData.Nombre  = nuevoNombre;
                    };
                    if (nuevoApellido){
                        session.userData.Apellido = nuevoApellido;
                    };
                    if (nuevaEmpresa){
                        session.userData.Empresa = nuevaEmpresa;
                    };
                    if (nuevoRol){
                        session.userData.Rol = nuevoRol;
                    };
                };
                console.log('Registro actualizado exitosamente')
                res.status(200).redirect('/tools/users?m=4')
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect('/tools/users?m=5')
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
                    return res.redirect('/tools/users');
                } else {
                    connection.query(
                        `UPDATE usuarios SET Confirmado = 1 WHERE Id = ${id}`, (err,result) => {
                            if (!err) {
                                console.log('Usuario confirmado exitosamente');
                                return res.redirect('/tools/users?m=9');
                            } else {
                                console.log(`Ha ocurrido el siguiente ${err}`);
                                res.status(500).redirect('/tools/users');                
                            };
                        }
                    );
                };
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect('/tools/users');
            };
        }
    );
});

//Delete specific user
router.get('/deleteUser',authApiAdmin,(req,res) => {
    const id = req.query.id;
    connection.query(`DELETE FROM usuarios WHERE Id = ${id}`,(err,result) => {
            if (!err) {
                return res.redirect('/tools/users?m=1');
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect('/tools/users?m=2')
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
                    return res.redirect('/tools/machines?m=6');
                } else  {
                    if( referencia ){
                        return res.redirect('/tools/machines?m=7');
                    }else if( marca ){
                        return res.redirect('/tools/machines?m=7');
                    }else if( isNaN(numero) || numero%1 != 0 ){
                        return res.redirect('/tools/machines?m=7');
                    }else if( isNaN(cliente) || cliente%1 != 0 ) {
                        return res.redirect('/tools/machines?m=7');
                    }else {
                    
                        const queryvalues = `'${referencia}','${marca}','${numero}','${cliente}'`;

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
                        
                    };
                };
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
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
    const nuevoCliente = body.clients;
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
    if (nuevoCliente){
        queryTxt += `Cliente = '${nuevoCliente}',`;
    };
    queryTxt += `Id = ${id} WHERE Id = '${id}';`;
    connection.query(
        queryTxt, (err,result) => {
            if (!err) {
                console.log('Registro actualizado exitosamente')
                res.status(200).redirect(`/tools/machines?m=4`)
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                res.status(500).redirect(`/tools/machines?m=5`)
            };
        }
    );
});

//Delete specific machine
router.get('/deleteMachine',authApiAdmin,(req,res) => {
    const id = req.query.id;
    connection.query(`DELETE FROM equipos WHERE Id = ${id}`,(err,result) => {
            if (!err) {
                return res.redirect('/tools/machines?m=1');
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
                return res.status(500).redirect('/tools/machines?m=2');
            }
        }   
    )
});

//Update client info
router.post('/updateClient',authApiAdmin,({body},res) => {
    const id = body.id;
    const nuevoNombre = body.names;
    let queryTxt =`UPDATE clients SET `;
    if (nuevoNombre){
        queryTxt += `Compania = '${nuevoNombre}',`;
    };
    queryTxt += `Id = ${id} WHERE Id = '${id}';`;
    connection.query(
        queryTxt, (err,result) => {
            if (!err) {
                console.log('Registro actualizado exitosamente')
                return res.status(200).redirect(`../tools/clients?m=4`)
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`)
                return res.status(500).redirect(`../tools/clients`)
            };
        }
    );
});

//Delete specific machine
router.get('/deleteClient',authApiAdmin,(req,res) => {
    const id = req.query.id;
    connection.query(`DELETE FROM clients WHERE Id = ${id}`,(err,result) => {
            if (!err) {
                return res.redirect('../tools/clients?m=1');
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
                return res.status(500).redirect('../tools/clients?m=2');
            }
        }   
    )
});

router.post('/createClient',authApiAdmin,({body},res) => {
    const nombreCliente = body.name;

    connection.query(
        `SELECT Id FROM clients WHERE Compania = '${nombreCliente}';`, (err,result) => {
            if ( !err ) {
                if (result.length > 0) {
                    return res.redirect('/tools/clients?m=5');
                } else {
                    if ( nombreCliente ){
                        return res.redirect('/tools/clients?m=6');
                    } else {
                        connection.query(
                            `INSERT INTO clients (Compania) VALUES ('${nombreCliente}');`, err => {
                                if ( err ) {
                                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                                } else {
                                    console.log('Se ha creado el cliente exitosamente.');
                                    return res.redirect('/tools/clients?m=3');
                                };
                            }
                        );
                        
                    };
                };
            } else {
                console.log(`${err}`);
                return res.redirect('/tools/clients');
            };          
        }
    );    
});

module.exports = router;