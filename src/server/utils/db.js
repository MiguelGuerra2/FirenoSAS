'use strict';
const mysql = require('mysql2');

const connection = mysql.createPool({
    host: process.env.BD_HOST,
    database: process.env.BD_NAME,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD 
});
console.log('BD connected succesfully');

module.exports = connection;