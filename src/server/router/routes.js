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
            return res.render('./homes/home',{title:'Inicio',info:9, rol:req.session.userData.Rol});
        }
    }else {
        return res.render('./homes/home',{title:'Inicio'});
    }
}

router.get('/',authUser,(req,res) => {
    if(session.userData.Rol == 3){
        return res.render(`./homes/adminHome`,{title:'Inicio', rol:req.session.userData.Rol});
    } else {
        return res.render('./homes/home',{title:'Inicio', rol:req.session.userData.Rol});
    }
});

module.exports = router;