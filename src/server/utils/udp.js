'use strict';
const activateSocket = (port) => {
    const dgram = require('dgram');
    const socket = dgram.createSocket('udp4');
    const socketPort = port;
    const connection = require('./db');

    const validateMessage = (msg,rinfo) => {
        const info = msg.toString().split(';');
        
        for (let i = 0; i < info.length-2; i++){   
            if ( isNaN(info[i]) ) {
                console.log('Dato invalido');
                return false;
            };
        };
        saveInfo(info);
    };

    const saveInfo = (mensaje) => {
        const equipo = mensaje[0];
        const problema = mensaje[1];
        const alarma = mensaje[2];
        const latitud = mensaje[3];
        const longitud = mensaje[4];
        const horaEnvio = mensaje[5];
        const queryvalues = `'${equipo}','${problema}','${alarma}','${latitud}','${longitud}','${horaEnvio}'`;
        connection.query(
            `INSERT INTO informacion (Equipo,Problema,Alarma,Latitud,Longitud,Hora_envio) VALUES (${queryvalues});`, err => {
                if (err) {
                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                }
            }
        )
    }

    socket.on('message', validateMessage)
    socket.bind(socketPort);
    console.log(`Socket enabled on port: ${socketPort}`)

} 


module.exports = activateSocket;