'use estrict';

const express = require('express');
const router = express.Router();
const {authUser, authApiAdmin, authApiClient} = require('./authMiddlewords');

//HERRAMIENTAS DE CLIENTES EN GENERAL

router.get('/', (req,res) =>{
    if (req.session.userData) {
        const firstName = req.session.userData.Nombre.split(' ')[0];
        return res.render('./clientsTools/tools',{title:'Herramientas', rol:req.session.userData.Rol, name1:firstName})            
    } else {
        return res.render('./clientsTools/tools',{title:'Herramientas'})    
    }
    
}) 

router.get('/profile', authUser, (req,res) =>{
    const firstName = req.session.userData.Nombre.split(' ')[0];
    if (req.session.userData.Rol == 3) {
        return res.render('./adminTools/profile',{session:req.session.userData, modal:0,title:'Perfil', rol:req.session.userData.Rol,info:req.query.info, name1:firstName});        
    }
    return res.render('./clientsTools/profile',{session:req.session.userData, modal:0,title:'Perfil', rol:req.session.userData.Rol,info:req.query.info, name1:firstName});
});

//HERRAMIENTAS DE ADMINISTRADOR
router.get('/users', authApiAdmin, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    return res.render('./adminTools/users',{nombre:req.session.userData.Nombre,modal:req.query.m,title:'Usuarios', rol:req.session.userData.Rol, name1:firstName});
});
 
router.get('/clients', authApiAdmin, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    if (req.query.m) {
        return res.render('./adminTools/clients',{nombre:req.session.userData.Nombre,m:req.query.m,title:'Clientes', rol:req.session.userData.Rol, name1:firstName});
    } else {
        return res.render('./adminTools/clients',{nombre:req.session.userData.Nombre,title:'Usuarios', rol:req.session.userData.Rol, name1:firstName});
    }
});

router.get('/machines', authApiAdmin, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    if (req.query.m){
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:req.query.m,title:'Maquinas', rol:req.session.userData.Rol, name1:firstName});
    } else {
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,title:'Maquinas', rol:req.session.userData.Rol, name1:firstName});
    };

});


//HERRAMIENTAS DE CLIENTE

router.get('/realTime', authApiClient, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    return res.render('./clientsTools/realtime',{title:'Tiempo Real', rol:req.session.userData.Rol, imglogo:1, name1:firstName})
});

router.get('/record', authApiClient, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    return res.render('./clientsTools/record',{title:'Historial', rol:req.session.userData.Rol, imglogo:1, name1:firstName});
});

module.exports = router;