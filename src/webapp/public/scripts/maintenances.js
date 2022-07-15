const maintenancesColumn = document.getElementById('maintenancesContainer');
const fragment = document.createDocumentFragment();
const extinguisherID = window.location.pathname.split('/').pop();

const getMaintenances = async () => {
    let link;
    extinguisherID == 'maintenances' ? link = '/apiExtinguishers/getMaintenances' : link = `/apiExtinguishers/getMaintenances/${extinguisherID}`
    const response = await fetch(link);
    if (response.status == 200){

        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            const item = document.createElement('li');
            item.textContent=`Id mantenimiento: ${usersData[i].Id} , Numero de extintor: ${usersData[i].Extinguisher_Id} , Creado el dia: ${usersData[i].Created_At.split('T').join(' ').split('.')[0]} , Valido hasta: ${usersData[i].Valid_Until.split('T').join(' ').split('.')[0]} , Descripcion: ${usersData[i].Comment}`;
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