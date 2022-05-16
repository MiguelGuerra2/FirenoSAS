const getUsers = async (selectInput) => {
    const response = await fetch('/apiAdmin/getElements?q=1');
    
    if (response.status == 200){
        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            if ( usersData[i].Rol == 1 ) {
                const option = document.createElement('option');
                option.value = usersData[i].Id;
                option.textContent = usersData[i].Nombre + ' ' + usersData[i].Apellido;
                selectInput.appendChild(option);
            }
        }
    }   
}

const selectInputs = document.querySelectorAll('.usersOptions');
selectInputs.forEach(selectInput => {
    getUsers(selectInput);
});