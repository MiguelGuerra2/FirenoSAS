'use strict';
const activateSocket = (port) => {
    const dgram = require('dgram');
    const socket = dgram.createSocket('udp4');
    const socketPort = port;
    const connection = require('./db');

    const validateMessage = (msg,rinfo) => {
        const info = msg.toString().split(',');

        info[1] == 'GPS ERROR' ? info[1] = 0 : info[1] = info[1];
        info[2] == 'GPS ERROR' ? info[2] = 0 : info[2] = info[2];  

        for (let i = 0; i < info.length; i++){   
            if ( isNaN(info[i] && i != 3) ) {
                console.log('Dato invalido');
                return false;
            };
        };
        saveInfo(info);
    };

    const saveInfo = (mensaje) => {
        const equipo = mensaje[0];
        const latitud = mensaje[1];
        const longitud = mensaje[2];
        const horaEnvio = mensaje[3];

        const alarma_1 = mensaje[4];
        const alarma_2 = mensaje[5];
        const alarma_3 = mensaje[6];
        const alarma_4 = mensaje[7];
        const alarma_5 = mensaje[8];
        const alarma_6 = mensaje[9];
        const alarma_7 = mensaje[10];
        const alarma_8 = mensaje[11];
        const alarma_9 = mensaje[12];
        const alarma_10 = mensaje[13];

        const columns = 'Equipo,Latitud,Longitud,Hora_envio,Alarma_1,Alarma_2,Alarma_3,Alarma_4,Alarma_5,Alarma_6,Alarma_7,Alarma_8,Alarma_9,Alarma_10';

        const queryvalues = `'${equipo}','${latitud}','${longitud}','${horaEnvio}','${alarma_1}','${alarma_2}','${alarma_3}','${alarma_4}','${alarma_5}','${alarma_6}','${alarma_7}','${alarma_8}','${alarma_9}','${alarma_10}'`;
        connection.query(
            `INSERT INTO informacion (${columns}) VALUES (${queryvalues});`, err => {
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