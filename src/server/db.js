'use strict';
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'firenosas',
    user: 'root',
    password: 'mabe2402'
});

connection.connect( err => {
    if(err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado exitosamente a la base de datos');
})

module.exports = connection;