'use estrict';

const express = require('express');
const router = express.Router();
const {authUser, authApiAdmin, authApiClient} = require('./authMiddlewords');

router.get('/', (req,res) =>{
    return res.render('./clientsTools/tools',{title:'Herramientas'})    
})

//HERRAMIENTAS DE ADMINISTRADOR
router.get('/users', authApiAdmin, (req,res) =>{ 
    if (req.query.m == 1){
        return res.render('./adminTools/users',{nombre:req.session.userData.Nombre,modal:1,title:'Usuarios'});       
    } else {
        return res.render('./adminTools/users',{nombre:req.session.userData.Nombre,modal:0,title:'Usuarios'});
    };
});

router.get('/machines', authApiAdmin, (req,res) =>{ 
    if (req.query.m == 1){
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:1,title:'Maquinas'});
    } else {
        return res.render('./adminTools/machines',{nombre:req.session.userData.Nombre,modal:0,title:'Maquinas'});
    };

});

router.get('/createUser',authApiAdmin, (req,res) => {
    res.render('./adminTools/createUser',{title:'Crear Usuario'});
});

router.get('/createMachine',authApiAdmin, (req,res) => {
    res.render('./adminTools/createMachine',{title:'Crear Maquina'});
});

router.get('/updateUser', authApiAdmin, (req,res) => {
    const id = req.query.id;
    if (id == undefined) {
        res.redirect('./users')
    } else {
        if (req.query.m == 1) {
            return res.render('./adminTools/updateUser',{modal:1,id:id,title:'Actualizar Usuario'})        
        } else if (req.query.m == 2){
            res.render('./adminTools/updateUser', {modal:2,id:id,title:'Actualizar Usuario'})
        } else {
            res.render('./adminTools/updateUser', {modal:0,id:id,title:'Actualizar Usuario'})
        }
    }
});

router.get('/updateMachine', authApiAdmin, (req,res) => {
    const id = req.query.id;
    if (id == undefined) {
        res.redirect('./machines')
    } else {
        if (req.query.m == 1) {
            return res.render('./adminTools/updateMachine',{modal:1,id:id,title:'Actualizar Maquina'})        
        } else if (req.query.m == 2){
            res.render('./adminTools/updateMachine', {modal:2,id:id,title:'Actualizar Maquina'})
        } else {
            res.render('./adminTools/updateMachine', {modal:0,id:id,title:'Actualizar Maquina'})
        };
    };
});

//HERRAMIENTAS DE CLIENTE

router.get('/profile', authUser, (req,res) =>{
    const info = req.session.userData;
    const modal = req.query.m;
    if (modal == 1){
        return res.render('./clientsTools/profile',{session:info, modal:1,title:'Perfil'});
    } else if (modal == 2) {
        return res.render('./clientsTools/profile',{session:info, modal:2,title:'Perfil'});
    }else {
        return res.render('./clientsTools/profile',{session:info, modal:0,title:'Perfil'});
    };
});

router.get('/realTime', authApiClient, (req,res) =>{ 
    return res.render('./clientsTools/realtime')
});

router.get('/record', authApiClient, (req,res) =>{ 
    if(req.session.userData.Rol == 1) {
        return res.render('./clientsTools/record',{rol:1});
    } else {
        return res.render('./clientsTools/record',{rol:2});
    };
});

module.exports = router;