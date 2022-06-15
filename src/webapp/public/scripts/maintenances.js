const maintenancesColumn = document.getElementById('maintenancesContainer');
const fragment = document.createDocumentFragment();


const getMaintenances = async () => {
    const response = await fetch(`/apiExtinguishers/getMaintenances`);
    if (response.status == 200){
        const usersData = await response.json();
        
        for (let i = 0; i < usersData.length; i++) {
            const item = document.createElement('li');
            item.textContent=`Id mantenimiento: ${usersData[i].Id} , Numero de extintor: ${usersData[i].Extinguisher_Id} , Creado el dia: ${usersData[i].Created_At} , Valido hasta: ${usersData[i].Valid_Until} , Descripcion: ${usersData[i].Comment}`;
            fragment.appendChild(item);
        }        
        maintenancesColumn.appendChild(fragment);
    }   
}
getMaintenances();