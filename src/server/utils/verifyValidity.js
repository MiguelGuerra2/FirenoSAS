// External imports
// const cron = require('node-cron');

// Internal imports
const connection = require('./db');
const formatDates = require('./spanishDates');
const sendMessage = require('./wppMessages');

// Create message depending certificates about to expire
const createMessage = (info) => {
    let message = 'Los siguientes certificados estan proximos a vencer: \n'
    for (let i = 0; i < info.length; i++) {
        message += `- *CERTIFICADO* #${info[i].Id} \n Nombre: ${info[i].Name} ${info[i].Lastname} \n CC: ${info[i].Cc} \n Valido hasta: ${info[i].Valid_Until} \n`
    };
    return message;
};

// Get date of one month from today
const getOneMonth = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear() ;
    let date = currentDate.getDate();
    let month = currentDate.getMonth()+2;
    date < 10 ? date = '0'+ date : date = date;
    month < 10 ? month = '0'+ month : month = month;
    return `${year}/${month}/${date}`;
};

// Create and send Wpp message with certificates information
const wppMessage = () => cron.schedule('0-59 0-23 * * *', () => {
    // Get one month from today to include it on query
    const oneMonth = getOneMonth();
    
    // Get certificates with one month or less to expire
    connection.query( 
        `SELECT * FROM certificates WHERE Valid_Until < '${oneMonth}' ORDER BY Valid_Until`, (err,result) => {
            if (!err) {
                // Iterate query result to format "valid_until" dates.
                for (let i = 0; i < result.length; i++) {
                    result[i].Valid_Until = formatDates(result[i].Valid_Until);
                };
                // Create message with data from query
                const message = createMessage(result);
                // Send wpp message
                // sendMessage(message);
                console.log(message);
            } else {
                console.log(`Ha ocurrido el siguiente ${err}`);
            };
        }
    );
});


module.exports = wppMessage;