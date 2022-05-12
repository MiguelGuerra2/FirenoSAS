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
    map.flyTo([lat, lng], 15, {
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
    elements.divAlert8 = document.createElement('div');
    elements.divAlert9 = document.createElement('div');
    elements.divAlert10 = document.createElement('div');
    elements.divAlert11 = document.createElement('div');
    elements.divButton = document.createElement('div');
    elements.divVehicle = document.createElement('div');

    elements.divCenter1 = document.createElement('div');
    elements.divCenter2 = document.createElement('div');
    elements.divCenter3 = document.createElement('div');
    elements.divCenter4 = document.createElement('div');

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
    elements.imgAlert7 = document.createElement('img');
    elements.imgAlert8 = document.createElement('img');
    elements.imgAlert9 = document.createElement('img');
    elements.imgAlert10 = document.createElement('img');
    elements.imgAlertState1 = document.createElement('img');
    elements.imgAlertState2 = document.createElement('img');
    elements.imgAlertState3 = document.createElement('img');
    elements.imgAlertState4 = document.createElement('img');
    elements.imgAlertState5 = document.createElement('img');
    elements.imgAlertState6 = document.createElement('img');
    elements.imgAlertState7 = document.createElement('img');
    elements.imgAlertState8 = document.createElement('img');
    elements.imgAlertState9 = document.createElement('img');
    elements.imgAlertState10 = document.createElement('img');
    elements.imgVehicle = document.createElement('img');

    elements.button = document.createElement('button');
    
    return elements;
};

const assignClasses = (elements) => {
    elements.div.classList.add('vehicleInfo');
    elements.divAlertContainer.classList.add('flex-column','align-items-center','mx-auto','my-2', 'rounded','d-flex');
    elements.divAlert1.classList.add('row','col-11','flex-wrap','mx-auto','px-auto','py-1','align-items-center','justify-content-center');
    elements.divAlert2.classList.add('alertsInfo');
    elements.divAlert3.classList.add('alertsInfo');
    elements.divAlert4.classList.add('alertsInfo');
    elements.divAlert5.classList.add('alertsInfo');
    elements.divAlert6.classList.add('alertsInfo');
    elements.divAlert7.classList.add('alertsInfo');
    elements.divAlert8.classList.add('alertsInfo');
    elements.divAlert9.classList.add('alertsInfo');
    elements.divAlert10.classList.add('alertsInfo');
    elements.divAlert11.classList.add('alertsInfo');
    elements.divButton.classList.add('container','d-flex','col-12');
    elements.divVehicle.classList.add('col-12','mx-0','d-flex');
    
    elements.divCenter1.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');
    elements.divCenter2.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');
    elements.divCenter3.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');
    elements.divCenter4.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');

    elements.alertTitle.classList.add('fs-5','mx-auto')
    elements.p1.classList.add('textLabel');
    elements.p2.classList.add('textInfo','fw-light');
    elements.p3.classList.add('textLabel');
    elements.p4.classList.add('textInfo','fw-light');
    elements.p5.classList.add('textLabel');
    elements.p6.classList.add('textInfo','fw-light');
    elements.p7.classList.add('textLabel');
    elements.p8.classList.add('textInfo','fw-light');
    
    elements.imgVehicle.classList.add('imgVehicle');

    elements.imgAlert1.classList.add('alertImage');
    elements.imgAlert2.classList.add('alertImage');
    elements.imgAlert3.classList.add('alertImage');
    elements.imgAlert4.classList.add('alertImage');
    elements.imgAlert5.classList.add('alertImage');
    elements.imgAlert6.classList.add('alertImage');
    elements.imgAlert7.classList.add('alertImage');
    elements.imgAlert8.classList.add('alertImage');
    elements.imgAlert9.classList.add('alertImage');
    elements.imgAlert10.classList.add('alertImage');

    elements.button.classList.add('btn','mx-auto','mt-2','vehicleButton');
    return elements;
}

const configElements = (elements,info,loopNumber) => {
    elements.div.id = info.Numero;

    elements.divAlert2.title = 'Alarma 1';
    elements.divAlert3.title = 'Alarma 2';
    elements.divAlert4.title = 'Alarma 3';
    elements.divAlert5.title = 'Alarma 4';
    elements.divAlert6.title = 'Alarma 5';
    elements.divAlert7.title = 'Alarma 6';
    elements.divAlert8.title = 'Alarma 7';
    elements.divAlert9.title = 'Alarma 8';
    elements.divAlert10.title = 'Alarma 9';
    elements.divAlert11.title = 'Alarma 10';

    elements.alertTitle.textContent = 'Alertas'
    elements.p1.textContent = 'Numero:';
    elements.p2.textContent = `${info.Numero}`;
    elements.p3.textContent = 'Marca:';
    elements.p4.textContent = `${info.Marca}`;
    elements.p5.textContent = 'Referencia:';
    elements.p6.textContent = `${info.Referencia}`;
    elements.p7.textContent = 'Empresa:';
    elements.p8.textContent = `${info.Empresa}`;
    elements.button.textContent = 'Ver ubicacion';
    
    elements.imgAlert1.src = '/icons/alarm_10.png';
    elements.imgAlert2.src = '/icons/alarm_7.png';
    elements.imgAlert3.src = '/icons/alarm_8.png';
    elements.imgAlert4.src = '/icons/batery.png';
    elements.imgAlert5.src = '/icons/line1.png';
    elements.imgAlert6.src = '/icons/alarm_11.png';
    elements.imgAlert7.src = '/icons/problem2.png';
    elements.imgAlert8.src = '/icons/line2.png';
    elements.imgAlert9.src = '/icons/alarm_9.png';
    elements.imgAlert10.src = '/icons/problemGeneral.png';

    elements.imgVehicle.src = '/icons/truck.svg';

    for (let i = 1; i <= 10; i++) {
        const alertName = `imgAlertState${i}`;
        const alertState = info[`Alarma_${i}`];
        elements[alertName].classList.add(`alertState${loopNumber}`);
        if ( alertState == 0 ) {
            elements[alertName].classList.add('noAlertNotification');
            elements[alertName].src = '/icons/noAlertNotification.svg';
        } else {
            elements[alertName].classList.add('alertNotification');
            elements[alertName].src = '/icons/alertNotification.svg';
        }
    }
    
    return elements;
}
const buildBlock = (info,loopNumber) => {
    let elements = createElements();
    elements = assignClasses(elements);
    elements = configElements(elements,info,loopNumber);
    
    elements.divVehicle.appendChild(elements.imgVehicle);

    elements.divAlert2.appendChild(elements.imgAlert1);
    elements.divAlert3.appendChild(elements.imgAlert2);
    elements.divAlert4.appendChild(elements.imgAlert3);
    elements.divAlert5.appendChild(elements.imgAlert4);
    elements.divAlert6.appendChild(elements.imgAlert5);
    elements.divAlert7.appendChild(elements.imgAlert6);
    elements.divAlert8.appendChild(elements.imgAlert7);
    elements.divAlert9.appendChild(elements.imgAlert8);
    elements.divAlert10.appendChild(elements.imgAlert9);
    elements.divAlert11.appendChild(elements.imgAlert10);
    
    elements.divAlert2.appendChild(elements.imgAlertState1);
    elements.divAlert3.appendChild(elements.imgAlertState2);
    elements.divAlert4.appendChild(elements.imgAlertState3);
    elements.divAlert5.appendChild(elements.imgAlertState4);
    elements.divAlert6.appendChild(elements.imgAlertState5);
    elements.divAlert7.appendChild(elements.imgAlertState6);
    elements.divAlert8.appendChild(elements.imgAlertState7);
    elements.divAlert9.appendChild(elements.imgAlertState8);
    elements.divAlert10.appendChild(elements.imgAlertState9);
    elements.divAlert11.appendChild(elements.imgAlertState10);

    elements.divAlert1.appendChild(elements.divAlert2);
    elements.divAlert1.appendChild(elements.divAlert3);
    elements.divAlert1.appendChild(elements.divAlert4);
    elements.divAlert1.appendChild(elements.divAlert5);
    elements.divAlert1.appendChild(elements.divAlert6);
    elements.divAlert1.appendChild(elements.divAlert7);
    elements.divAlert1.appendChild(elements.divAlert8);
    elements.divAlert1.appendChild(elements.divAlert9);
    elements.divAlert1.appendChild(elements.divAlert10);
    elements.divAlert1.appendChild(elements.divAlert11);

    elements.divAlertContainer.appendChild(elements.alertTitle);
    elements.divAlertContainer.appendChild(elements.divAlert1);

    elements.divButton.appendChild(elements.button);

    elements.div.appendChild(elements.divVehicle);
    elements.divCenter1.appendChild(elements.p1);
    elements.divCenter1.appendChild(elements.p2);
    elements.divCenter2.appendChild(elements.p3);
    elements.divCenter2.appendChild(elements.p4);
    elements.divCenter3.appendChild(elements.p5);
    elements.divCenter3.appendChild(elements.p6);
    elements.divCenter4.appendChild(elements.p7);
    elements.divCenter4.appendChild(elements.p8);
    elements.div.appendChild(elements.divCenter1);    
    elements.div.appendChild(elements.divCenter2);    
    elements.div.appendChild(elements.divCenter3);    
    elements.div.appendChild(elements.divCenter4);    
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
            const vehicle = buildBlock(info[i],i);
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

const updateData = async () => {
    const response = await fetch('/apiClient/getCoordsRealTime');
    if (response.status == 200) {
        const info = await response.json();
        for (let i = 0; i < info.length; i++) {
            const alertsStates = document.querySelectorAll(`.alertState${i}`);        
            for (let j = 1; j <= 10; j++) {
                const alertImageName = `Alarma_${j}`
                if ( info[i][alertImageName] == 0) {
                    if ( alertsStates[j-1].classList.contains('alertNotification') ) {
                        alertsStates[j-1].classList.remove('alertNotification');
                    }
                    alertsStates[j-1].classList.add('noAlertNotification');
                    alertsStates[j-1].src = '/icons/noAlertNotification.svg';
                } else {
                    if ( alertsStates[j-1].classList.contains('noAlertNotification') ) {
                        alertsStates[j-1].classList.remove('noAlertNotification');
                    }
                    alertsStates[j-1].classList.add('alertNotification');
                    alertsStates[j-1].src = '/icons/alertNotification.svg';
                }
            }
            markers[markersName+i].setLatLng([info[i].Latitud,info[i].Longitud]);
        };
    };
};

const viewAll = document.getElementById('viewAll');
const fragment = document.createDocumentFragment();

const realTimeIcon = new L.Icon({
    iconUrl: "/icons/recordIcon1.png",
    iconSize: [25, 65]
});

let firstLoop = true;
let markers = {};
let divs = {};
let markersName = 'marcador';
let divsName = 'div';

loadData();
setInterval(updateData,1000);