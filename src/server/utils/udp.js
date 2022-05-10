'use strict';
const activateSocket = (port) => {
    const dgram = require('dgram');
    const socket = dgram.createSocket('udp4');
    const socketPort = port;
    const connection = require('./db');

    const validateMessage = (msg,rinfo) => {
        const messages = msg.toString().split(';')
        for (let i = 0; i < messages.length - 1; i++) {
            const info = messages[i].toString().split(',');
            
            info[1] == 'GPS ERROR' ? info[1] = 0 : info[1] = info[1];
            info[2] == 'GPS ERROR' ? info[2] = 0 : info[2] = info[2];  
    
            for (let j = 0; j < info.length; j++){   
                if ( isNaN(info[j]) && j != 3 ) {
                    console.log('Dato invalido');
                    return false;
                };
            };
            saveInfo(info);
        }
    };

    const saveInfo = (message) => {
        const equipo = message[0];
        const latitud = message[1];
        const longitud = message[2];
        const horaEnvio = message[3];

        const alarma_1 = message[4];
        const alarma_2 = message[5];
        const alarma_3 = message[6];
        const alarma_4 = message[7];
        const alarma_5 = message[8];
        const alarma_6 = message[9];
        const alarma_7 = message[10];
        const alarma_8 = message[11];
        const alarma_9 = message[12];
        const alarma_10 = message[13].split(';').join('');

        const columns = 'Equipo,Latitud,Longitud,Hora_envio,Alarma_1,Alarma_2,Alarma_3,Alarma_4,Alarma_5,Alarma_6,Alarma_7,Alarma_8,Alarma_9,Alarma_10';

        const queryvalues = `'${equipo}','${latitud}','${longitud}','${horaEnvio}','${alarma_1}','${alarma_2}','${alarma_3}','${alarma_4}','${alarma_5}','${alarma_6}','${alarma_7}','${alarma_8}','${alarma_9}','${alarma_10}'`;
        connection.query(
            `INSERT INTO informacion (${columns}) VALUES (${queryvalues});`, err => {
                if (err) {
                    console.log(`Ha ocurrido el siguiente error: ${err}`);
                } else {
                    console.log('Registro guardado exitosamente')
                }
            }
        )
    } 

    socket.on('message', validateMessage)
    socket.bind(socketPort);
    console.log(`Socket enabled on port: ${socketPort}`)

} 

module.exports = activateSocket;