const extinguisherColumn = document.getElementById('extinguishersContainer');
const fragment = document.createDocumentFragment();


const getExtinguishers = async () => {
    const response = await fetch(`/apiExtinguishers/getExtinguishers`);
    if (response.status == 200){
        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            const item = document.createElement('li');
            const link = document.createElement('a');            
            const br = document.createElement('br');            
            item.style.display = 'inline';
            item.textContent=`Id: ${usersData[i].Id_Extinguisher} , Cliente: ${usersData[i].Compania}, Agente: ${usersData[i].Agent_Name} , Capacidad: ${usersData[i].Capacity}`;
            link.textContent = 'Ver informacion'
            link.href = `/extinguishers/maintenances/${usersData[i].Id_Extinguisher}`
            
            fragment.appendChild(item);
            fragment.appendChild(link);
            fragment.appendChild(br)
        }        
        extinguisherColumn.appendChild(fragment);
    }   
}
getExtinguishers();