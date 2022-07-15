'use estrict';

const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {

    if ( !req.session.userData ) {
        
        const isConfirmedUser = req.query.confirmed;

        if ( isConfirmedUser == 0 ){

            return res.render('./homes/home',{title:'Inicio', info:9});
        
        } else {

            return res.render('./homes/home',{title:'Inicio'});

        }

    } else {
        
        if ( req.session.userData.Rol == 1 || req.session.userData.Rol == 2 ) {

            const firstName = req.session.userData.Nombre.split(' ')[0];
            
            return res.render('./homes/home',{title:'Inicio', rol:req.session.userData.Rol, name1:firstName});
        
        } else if (req.session.userData.Rol == 3) {
        
            return res.redirect('/tools/users');
        
        } else if (req.session.userData.Rol == 4) {
        
            return res.redirect('/certificates/admin');
        
        } else if (req.session.userData.Rol == 5 || req.session.userData.Rol == 6) {
        
            return res.redirect('/extinguishers');
        
        } 

    }

});

router.get('/contactUs',(req,res) => {
    return res.render('./homes/contactUs',{title:'Contacto'});
});

module.exports = router;