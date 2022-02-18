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
            return res.render('./homes/home',{warning:1,title:'Inicio'});
        }
    }else {
        return res.render('./homes/home',{warning:0,title:'Inicio'});
    }
}

router.get('/',authUser,(req,res) => {
    if(session.userData.Rol == 3){
        res.render(`./homes/adminHome`,{title:'Inicio'});
    } else {
        res.render('./homes/clientHome',{title:'Inicio'});
    }
});

module.exports = router;