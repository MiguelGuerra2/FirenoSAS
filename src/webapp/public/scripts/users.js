const usersColumn = document.getElementById('usersColumn');
const fragment = document.createDocumentFragment();

const getUsers = async () => {
    const response = await fetch('http://localhost:3000/apiAdmin/getElements?q=1');
    
    if (response.status == 200){
        const usersData = await response.json();
        
        for (let i = 0; i < usersData.length; i++) {

            const div = document.createElement("div");
            div.className += "userContainer";
            const name = document.createElement("p");
            const updateUser = document.createElement("a");

            name.textContent = `Usuario : ${usersData[i].Nombre} ${usersData[i].Apellido}`;
            updateUser.innerHTML = 'Modificar';
            updateUser.href = `updateUser?id=${usersData[i].Id}`;

            div.appendChild(name);
            div.appendChild(updateUser);

            if(usersData[i].Confirmado == 0) {
                const confirmUser = document.createElement("a");
                confirmUser.innerHTML = 'Confirmar Usuario';
                confirmUser.href = `../apiAdmin/confirmUser?id=${usersData[i].Id}`;
                div.appendChild(confirmUser);
            };
            

            fragment.appendChild(div);
        }
        usersColumn.appendChild(fragment);
    }   
}
getUsers();