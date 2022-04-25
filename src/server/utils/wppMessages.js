// External imports
const dotenv = require('dotenv').config();

// Credentials 
const accountSid = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN; 

// Create Twilio client
const client = require('twilio')(accountSid, authToken); 

// Send wpp message
const sendMessage = (text) => {
    client.messages 
          .create({ 
             body: text, 
             from: 'whatsapp:+14155238886',       
             to: 'whatsapp:+573024276663' 
           }) 
          .then(message => console.log('Message sent')) 
          .done();
};

module.exports = sendMessage;