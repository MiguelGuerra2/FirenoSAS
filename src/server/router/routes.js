'use estrict';

const express = require('express');
const router = express.Router();
let session;

const authUser = (req,res,next) => {
    session = req.session;
    if (session.userData) {
        if (session.userData.Confirmado == 1){
            return next();
        } else {
            session.destroy();
            return res.render('./homes/home',{title:'Inicio',info:9});
        }
    }else {
        return res.render('./homes/home',{title:'Inicio'});
    }
}

router.get('/',authUser,(req,res) => {
    const firstName = req.session.userData.Nombre.split(' ')[0];
    if(session.userData.Rol == 3){
        return res.render('./adminTools/users',{nombre:req.session.userData.Nombre,modal:0,title:'Usuarios', rol:req.session.userData.Rol, name1:firstName});
    } else if (session.userData.Rol == 4) {
        return res.render('./certificates/adminCertificates',{title:'Inicio', rol:req.session.userData.Rol, header:'off', name1:firstName});
    } else {
        return res.render('./homes/home',{title:'Inicio', rol:req.session.userData.Rol, name1:firstName});
    }
});

module.exports = router;