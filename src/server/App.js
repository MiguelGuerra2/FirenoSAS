'use strict';
//External imports
const express = require('express');
const app = express();
const sessions = require('express-session');
const cookieParser = require("cookie-parser");

//Local imports
const config = require('./config/config');
const activateSocket = require('./utils/udp');

//Ports
const socketPort = config.SOCKET_PORT;
const serverPort = config.SERVER_PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//One month on ms
const oneMonth = 1000 * 60 * 60 * 24 * 30;

//session middleware
app.use(sessions({
    secret: process.env.SECRET_SESSION,
    saveUninitialized:true,
    cookie: { 
        httpOnly: true,
        maxAge: oneMonth },
    resave: false
}));

//Setting ejs
app.set('view engine', 'ejs');
app.set('views', '../webapp/views');

//Public file
app.use(express.static('../webapp/public'));

//Web routes
app.use('/', require('./router/routes'));
app.use('/auth', require('./router/auth'));
app.use('/tools', require('./router/tools'));
app.use('/certificates', require('./router/certificates'));
app.use('/extinguishers', require('./router/extinguishers'));
app.use('/apiAdmin', require('./router/apisAdmin'));
app.use('/apiClient', require('./router/apisClient'));
app.use('/apiCertificate', require('./router/apisCertificate'));
app.use('/apiExtinguishers', require('./router/apisExtinguishers'));

app.use((req, res, next) => {
    //Handle 404 Status
    res.status(404).render('./statusResponse/404',{title:'Pagina no encontrada'});
});

//Activate UDP Socket on Well-Known Port
activateSocket(socketPort);

//Starting server
app.listen(serverPort,()=>{console.log('Server working on:',serverPort)});