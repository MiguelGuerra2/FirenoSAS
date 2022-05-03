const usersColumn = document.getElementById('usersContainer');
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
    elements.p3 = document.createElement('p');
    elements.p4 = document.createElement('p');
    elements.p5 = document.createElement('p');
    elements.p6 = document.createElement('p');
    elements.p7 = document.createElement('p');
    elements.p8 = document.createElement('p');
    elements.p9 = document.createElement('p');
    elements.p10 = document.createElement('p');

    elements.buttonDelete = document.createElement('button');
    elements.buttonConfirm = document.createElement('button');   
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
    elements.p3.classList.add('textLabel');
    elements.p4.classList.add('textInfo','fw-light');
    elements.p5.classList.add('textLabel');
    elements.p6.classList.add('textInfo','fw-light');
    elements.p7.classList.add('textLabel');
    elements.p8.classList.add('textInfo','fw-light');
    elements.p9.classList.add('textLabel');
    elements.p10.classList.add('textInfo','fw-light');

    elements.imgUser.classList.add('imgVehicle');
    elements.imgConfig.classList.add('updateLogo','ms-auto','me-3');

    elements.buttonDelete.classList.add('btn','mx-auto','mt-2','btn-danger');    
    elements.buttonConfirm.classList.add('btn','mx-auto','mt-2','btn-success');
    
    return elements;
}

const configElements = (elements,info) => {
    elements.div.id = info.Nombre.toLowerCase() + ' ' + info.Apellido.toLowerCase();
    elements.p1.textContent = 'Nombre:';
    elements.p2.textContent = `${info.Nombre}`;
    elements.p9.textContent = 'Apellido:';
    elements.p10.textContent = `${info.Apellido}`;
    elements.p3.textContent = 'Empresa:';
    elements.p4.textContent = `${info.Empresa}`;
    elements.p5.textContent = 'Email:';
    elements.p6.textContent = `${info.Email}`;
    elements.p7.textContent = 'Tipo de usuario:';

    switch(info.Rol) {
        case 1: 
            elements.p8.textContent = `Cliente`;
            break;
        case 2: 
            elements.p8.textContent = `Interno`;
            break;
        case 3: 
            elements.p8.textContent = `Administrador`;
            break;
        case 4: 
            elements.p8.textContent = `Administrador Certificados`;
            break;
    } 
    elements.buttonDelete.textContent = 'Eliminar';
    elements.buttonDelete.dataset.bsToggle = 'modal';
    elements.buttonDelete.dataset.bsTarget = '#deleteModal';
    elements.buttonConfirm.textContent = 'Confirmar';
    elements.buttonConfirm.dataset.bsToggle = 'modal';
    elements.buttonConfirm.dataset.bsTarget = '#confirmModal';
    elements.configLink.dataset.bsToggle = 'modal';
    elements.configLink.dataset.bsTarget = '#updateModal'; 

    info.Confirmado ? elements.buttonConfirm.style.display = 'none': null;

    
    elements.imgUser.src = '/icons/profile.png';
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
    elements.divButton.appendChild(elements.buttonConfirm);

    elements.div.appendChild(elements.divLogo);
    elements.divInfo1.appendChild(elements.p1);
    elements.divInfo1.appendChild(elements.p2);
    elements.divInfo2.appendChild(elements.p9);
    elements.divInfo2.appendChild(elements.p10);
    elements.divInfo3.appendChild(elements.p3);
    elements.divInfo3.appendChild(elements.p4);
    elements.divInfo4.appendChild(elements.p5);
    elements.divInfo4.appendChild(elements.p6);
    elements.divInfo5.appendChild(elements.p7);
    elements.divInfo5.appendChild(elements.p8);
    elements.div.appendChild(elements.divInfo1);
    elements.div.appendChild(elements.divInfo2);
    elements.div.appendChild(elements.divInfo3);
    elements.div.appendChild(elements.divInfo4);
    elements.div.appendChild(elements.divInfo5);
    elements.div.appendChild(elements.divButton);    

    return elements.div;
};

const addListeners = (user,info) => {
    const divButton = user.lastElementChild;
    
    const settingsButton = user.firstChild.lastElementChild;
    const deleteButton = divButton.firstChild;
    const confirmButton = divButton.lastElementChild;
    
    settingsButton.addEventListener('click',() => {
        const idInputForm = document.getElementById('idUserForm');
        idInputForm.value = info.Id;
    })
    deleteButton.addEventListener('click',() => {
        const deleteButtonModal = document.getElementById('deleteButton');
        deleteButtonModal.href = `/apiAdmin/deleteUser?id=${info.Id}`
    })
    confirmButton.addEventListener('click',() => {
        const confirmButtonModal = document.getElementById('confirmButton');
        confirmButtonModal.href = `/apiAdmin/confirmUser?id=${info.Id}`
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
    const response = await fetch('/apiAdmin/getElements?q=1');
    
    if (response.status == 200){
        const usersData = await response.json();
        for (let i = 0; i < usersData.length; i++) {
            const user = buildBlock(usersData[i]);
            addListeners(user,usersData[i]);
            fragment.appendChild(user);
        }
        usersColumn.appendChild(fragment);
        const newUserDiv = document.getElementById('newUserDiv');
        const newUserButton = createUserButton();
        newUserDiv.appendChild(newUserButton);
    }   
}
getUsers();