'use estrict';

// External imports
const express = require('express');
const router = express.Router();

//Local imports
const {isValidUser, isAdmin, isClient} = require('./authMiddlewords');

//Clients toools (No login required)
router.get('/', (req,res) =>{
    
    if (req.session.userData) {

        const firstName = req.session.userData.Nombre.split(' ')[0];
    
        return res.render('./clientsTools/tools',{title:'Herramientas', rol:req.session.userData.Rol, name1:firstName})            
    
    } else {
    
        return res.render('./clientsTools/tools',{title:'Herramientas'})    
    }
    
}) 

router.get('/profile', isValidUser, (req,res) =>{
    
    const firstName = req.session.userData.Nombre.split(' ')[0];
    
    if (req.session.userData.Rol == 3) {
    
        return res.render('./adminTools/profile',{session:req.session.userData, modal:0,title:'Perfil', rol:req.session.userData.Rol,info:req.query.info, name1:firstName});        
    
    }
    
    return res.render('./clientsTools/profile',{session:req.session.userData, modal:0,title:'Perfil', rol:req.session.userData.Rol,info:req.query.info, name1:firstName});

});

//HERRAMIENTAS DE ADMINISTRADOR
router.get('/users', isValidUser , isAdmin , (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    return res.render('./adminTools/users',{nombre:req.session.userData.Nombre,modal:req.query.m,title:'Usuarios', rol:req.session.userData.Rol, name1:firstName});
});
 
router.get('/clients', isValidUser , isAdmin, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    if (req.query.m) {
        return res.render('./adminTools/clients',{nombre:req.session.userData.Nombre,m:req.query.m,title:'Clientes', rol:req.session.userData.Rol, name1:firstName});
    } else {
        return res.render('./adminTools/clients',{nombre:req.session.userData.Nombre,title:'Usuarios', rol:req.session.userData.Rol, name1:firstName});
    }
});

router.get('/machines', isValidUser , isAdmin, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    if (req.query.m){
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:req.query.m,title:'Maquinas', rol:req.session.userData.Rol, name1:firstName});
    } else {
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,title:'Maquinas', rol:req.session.userData.Rol, name1:firstName});
    };

});


//HERRAMIENTAS DE CLIENTE

router.get('/realTime', isValidUser , isClient, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    return res.render('./clientsTools/realtime',{title:'Tiempo Real', rol:req.session.userData.Rol, imglogo:1, name1:firstName})
});

router.get('/record', isValidUser , isClient, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    return res.render('./clientsTools/record',{title:'Historial', rol:req.session.userData.Rol, imglogo:1, name1:firstName});
});

module.exports = router;