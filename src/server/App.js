'use strict';

const express = require('express');
const app = express();
const udpSocket = require('./udp');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const unMes = 1000 * 60 * 60 * 24 * 30;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: unMes },
    resave: false
}));

//Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', '../webapp/views');
//Carpeta public
app.use(express.static('../webapp/public'));
//Rutas web
app.use('/', require('./router/routes'));
app.use('/auth', require('./router/auth'));
app.use('/tools', require('./router/tools'));
app.use('/apiAdmin', require('./router/apisAdmin'));
app.use('/apiClient', require('./router/apisClient'));

app.use((req, res, next) => {
    //Manejar pagina no encontrada
    res.status(404).render('./statusResponse/404',{title:'Pagina no encontrada'});
});
app.use((req, res, next) => {
    //Manejar permisos
    res.status(401).render('./statusResponse/401',{title:'No autorizado'});
});

app.listen(port,()=>{console.log('Servidor activo en el puerto',port)});