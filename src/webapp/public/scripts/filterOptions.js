const getOptions = async (select,isFilter=false) => {
    const response = await fetch('/certificates/apiClients');
    if (response.status == 200){
        const clientsData = await response.json();
        
        for (let i = 0; i < clientsData.length; i++) {
            const option = document.createElement('option');
            if (isFilter == true) { 
                option.value = clientsData[i].Compania;
            } else {
                option.value = clientsData[i].Id;
            }
            option.textContent = clientsData[i].Compania;
            select.appendChild(option);
        };
    }   
}

const selectInputs = document.querySelectorAll('.clientOptions');
selectInputs.forEach(selectInput => {
    if (selectInput.id == 'filterSelect') {
        getOptions(selectInput,true);
    } else {
        getOptions(selectInput);
    }
})
