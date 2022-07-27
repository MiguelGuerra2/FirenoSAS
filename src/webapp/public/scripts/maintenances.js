const maintenancesColumn = document.getElementById('maintenancesContainer');
const fragment = document.createDocumentFragment();
const idUpdate = document.getElementById('id');
const idInput = document.getElementById('extinguisher_id');
const idInputUpdate = document.getElementById('extinguisher_id_update');
let extinguisherID = window.location.pathname.split('/').pop();
console.log(extinguisherID)
extinguisherID == 'maintenances' ? extinguisherID = null : null;

idUpdate ? idUpdate.value = extinguisherID : null;
idUpdate ? idInput.value = extinguisherID : null;
idInputUpdate.value = extinguisherID;

const getMaintenances = async () => {
    let link;
    extinguisherID == null ? link = '/apiExtinguishers/getMaintenances' : link = `/apiExtinguishers/getMaintenances/${extinguisherID}`
    if (extinguisherID != 'maintenances') {
        const response1 = await fetch(`/apiExtinguishers/getExtinguisher/${extinguisherID}`);
        if (response1.status == 200){
            const usersData1 = await response1.json();
            const div = document.createElement('div');
            div.innerHTML = `CARACTERISTICAS: <br> Agente: ${usersData1[0].Agent_Name}, Capacidad: ${usersData1[0].Capacity}, Cliente: ${usersData1[0].Compania}`
            maintenancesColumn.appendChild(div);
        }
    }
    const response = await fetch(link);
    if (response.status == 200){

        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            const item = document.createElement('li');
            const form = document.createElement('form'); 
            const input = document.createElement('input');   
            const input2 = document.createElement('input');   
            const button = document.createElement('button');       
            item.textContent=`Id mantenimiento: ${usersData[i].Id} , Creado el dia: ${usersData[i].Created_At.split('T').join(' ').split('.')[0]} , Valido hasta: ${usersData[i].Valid_Until.split('T').join(' ').split('.')[0]} , Descripcion: ${usersData[i].Comment}`;
            form.action = `/apiExtinguishers/deleteMaintenance`
            form.method = 'POST'
            input.name = 'extinguisherId'
            input.value = extinguisherID
            input.type = 'hidden'
            input2.name = 'id'
            input2.value = usersData[i].Id
            input2.type = 'hidden'
            button.textContent = 'Eliminar'
            
            form.appendChild(input);
            form.appendChild(input2);
            form.appendChild(button);

            fragment.appendChild(item);
            fragment.appendChild(form);
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