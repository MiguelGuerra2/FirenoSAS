'use estrict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const connection = require('../utils/db');
const {authApiClient} = require('./authMiddlewords');

router.get('/getCoordsRealTime',authApiClient,(req,res) => {
    if(req.session.userData.Rol == 2){
        connection.query(
            `SELECT * FROM informacion AS i INNER JOIN equipos AS e ON i.Equipo = e.Id INNER JOIN usuarios AS u ON e.Cliente = u.Id WHERE i.Id IN (SELECT MAX(Id) FROM informacion GROUP BY Equipo);`, (err,result) => {
                if (!err) {
                    return res.send(result);
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`);
                    return res.status(500);
                };
            }
        );
    }else if (req.session.userData.Rol == 1) {
        connection.query(
            `SELECT * FROM informacion AS i INNER JOIN equipos AS e ON i.Equipo = e.Id INNER JOIN usuarios AS u ON e.Cliente = u.Id WHERE i.Id IN (SELECT MAX(Id) FROM informacion GROUP BY Equipo) AND e.Cliente = ${req.session.userData.Id};`, (err,result) => {
                if (!err) {
                    return res.send(result);
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`);
                    return res.status(500);
                };
            }
        );
    };
});

router.get('/getCoordsRecord',authApiClient,(req,res) => {
    const idate = req.query.idate;
    const fdate = req.query.fdate;
    const machine = req.query.machine;
    connection.query(
        `SELECT * FROM informacion WHERE Equipo = ${machine} AND (Hora_envio BETWEEN '${idate}' AND '${fdate}');`, (err,result) => {
            if (!err) {
                return res.send(result);
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
                return res.status(500);
            };
        }
    );
});

router.post('/updateInfo',authApiClient,(req,res) => {
    const id = req.body.id;
    const nuevoNombre = req.body.newName;
    const nuevoApellido = req.body.lastname;
    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;
    const newPassword2 = req.body.newpassword2;
    let session = req.session;
    let hash;
    
    if (id == session.userData.Id){
        let queryTxt =`UPDATE usuarios SET `;
        if ((nuevoNombre != null && nuevoNombre != undefined) && nuevoNombre != ''){
            queryTxt += `Nombre = '${nuevoNombre}',`;
        }
        if ((nuevoApellido != null && nuevoApellido != undefined) && nuevoApellido != ''){
            queryTxt += `Apellido = '${nuevoApellido}',`;
        }
        if ((newPassword != null && newPassword != undefined) && newPassword != ''){
            const isValidPass = bcrypt.compareSync(oldPassword, session.userData.Passwords);
            if( isValidPass ){
                if (newPassword == newPassword2) {
                    hash = bcrypt.hashSync(newPassword, 10);
                    queryTxt += `Password = '${hash}',`;
                } else {
                    console.log('Las contrasenas no coinciden');
                }
            } else {
                console.log('La contrasena actual es incorrecta')
            };
        }
        queryTxt += `Id = ${id} WHERE Id = '${id}';`;
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
                        if ((newPassword != null && newPassword != undefined) && newPassword != ''){
                            session.userData.Password = hash;
                        };
                    };
                    console.log('Registro actualizado exitosamente')
                    res.status(200).redirect('../tools/profile?m=1')
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`)
                    res.status(500).redirect('../tools/profile?m=2')
                };
            }
        );
    }else{
        console.log('No tiene permisos para modificar otro usuario');
        res.status(500).redirect('../tools/profile?m=2');
    }
    
});



module.exports = router;