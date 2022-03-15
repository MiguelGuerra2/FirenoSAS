'use strict';
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.BD_HOST,
    database: process.env.BD_NAME,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD 
});

connection.connect( err => {
    if(err) {
        console.error('Connection failed: ' + err.stack);
        return;
    }
    console.log('BD connected succesfully');
})

module.exports = connection;