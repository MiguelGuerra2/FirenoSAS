const extinguisherColumn = document.getElementById('extinguishersContainer');
const fragment = document.createDocumentFragment();


const getExtinguishers = async () => {
    const response = await fetch(`/apiExtinguishers/getExtinguishers`);
    if (response.status == 200){
        const usersData = await response.json();
        
        for (let i = 0; i < usersData.length; i++) {
            const item = document.createElement('li');
            item.textContent=`Id: ${usersData[i].Id_Extinguisher} , Agente: ${usersData[i].Agent_Name} , Capacidad: ${usersData[i].Capacity} , Codigo: ${usersData[i].Id_Code}`;
            fragment.appendChild(item);
        }        
        extinguisherColumn.appendChild(fragment);
    }   
}
getExtinguishers();