const viewAll = document.getElementById('viewAll');
const fragment = document.createDocumentFragment();

const realTimeIcon = new L.Icon({
    iconUrl: "/icons/recordIcon1.png",
    iconSize: [28, 40]
});

let firstLoop = true;
let markers = {};
let divs = {};
let markersName = 'marcador';
let divsName = 'div';

const addAllMarkers = () => {
    const vehicleActive = document.querySelector('.vehicleInfoActive');
    if (vehicleActive) { vehicleActive.classList.remove('vehicleInfoActive')}

    for (marker in markers){
        markers[marker].addTo(map);
    };

    map.flyTo([4, -74], 5, {
        animate: true,
        duration: 1.5
    });

};

const removeMarkers = () => {
    for (marker in markers) {
        map.removeLayer(markers[marker]);
    };
};
const focusMarker = (marker) => {
    const coords = marker.getLatLng();
    const lat = coords.lat;
    const lng = coords.lng;
    removeMarkers();
    marker.addTo(map);
    map.flyTo([lat, lng], 13, {
        animate: true,
        duration: 1.5
    });
};

const createElements = () => {
    let elements = {};
    elements.div = document.createElement('div');
    elements.divAlertContainer = document.createElement('div');
    elements.divAlert1 = document.createElement('div');
    elements.divAlert2 = document.createElement('div');
    elements.divAlert3 = document.createElement('div');
    elements.divAlert4 = document.createElement('div');
    elements.divAlert5 = document.createElement('div');
    elements.divAlert6 = document.createElement('div');
    elements.divAlert7 = document.createElement('div');
    elements.divButton = document.createElement('div')

    elements.alertTitle = document.createElement('h4');
    elements.p1 = document.createElement('p');
    elements.p2 = document.createElement('p');
    elements.p3 = document.createElement('p');
    elements.p4 = document.createElement('p');
    elements.p5 = document.createElement('p');
    elements.p6 = document.createElement('p');
    elements.p7 = document.createElement('p');
    elements.p8 = document.createElement('p');
    elements.imgAlert1 = document.createElement('img');
    elements.imgAlert2 = document.createElement('img');
    elements.imgAlert3 = document.createElement('img');
    elements.imgAlert4 = document.createElement('img');
    elements.imgAlert5 = document.createElement('img');
    elements.imgAlert6 = document.createElement('img');
    elements.imgAlertState1 = document.createElement('img');
    elements.imgAlertState2 = document.createElement('img');
    elements.imgAlertState3 = document.createElement('img');
    elements.imgAlertState4 = document.createElement('img');
    elements.imgAlertState5 = document.createElement('img');
    elements.imgAlertState6 = document.createElement('img');

    elements.button = document.createElement('button');
    return elements;
};

const assignClasses = (elements) => {
    elements.div.classList.add('vehicleInfo');
    elements.divAlertContainer.classList.add('flex-column','align-items-center','mx-auto','my-2', 'rounded','d-none','d-lg-flex');
    elements.divAlert1.classList.add('row','col-12','mx-auto','px-auto','py-1','align-items-center','justify-content-center');
    elements.divAlert2.classList.add('alertsInfo');
    elements.divAlert3.classList.add('alertsInfo');
    elements.divAlert4.classList.add('alertsInfo');
    elements.divAlert5.classList.add('alertsInfo');
    elements.divAlert6.classList.add('alertsInfo');
    elements.divAlert7.classList.add('alertsInfo');
    elements.divButton.classList.add('container','d-flex','col-12');
 
    elements.alertTitle.classList.add('fs-5','mx-auto')
    elements.p1.classList.add('textLabel');
    elements.p2.classList.add('textInfo');
    elements.p3.classList.add('textLabel');
    elements.p4.classList.add('textInfo');
    elements.p5.classList.add('textLabel');
    elements.p6.classList.add('textInfo');
    elements.p7.classList.add('textLabel');
    elements.p8.classList.add('textInfo');
    
    elements.imgAlert1.classList.add('alertImage');
    elements.imgAlert2.classList.add('alertImage');
    elements.imgAlert3.classList.add('alertImage');
    elements.imgAlert4.classList.add('alertImage');
    elements.imgAlert5.classList.add('alertImage');
    elements.imgAlert6.classList.add('alertImage');

    elements.imgAlertState1.classList.add('noAlertNotification');
    elements.imgAlertState2.classList.add('alertNotification');
    elements.imgAlertState3.classList.add('noAlertNotification');
    elements.imgAlertState4.classList.add('noAlertNotification');
    elements.imgAlertState5.classList.add('noAlertNotification');
    elements.imgAlertState6.classList.add('noAlertNotification');

    elements.button.classList.add('btn','btn-dark','mx-auto','mt-2','vehicleButton');
    return elements;
}

