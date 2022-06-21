// Format date to "DD of MONTH of YEAR" and  put it on date field if exist
const formatDates = (originalDate, dateField) => {
    // Array with months name in spanish
    const months = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
    ];

    const variables = originalDate.split("T")[0].split("-");
    const yyyy = variables[0]
    const mm = parseInt(variables[1], 10) - 1
    const dd = parseInt(variables[2], 10) 

    // Create formated date string
    const formatedDate = dd + ' de ' + months[mm] + ' del ' + yyyy;
    
    // Put formated date on date field if exist
    if (dateField) {
        dateField.textContent = formatedDate;
    };
    
    return formatedDate;
};