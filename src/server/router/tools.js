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
    return res.render('./adminTools/users',{nombre:req.session.userData.Nombre,modal:0,title:'Usuarios', rol:req.session.userData.Rol, name1:firstName});
});
 
router.get('/machines', authApiAdmin, (req,res) =>{ 
    const firstName = req.session.userData.Nombre.split(' ')[0];
    if (req.query.m == 1){
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:1,title:'Maquinas', rol:req.session.userData.Rol, name1:firstName});
    } else {
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:0,title:'Maquinas', rol:req.session.userData.Rol, name1:firstName});
    };

});

router.get('/createUser',authApiAdmin, (req,res) => {
    const firstName = req.session.userData.Nombre.split(' ')[0];
    res.render('./adminTools/createUser',{title:'Crear Usuario', rol:req.session.userData.Rol, name1:firstName});
});

router.get('/createMachine',authApiAdmin, (req,res) => {
    const firstName = req.session.userData.Nombre.split(' ')[0];
    res.render('./adminTools/createMachine',{title:'Crear Maquina', rol:req.session.userData.Rol, name1:firstName});
});

router.get('/updateUser', authApiAdmin, (req,res) => {
    const firstName = req.session.userData.Nombre.split(' ')[0];
    const id = req.query.id;
    if (id == undefined) {
        res.redirect('./users')
    } else {
        if (req.query.m == 1) {
            return res.render('./adminTools/updateUser',{modal:1,id:id,title:'Actualizar Usuario', rol:req.session.userData.Rol, name1:firstName})        
        } else if (req.query.m == 2){
            res.render('./adminTools/updateUser', {modal:2,id:id,title:'Actualizar Usuario', rol:req.session.userData.Rol, name1:firstName})
        } else {
            res.render('./adminTools/updateUser', {modal:0,id:id,title:'Actualizar Usuario', rol:req.session.userData.Rol, name1:firstName})
        }
    }
});

router.get('/updateMachine', authApiAdmin, (req,res) => {
    const firstName = req.session.userData.Nombre.split(' ')[0];
    const id = req.query.id;
    if (id == undefined) {
        res.redirect('./machines')
    } else {
        if (req.query.m == 1) {
            return res.render('./adminTools/updateMachine',{modal:1,id:id,title:'Actualizar Maquina', rol:req.session.userData.Rol, name1:firstName})        
        } else if (req.query.m == 2){
            res.render('./adminTools/updateMachine', {modal:2,id:id,title:'Actualizar Maquina', rol:req.session.userData.Rol, name1:firstName})
        } else {
            res.render('./adminTools/updateMachine', {modal:0,id:id,title:'Actualizar Maquina', rol:req.session.userData.Rol, name1:firstName})
        };
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