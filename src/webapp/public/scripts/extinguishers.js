const extinguisherColumn = document.getElementById('extinguishersContainer');
const fragment = document.createDocumentFragment();


const getExtinguishers = async () => {
    const response = await fetch(`/apiExtinguishers/getExtinguishers`);
    if (response.status == 200){
        const usersData = await response.json();
        console.log(usersData[0])
        for (let i = 0; i < usersData.length; i++) {
            const item = document.createElement('li');
            const link = document.createElement('a');            
            const form = document.createElement('form'); 
            const input = document.createElement('input');   
            const button = document.createElement('button');       
            const br = document.createElement('br');            
            item.style.display = 'inline';
            item.textContent=`Id: ${usersData[i].Id_Extinguisher} , Cliente: ${usersData[i].Compania}, Agente: ${usersData[i].Agent_Name} , Capacidad: ${usersData[i].Capacity}`;
            link.textContent = 'Ver informacion'
            link.href = `/extinguishers/maintenances/${usersData[i].Id_Extinguisher}`
            form.action = `/apiExtinguishers/deleteExtinguisher`
            form.method = 'POST'
            input.name = 'id'
            input.value = usersData[i].Id_Extinguisher
            input.type = 'hidden'
            button.textContent = 'Eliminar'
            
            form.appendChild(input);
            form.appendChild(button);

            fragment.appendChild(item);
            fragment.appendChild(link);
            fragment.appendChild(form)
            fragment.appendChild(br);

        }        
        extinguisherColumn.appendChild(fragment);
    }   
}
getExtinguishers();