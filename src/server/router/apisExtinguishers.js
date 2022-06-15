//External imports
const express = require('express');
const router = express.Router();
const connection = require('../utils/db');

const authClient = (req,res,next) => {
    if (req.session.userData) {
        if (req.session.userData.Confirmado = 1) {
            if (req.session.userData.Rol == 6 || req.session.userData.Rol == 5 ) {
                return next();
            } else {
                console.log('Usuario no autorizado')
                return res.status(401).redirect('../')
            };
        } else {
            console.log('Usuario no confirmado')
            return res.redirect('/')  
        }
    }else {
        console.log('No ha iniciado sesion')
        return res.redirect('/')
    };
};

// Get all extinguishers from DB
router.get('/getExtinguishers',authClient,(req,res) => {
    if (req.session.userData.Rol == 6) {
        connection.query( 
            `SELECT * FROM extinguisher AS ex INNER JOIN clients AS cl ON ex.Client = cl.Id INNER JOIN agents AS ag ON ex.Agent = ag.Id_Agent WHERE ex.Client = ${req.session.userData.Empresa} ORDER BY ex.Id_Extinguisher DESC`, (err,result) => {
                if (!err) {
                    return res.send(result);
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`);
                };
            }
        );
    } else {
        connection.query( 
            `SELECT * FROM extinguisher AS ex INNER JOIN clients AS cl ON ex.Client = cl.Id INNER JOIN agents AS ag ON ex.Agent = ag.Id_Agent ORDER BY ex.Id_Extinguisher DESC`, (err,result) => {
                if (!err) {
                    return res.send(result);
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`);
                };
            }
        );
    }
});

// Get all maintenances from DB
router.get('/getMaintenances',authClient,(req,res) => {
    if (req.session.userData.Rol == 6) {
        connection.query( 
            `SELECT * FROM maintenances AS ma INNER JOIN extinguisher AS ex ON ex.Id_Extinguisher = ma.Extinguisher_Id SWHERE ex.Client = ${req.session.userData.Empresa} ORDER BY ex.Id_Extinguisher DESC`, (err,result) => {
                if (!err) {
                    return res.send(result);
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`);
                };
            }
        );
    } else {
        connection.query( 
            `SELECT * FROM extinguisher AS ex INNER JOIN clients AS cl ON ex.Client = cl.Id INNER JOIN agents AS ag ON ex.Agent = ag.Id_Agent ORDER BY ex.Id_Extinguisher DESC`, (err,result) => {
                if (!err) {
                    return res.send(result);
                } else {
                    console.log(`Ha ocurrido el siguiente ${err}`);
                };
            }
        );
    }
});


module.exports = router;