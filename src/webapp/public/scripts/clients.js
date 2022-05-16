const clientsColumn = document.getElementById('clientsContainer');
const fragment = document.createDocumentFragment();

const createElements = () => {
    let elements = {};
    elements.div = document.createElement('div');
    elements.divLogo = document.createElement('div');
    elements.divButton = document.createElement('div');
    elements.divInfo1 = document.createElement('div');
    elements.divInfo2 = document.createElement('div');
    elements.divInfo3 = document.createElement('div');
    elements.divInfo4 = document.createElement('div');
    elements.divInfo5 = document.createElement('div');

    elements.imgUser = document.createElement('img');
    elements.imgConfig = document.createElement('img');

    elements.configLink = document.createElement('a');

    elements.p1 = document.createElement('p');
    elements.p2 = document.createElement('p');

    elements.buttonDelete = document.createElement('button');
    return elements;
};

const assignClasses = (elements) => {
    elements.div.classList.add('col-11','col-md-8','mx-auto','bgGrayLight','my-3','py-3','px-1','px-md-5','divUsers','justify-content-between');
    elements.divLogo.classList.add('col-12','d-flex','position-relative','mb-4')
    elements.divButton.classList.add('container','d-flex','col-12','my-4');

    elements.divInfo1.classList.add('d-flex','justify-content-between','col-12');
    elements.divInfo2.classList.add('d-flex','justify-content-between','col-12');
    elements.divInfo3.classList.add('d-flex','justify-content-between','col-12');
    elements.divInfo4.classList.add('d-flex','justify-content-between','col-12');
    elements.divInfo5.classList.add('d-flex','justify-content-between','col-12');

    elements.configLink.classList.add('rounded-circle','updateLogoContainer','position-absolute');

    elements.p1.classList.add('textLabel');
    elements.p2.classList.add('textInfo','fw-light');

    elements.imgUser.classList.add('imgVehicle');
    elements.imgConfig.classList.add('updateLogo','ms-auto','me-3');

    elements.buttonDelete.classList.add('btn','mx-auto','mt-2','btn-danger');    
    
    return elements;
}

const configElements = (elements,info) => {
    elements.div.id = info.Compania.toLowerCase();
    elements.p1.textContent = 'Nombre de empresa:';
    elements.p2.textContent = `${info.Compania}`;

    elements.buttonDelete.textContent = 'Eliminar';
    elements.buttonDelete.dataset.bsToggle = 'modal';
    elements.buttonDelete.dataset.bsTarget = '#deleteModal';
    elements.configLink.dataset.bsToggle = 'modal';
    elements.configLink.dataset.bsTarget = '#updateModal'; 

    
    elements.imgUser.src = '/icons/clients.svg';
    elements.imgConfig.src = '../icons/settings.svg'

    elements.imgUser.style.height = '40px';

    return elements;
}
const buildBlock = (info) => {
    let elements = createElements();
    elements = assignClasses(elements);
    elements = configElements(elements,info);

    elements.configLink.appendChild(elements.imgConfig);

    elements.divLogo.appendChild(elements.imgUser);
    elements.divLogo.appendChild(elements.configLink);

    elements.divButton.appendChild(elements.buttonDelete);

    elements.div.appendChild(elements.divLogo);
    elements.divInfo1.appendChild(elements.p1);
    elements.divInfo1.appendChild(elements.p2);
    elements.div.appendChild(elements.divInfo1);
    elements.div.appendChild(elements.divButton);    

    return elements.div;
};

const addListeners = (user,info) => {
    const divButton = user.lastElementChild;
    
    const settingsButton = user.firstChild.lastElementChild;
    const deleteButton = divButton.firstChild;
    
    settingsButton.addEventListener('click',() => {
        const idInputForm = document.getElementById('idClientForm');
        idInputForm.value = info.Id;
    })
    deleteButton.addEventListener('click',() => {
        const deleteButtonModal = document.getElementById('deleteButton');
        deleteButtonModal.href = `/apiAdmin/deleteClient?id=${info.Id}`
    })
    
};

const createUserButton = () => {
    const addButton = document.createElement('a');
    addButton.textContent = '+';
    addButton.dataset.bsToggle = 'modal';
    addButton.dataset.bsTarget = '#newUserModal';
    addButton.classList.add('newElementButton');
    return addButton;
}

const getUsers = async () => {
    const response = await fetch('/apiAdmin/getClients');
    
    if (response.status == 200){
        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            const user = buildBlock(usersData[i]);
            addListeners(user,usersData[i]);
            fragment.appendChild(user);
        }
        clientsColumn.appendChild(fragment);
        const newUserDiv = document.getElementById('newClientDiv');
        const newUserButton = createUserButton();
        newUserDiv.appendChild(newUserButton);
    }   
}
getUsers();