'use estrict';

// External imports
const express = require('express');
const router = express.Router();

const { isValidUser , isExtinguishersAdmin , isExtinguishersUser } = require('./authMiddlewords');

// Home
router.get('/',isValidUser,isExtinguishersUser, (req,res) => {

    if(req.session.userData.Rol == 5){
        return res.render('./extinguishers/extinguishersAdmin',{title:'Admin Extintores', header:'off'});
    } else {
        return res.render('./extinguishers/extinguishersClient',{title:'Extintores', header:'off'});
    };
});

router.get('/maintenances', isValidUser,isExtinguishersAdmin, (req,res) => {

    return res.render('./extinguishers/maintenances',{title:'Mantenimientos', header:'off'});
    
});

router.get('/maintenances/:extinguisherID', isValidUser,isExtinguishersUser,(req,res) => {

    if(req.session.userData.Rol == 5){
        return res.render('./extinguishers/maintenancesAdmin',{title:'Mantenimientos', header:'off'});
    } else {
        return res.render('./extinguishers/maintenancesClient',{title:'Mantenimientos', header:'off'});
    };
});

module.exports = router;