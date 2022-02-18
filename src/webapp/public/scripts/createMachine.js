const clients = document.getElementById('clients');
const getUsers = async () => {
    const response = await fetch('http://localhost:3000/apiAdmin/getElements?q=1');
    
    if (response.status == 200){
        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            if(usersData[i].Confirmado == 1 && usersData[i].Rol == 1) {
                let completeName = usersData[i].Nombre.split(' ');
                let completeLastname = usersData[i].Apellido.split(' ');
                const shortName = completeName[0] + ' ' + completeLastname[0];

                const option = document.createElement("option");
                option.value = usersData[i].Id;
                option.text = shortName;
                
                clients.appendChild(option);
            };
        };
    };   
};
getUsers();