const configElements = (elements,info) => {
    elements.div.id = info.Numero;
    elements.alertTitle.textContent = 'Alertas'
    elements.p1.textContent = 'Numero del equipo:';
    elements.p2.textContent = `${info.Numero}`;
    elements.p3.textContent = 'Marca:';
    elements.p4.textContent = `${info.Marca}`;
    elements.p5.textContent = 'Referencia:';
    elements.p6.textContent = `${info.Referencia}`;
    elements.p7.textContent = 'Empresa:';
    elements.p8.textContent = `${info.Empresa}`;
    elements.button.textContent = 'Ver ubicacion';
    
    elements.imgAlert1.src = '/icons/line1.png';
    elements.imgAlert2.src = '/icons/batery.png';
    elements.imgAlert3.src = '/icons/line2.png';
    elements.imgAlert4.src = '/icons/problemGeneral.png';
    elements.imgAlert5.src = '/icons/problem2.png';
    elements.imgAlert6.src = '/icons/act.png';

    elements.imgAlertState1.src = '/icons/noAlertNotification.svg';
    elements.imgAlertState2.src = '/icons/alertNotification.svg';
    elements.imgAlertState3.src = '/icons/noAlertNotification.svg';
    elements.imgAlertState4.src = '/icons/noAlertNotification.svg';
    elements.imgAlertState5.src = '/icons/noAlertNotification.svg';
    elements.imgAlertState6.src = '/icons/noAlertNotification.svg';
    
    return elements;
}
const buildBlock = (info) => {
    let elements = createElements();
    elements = assignClasses(elements);
    elements = configElements(elements,info);
    
    elements.divAlert2.appendChild(elements.imgAlert1);
    elements.divAlert3.appendChild(elements.imgAlert2);
    elements.divAlert4.appendChild(elements.imgAlert3);
    elements.divAlert5.appendChild(elements.imgAlert4);
    elements.divAlert6.appendChild(elements.imgAlert5);
    elements.divAlert7.appendChild(elements.imgAlert6);
    
    elements.divAlert2.appendChild(elements.imgAlertState1);
    elements.divAlert3.appendChild(elements.imgAlertState2);
    elements.divAlert4.appendChild(elements.imgAlertState3);
    elements.divAlert5.appendChild(elements.imgAlertState4);
    elements.divAlert6.appendChild(elements.imgAlertState5);
    elements.divAlert7.appendChild(elements.imgAlertState6);

    elements.divAlert1.appendChild(elements.divAlert2);
    elements.divAlert1.appendChild(elements.divAlert3);
    elements.divAlert1.appendChild(elements.divAlert4);
    elements.divAlert1.appendChild(elements.divAlert5);
    elements.divAlert1.appendChild(elements.divAlert6);
    elements.divAlert1.appendChild(elements.divAlert7);

    elements.divAlertContainer.appendChild(elements.alertTitle);
    elements.divAlertContainer.appendChild(elements.divAlert1);

    elements.divButton.appendChild(elements.button);

    elements.div.appendChild(elements.p1);
    elements.div.appendChild(elements.p2);
    elements.div.appendChild(elements.p3);
    elements.div.appendChild(elements.p4);
    elements.div.appendChild(elements.p5);
    elements.div.appendChild(elements.p6);
    elements.div.appendChild(elements.p7);
    elements.div.appendChild(elements.p8);
    elements.div.appendChild(elements.divAlertContainer);
    elements.div.appendChild(elements.divButton);    

    return elements.div;
};

const addListeners = (vehicleButton, marker) => {
    viewAll.addEventListener('click',addAllMarkers);
    vehicleButton.addEventListener('click',()=> {
        const vehicleActive = document.querySelector('.vehicleInfoActive');
        if (vehicleActive) { vehicleActive.classList.remove('vehicleInfoActive')}
        focusMarker(marker);
        vehicleButton.parentNode.classList.add('vehicleInfoActive');
    })
};

const loadData = async () => {
    const response = await fetch('/apiClient/getCoordsRealTime');
    const fragment = document.createDocumentFragment();
    if (response.status == 200) {
        const vehicleContainer = document.getElementById('vehicleContainer');
        const info = await response.json();
        
        for (let i = 0; i < info.length; i++) {  
            const vehicle = buildBlock(info[i]);
            fragment.appendChild(vehicle);
            markers[markersName+i] = L.marker([info[i].Latitud,info[i].Longitud], {
                title: "Coordenadas",
                draggable:false,
                icon: realTimeIcon
            }).addTo(map);
            addListeners(vehicle.lastElementChild, markers[markersName+i]);
        };
        vehicleContainer.appendChild(fragment);
    };
};

const updateMapData = async () => {
    const response = await fetch('/apiClient/getCoordsRealTime');
    if (response.status == 200) {
        const info = await response.json();
        for (let i = 0; i < info.length; i++) {  
            markers[markersName+i].setLatLng([info[i].Latitud,info[i].Longitud]);
        };
    };
};

loadData();
setInterval(updateMapData,5000);