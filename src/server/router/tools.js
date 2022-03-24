'use estrict';

const express = require('express');
const router = express.Router();
const {authUser, authApiAdmin, authApiClient} = require('./authMiddlewords');

//HERRAMIENTAS DE CLIENTES EN GENERAL

router.get('/', (req,res) =>{
    if (req.session.userData) {
        return res.render('./clientsTools/tools',{title:'Herramientas', rol:req.session.userData.Rol})            
    } else {
        return res.render('./clientsTools/tools',{title:'Herramientas'})    
    }
}) 

router.get('/profile', authUser, (req,res) =>{
    return res.render('./clientsTools/profile',{session:req.session.userData, modal:0,title:'Perfil', rol:req.session.userData.Rol});
});

//HERRAMIENTAS DE ADMINISTRADOR
router.get('/users', authApiAdmin, (req,res) =>{ 
    return res.render('./adminTools/users',{nombre:req.session.userData.Nombre,modal:0,title:'Usuarios', rol:req.session.userData.Rol});
});

router.get('/machines', authApiAdmin, (req,res) =>{ 
    if (req.query.m == 1){
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:1,title:'Maquinas', rol:req.session.userData.Rol});
    } else {
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:0,title:'Maquinas', rol:req.session.userData.Rol});
    };

});

router.get('/createUser',authApiAdmin, (req,res) => {
    res.render('./adminTools/createUser',{title:'Crear Usuario', rol:req.session.userData.Rol});
});

router.get('/createMachine',authApiAdmin, (req,res) => {
    res.render('./adminTools/createMachine',{title:'Crear Maquina', rol:req.session.userData.Rol});
});

router.get('/updateUser', authApiAdmin, (req,res) => {
    const id = req.query.id;
    if (id == undefined) {
        res.redirect('./users')
    } else {
        if (req.query.m == 1) {
            return res.render('./adminTools/updateUser',{modal:1,id:id,title:'Actualizar Usuario', rol:req.session.userData.Rol})        
        } else if (req.query.m == 2){
            res.render('./adminTools/updateUser', {modal:2,id:id,title:'Actualizar Usuario', rol:req.session.userData.Rol})
        } else {
            res.render('./adminTools/updateUser', {modal:0,id:id,title:'Actualizar Usuario', rol:req.session.userData.Rol})
        }
    }
});

router.get('/updateMachine', authApiAdmin, (req,res) => {
    const id = req.query.id;
    if (id == undefined) {
        res.redirect('./machines')
    } else {
        if (req.query.m == 1) {
            return res.render('./adminTools/updateMachine',{modal:1,id:id,title:'Actualizar Maquina', rol:req.session.userData.Rol})        
        } else if (req.query.m == 2){
            res.render('./adminTools/updateMachine', {modal:2,id:id,title:'Actualizar Maquina', rol:req.session.userData.Rol})
        } else {
            res.render('./adminTools/updateMachine', {modal:0,id:id,title:'Actualizar Maquina', rol:req.session.userData.Rol})
        };
    };
});

//HERRAMIENTAS DE CLIENTE

router.get('/realTime', authApiClient, (req,res) =>{ 
    return res.render('./clientsTools/realtime',{title:'Tiempo Real', rol:req.session.userData.Rol, imglogo:1})
});

router.get('/record', authApiClient, (req,res) =>{ 
    return res.render('./clientsTools/record',{title:'Historial', rol:req.session.userData.Rol, imglogo:1});
});

module.exports = router;