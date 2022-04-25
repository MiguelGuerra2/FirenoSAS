const usersColumn = document.getElementById('machinesContainer');
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


    elements.imgUser = document.createElement('img');
    elements.userTitle = document.createElement('h4');
    elements.p1 = document.createElement('p');
    elements.p2 = document.createElement('p');
    elements.p3 = document.createElement('p');
    elements.p4 = document.createElement('p');
    elements.p5 = document.createElement('p');
    elements.p6 = document.createElement('p');
    elements.p7 = document.createElement('p');
    elements.p8 = document.createElement('p');
    elements.buttonDelete = document.createElement('button');
    return elements;
};

const assignClasses = (elements) => {
    elements.div.classList.add('col-11','col-lg-5','mx-4','bgGrayLight','my-3','py-3','px-4','divUsers');
    elements.divLogo.classList.add('col-12','d-flex')
    elements.divButton.classList.add('container','d-flex','col-12','my-4');

    elements.divInfo1.classList.add('d-flex','justify-content-between','col-12');
    elements.divInfo2.classList.add('d-flex','justify-content-between','col-12');
    elements.divInfo3.classList.add('d-flex','justify-content-between','col-12');
    elements.divInfo4.classList.add('d-flex','justify-content-between','col-12');


    elements.userTitle.classList.add('fs-5','mx-auto','col-7')
    elements.p1.classList.add('textLabel','w-50');
    elements.p2.classList.add('textInfo','fw-light');
    elements.p3.classList.add('textLabel','w-50');
    elements.p4.classList.add('textInfo','fw-light');
    elements.p5.classList.add('textLabel','w-50');
    elements.p6.classList.add('textInfo','fw-light');
    elements.p7.classList.add('textLabel','w-50');
    elements.p8.classList.add('textInfo','fw-light');
    
    elements.imgUser.classList.add('imgVehicle');

    elements.buttonDelete.classList.add('btn','mx-auto','btn-danger');    
    return elements;
}

const configElements = (elements,info) => {
    elements.div.id = info.Numero;
    elements.userTitle.textContent = 'Alertas'
    elements.p1.textContent = 'Numero:';
    elements.p2.textContent = `${info.Numero}`;
    elements.p3.textContent = 'Referencia:';
    elements.p4.textContent = `${info.Referencia}`;
    elements.p5.textContent = 'Marca:';
    elements.p6.textContent = `${info.Marca}`;
    elements.p7.textContent = 'Cliente:';
    elements.p8.textContent = `${info.Cliente}`;
    elements.buttonDelete.textContent = 'Eliminar';
    elements.buttonDelete.dataset.bsToggle = 'modal';
    elements.buttonDelete.dataset.bsTarget = '#deleteModal';
    
    elements.imgUser.src = '/icons/profileHeader.svg';
    elements.imgUser.style.height = '40px';

    return elements;
}
const buildBlock = (info) => {
    let elements = createElements();
    elements = assignClasses(elements);
    elements = configElements(elements,info);

    elements.divLogo.appendChild(elements.imgUser);

    elements.divButton.appendChild(elements.buttonDelete);

    elements.divInfo1.appendChild(elements.p1);
    elements.divInfo1.appendChild(elements.p2);
    elements.divInfo2.appendChild(elements.p3);
    elements.divInfo2.appendChild(elements.p4);
    elements.divInfo3.appendChild(elements.p5);
    elements.divInfo3.appendChild(elements.p6);
    elements.divInfo4.appendChild(elements.p7);
    elements.divInfo4.appendChild(elements.p8);
        
    elements.div.appendChild(elements.divLogo);
    elements.div.appendChild(elements.divInfo1);
    elements.div.appendChild(elements.divInfo2);
    elements.div.appendChild(elements.divInfo3);
    elements.div.appendChild(elements.divInfo4);
    elements.div.appendChild(elements.divButton);    

    return elements.div;
};

const addListeners = (divButton,info) => {
    const deleteButton = divButton.firstChild;
    
    deleteButton.addEventListener('click',() => {
        const deleteButtonModal = document.getElementById('deleteButton');
        deleteButtonModal.href = `/apiAdmin/deleteMachine?id=${info.Id}`
    })
};


const getMachines = async () => {
    const response = await fetch('/apiAdmin/getElements?q=2');
    
    if (response.status == 200){
        const usersData = await response.json();
        
        for (let i = 0; i < usersData.length; i++) {
            const machine = buildBlock(usersData[i]);
            const buttonDiv = machine.lastElementChild;
            addListeners(buttonDiv,usersData[i]);
            fragment.appendChild(machine);
        }
        usersColumn.appendChild(fragment);
    }   
}
getMachines();