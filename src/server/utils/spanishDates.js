// Format date to "DD of MONTH of YEAR" and  put it on date field if exist
const formatDates = (originalDate, dateField) => {
    // Array with months name in spanish
    const months = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
    ];
    
    // Create date and get date, month and year  
    const date = new Date(originalDate);
    const dd = date.getDate();
    const mm = date.getMonth();
    const yyyy = date.getFullYear();

    // Create formated date string
    const formatedDate = dd + ' de ' + months[mm] + ' del ' + yyyy;
    
    // Put formated date on date field if exist
    if (dateField) {
        dateField.textContent = formatedDate;
    };
    
    return formatedDate;
};

module.exports = formatDates;