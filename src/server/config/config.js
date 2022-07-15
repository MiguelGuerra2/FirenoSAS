const path = require('path');
const dotenv = require('dotenv');
const fileName = process.env.NODE_ENV + '.env';

dotenv.config({
  path: path.resolve(__dirname, fileName),
  debug: true
});

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SOCKET_PORT: process.env.SOCKET_PORT || 3021,
  SERVER_PORT: process.env.SERVER_PORT || 3001,
  BD_HOST: process.env.BD_HOST,
  BD_NAME: process.env.BD_NAME,
  BD_USER: process.env.BD_USER,
  BD_PASSWORD: process.env.BD_PASSWORD,
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
  SG_MAIL_KEY: process.env.SG_MAIL_KEY,
  ACCOUNT_SID: process.env.ACCOUNT_SID,
  AUTH_TOKEN: process.env.AUTH_TOKEN
};

module.exports = config;