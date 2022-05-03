'use strict';
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const port = 3020;
const connection = require('./db');

let info,equipo,problema,alarma,latitud,longitud,horaEnvio,queryvalues;

const validarMensaje = (msg,rinfo) => {
    info = msg.toString().split(';');

    for (let i = 0; i < info.length; i++){   
        registrarInfo(info);
    };
};

const registrarInfo = (mensaje) => {
    for (let i = 0; i < info.length-2; i++){   
        if ( isNaN(info[i]) ) {
            console.log('Dato invalido');
            return false;
        };
    };

    equipo = mensaje[0];
    problema = mensaje[1];
    alarma = mensaje[2];
    latitud = mensaje[3];
    longitud = mensaje[4];
    horaEnvio = mensaje[5];

    queryvalues = `'${equipo}','${problema}','${alarma}','${latitud}','${longitud}','${horaEnvio}'`;
    console.log(queryvalues);
    connection.query(
        `INSERT INTO informacion (Equipo,Problema,Alarma,Latitud,Longitud,Hora_envio) VALUES (${queryvalues});`, err => {
            if (err) {
                console.log(`Ha ocurrido el siguiente error: ${err}`);
            }
        }
    )
}

socket.on('message', validarMensaje)
socket.bind(port);
console.log(`Socket habilitado en el puerto: ${port}`)


module.exports = socket;