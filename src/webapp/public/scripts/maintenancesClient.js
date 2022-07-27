const maintenancesColumn = document.getElementById('maintenancesContainer');
const fragment = document.createDocumentFragment();
const extinguisherID = window.location.pathname.split('/').pop();

const getMaintenances = async () => {
    const response1 = await fetch(`/apiExtinguishers/getExtinguisher/${extinguisherID}`);
    if (response1.status == 200){
        const usersData1 = await response1.json();
        const div = document.createElement('div');
        div.innerHTML = `CARACTERISTICAS: <br> Agente: ${usersData1[0].Agent_Name}, Capacidad: ${usersData1[0].Capacity}, Cliente: ${usersData1[0].Compania}`
        maintenancesColumn.appendChild(div);
    }
    const response = await fetch(`/apiExtinguishers/getMaintenances/${extinguisherID}`);
    if (response.status == 200){

        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            const item = document.createElement('li');
            item.textContent=`Id mantenimiento: ${usersData[i].Id} , Creado el dia: ${usersData[i].Created_At.split('T')[0]} , Valido hasta: ${usersData[i].Valid_Until.split('T')[0]} , Descripcion: ${usersData[i].Comment}`;

            fragment.appendChild(item);
        }        
        maintenancesColumn.appendChild(fragment);
        const info1 = document.createElement('p')
        info1.innerHTML = 'No existen mantenimientos registrados para este equipo'
        usersData.length == 0 ? maintenancesColumn.appendChild(info1) : null
    } else {
        const usersData = await response.text();
        maintenancesColumn.innerHTML = usersData
    }
}
getMaintenances();