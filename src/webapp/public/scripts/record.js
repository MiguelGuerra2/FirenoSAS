const infoColumn = document.getElementById('infoColumn');
const fragment = document.createDocumentFragment();
const polyline = L.polyline([["0", "0"]], {
    color: "#48577B",
    weight: 3,
    opacity: 0.9,
    smoothFactor: 1
}).addTo(map);
let markers = {};
let markersName = 'marcador';

const recordIcon = new L.Icon({
    iconUrl: "/icons/circle.png",
    iconSize: [8, 8]
});
const startendIcon = new L.Icon({
    iconUrl: "/icons/circle2.png",
    iconSize: [12, 12]
});

const createElements = () => {
    let elements = {};
    elements.div = document.createElement('div');
    elements.divCalendar1 = document.createElement('div');
    elements.divCalendar2 = document.createElement('div');
    elements.divButton = document.createElement('div');
    elements.divArrow = document.createElement('div');
    elements.divVehicle = document.createElement('div');

    elements.divCenter1 = document.createElement('div');
    elements.divCenter2 = document.createElement('div');
    elements.divCenter3 = document.createElement('div');
    elements.divCenter4 = document.createElement('div');

    elements.p1 = document.createElement('p');
    elements.p2 = document.createElement('p');
    elements.p3 = document.createElement('p');
    elements.p4 = document.createElement('p');
    elements.p5 = document.createElement('p');
    elements.p6 = document.createElement('p');
    elements.p7 = document.createElement('p');
    elements.p8 = document.createElement('p');

    elements.arrow = document.createElement('img');

    elements.label1 = document.createElement('label');
    elements.label2 = document.createElement('label');

    elements.calendar1 = document.createElement("input");
    elements.calendar2 = document.createElement("input");

    elements.imgVehicle = document.createElement('img');

    elements.button = document.createElement('button');
    return elements;
};

const assignClasses = (elements) => {
    elements.div.classList.add('vehicleInfoRecord');
    elements.divCalendar1.classList.add('form-floating','mb-2','form-control','position-relative','p-0')
    elements.divCalendar2.classList.add('form-floating','mb-2','form-control','position-relative','p-0')
    elements.divButton.classList.add('container','flex-column','col-12','vehicleButtonRecord');
    elements.divArrow.classList.add('d-flex','col-12');
    elements.divVehicle.classList.add('col-12','mx-0','d-flex');

    elements.divCenter1.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');
    elements.divCenter2.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');
    elements.divCenter3.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');
    elements.divCenter4.classList.add('col-11', 'mx-auto', 'd-flex', 'justify-content-between');

    elements.p1.classList.add('textLabel');
    elements.p2.classList.add('textInfo','fw-light');
    elements.p3.classList.add('textLabel');
    elements.p4.classList.add('textInfo','fw-light');
    elements.p5.classList.add('textLabel');
    elements.p6.classList.add('textInfo','fw-light');
    elements.p7.classList.add('textLabel');
    elements.p8.classList.add('textInfo','fw-light');

    elements.arrow.classList.add('arrowDown','mx-auto');
    
    elements.imgVehicle.classList.add('imgVehicle');

    elements.label1.classList.add('mt-3');
    elements.calendar1.classList.add('col-12','mx-0','border-0','p-2','rounded','rounded-3');
    elements.calendar2.classList.add('col-12','mx-0','border-0','p-2','rounded','rounded-3');
    elements.button.classList.add('btn','vehicleButton','mx-auto','mt-2');
    
    return elements;
}

const configElements = (elements,info) => {
    elements.imgVehicle.src = '/icons/truck.svg';
    elements.div.id = info.Numero;
    elements.p1.textContent = 'Numero:';
    elements.p2.textContent = info.Numero;
    elements.p3.textContent = 'Marca:';
    elements.p4.textContent = info.Marca;
    elements.p5.textContent = 'Referencia:';
    elements.p6.textContent = info.Referencia;
    elements.p7.textContent = 'Empresa:';
    elements.p8.textContent = info.Compania;
    elements.button.textContent = 'Consultar';
    elements.label1.textContent = 'Fecha inicial:';
    elements.label2.textContent = 'Fecha final:';
    elements.label1.htmlFor = 'calendar1' + info.Numero;
    elements.label2.htmlFor = 'calendar2' + info.Numero;
    elements.calendar1.type = 'date';
    elements.calendar2.type = 'date';
    elements.calendar1.id = 'calendar1' + info.Numero;
    elements.calendar2.id = 'calendar2' + info.Numero;
    elements.calendar1.name = 'calendar1' + info.Numero;
    elements.calendar2.name = 'calendar2' + info.Numero;
    elements.arrow.src = '/icons/arrowDown.svg'
    
    return elements;
}
const buildBlock = (info) => {
    let elements = createElements();
    elements = assignClasses(elements);
    elements = configElements(elements,info);

    elements.divVehicle.appendChild(elements.imgVehicle);
    elements.divCalendar1.appendChild(elements.calendar1);
    elements.divCalendar2.appendChild(elements.calendar2);
    elements.divButton.appendChild(elements.label1);
    elements.divButton.appendChild(elements.divCalendar1);
    elements.divButton.appendChild(elements.label2);
    elements.divButton.appendChild(elements.divCalendar2);
    elements.divButton.appendChild(elements.button);
    elements.divArrow.appendChild(elements.arrow);

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
    elements.div.appendChild(elements.divButton);
    elements.div.appendChild(elements.divArrow);    

    return elements.div;
};

const addListeners = (vehicle,info) => {
    const vehicleArrow = vehicle.lastElementChild;
    const buttonDiv = vehicle.children[5];
    const button = buttonDiv.lastElementChild;
    vehicleArrow.addEventListener('click',()=> {
        const vehicle = document.getElementById(info.Numero);
        const buttonDivs = document.querySelectorAll('.vehicleButtonRecord');
        const vehicleDivs = document.querySelectorAll('.vehicleInfoRecord');
        const arrows = document.querySelectorAll('.arrowDown');
        if (vehicle.style.height == '422px') {
            vehicle.style.height = '220px';
            buttonDiv.style.display = 'none';
            vehicleArrow.style.transform = 'rotate(0deg)';
        } else {
            vehicle.style.height = '422px';
            buttonDiv.style.display = 'flex';
            vehicleArrow.style.transform = 'rotate(180deg)';
            vehicle.scrollIntoView({
                behavior: 'smooth'
            });
        }
        for (let i = 0; i < buttonDivs.length; i++) {  
            if(vehicleDivs[i] != vehicle) {
                vehicleDivs[i].style.height = '220px';
                buttonDivs[i].style.display = 'none';
                arrows[i].parentNode.style.transform = 'rotate(0deg)';
            };
        };
    })
    button.addEventListener('click', () => { 
        recordData(info.Numero,info.Equipo) 
        vehicle.classList.add('vehicleInfoActive');
    });
}

const createDivs = async () => {
    const response = await fetch('/apiClient/getCoordsRealTime')
    const fragment = document.createDocumentFragment();
    if (response.status == 200) {
        const vehicleContainer = document.getElementById('vehicleContainer');
        const info = await response.json();
        
        for (let i = 0; i < info.length; i++) {  
            const vehicle = buildBlock(info[i]);
            fragment.appendChild(vehicle);
            addListeners(vehicle,info[i]);
        };
        vehicleContainer.appendChild(fragment);
    };
};

const recordData = async (machine,id) => {
    const vehicleActive = document.querySelector('.vehicleInfoActive');
    if (vehicleActive) { vehicleActive.classList.remove('vehicleInfoActive')}
    let coords = [];
    let alarms = [];
    let iDate = document.getElementById('calendar1'+machine).value;
    let fDate = document.getElementById('calendar2'+machine).value;
    iDate = iDate.replace(/-/g,'/');
    fDate = fDate.replace(/-/g,'/');
    const response = await fetch(`/apiClient/getCoordsRecord?machine=${id}&idate=${iDate}&fdate=${fDate}`);
    if (response.status == 200) {
        const info = await response.json();
        for (marker in markers) {
            map.removeLayer(markers[marker]);
        };
        for (let i = 0; i < info.length; i++) {
            const coord = [info[i].Latitud,info[i].Longitud];
            const alarm_states = [info[i].Alarma_1,info[i].Alarma_2,info[i].Alarma_3,info[i].Alarma_4,info[i].Alarma_5,info[i].Alarma_6,info[i].Alarma_7,info[i].Alarma_8,info[i].Alarma_9,info[i].Alarma_10]
            if (coord[0] != 0 && coord[1] != 0) {
                coords.push(coord);
                alarms.push(alarm_states);
            }
        };
        setTimeout(() => {
            markers[0] = L.marker(coords[0],{
                title: "Coordenadas",
                draggable:false,
                icon: startendIcon
                }).addTo(map).bindPopup("<b>Punto incial</b>").openPopup();
            map.flyTo(coords[0], 15, {
                animate: true,
                duration: 1
            });
            for (let i = 1; i < coords.length; i++) {   
                const isFalse = (currentValue) => currentValue == false;
                if ( !alarms[i].every(isFalse) ){
                        let popupInfo = "";
                        for (j = 0; j < alarms[i].length; j++) {
                            if ( !isFalse(alarms[i][j]) ) {
                                const alarmNumber = j+1;
                                popupInfo += `Alarma <b>#${alarmNumber}</b> Activa <br>`
                            }
                        }
                        
                        markers[i] = L.marker(coords[i], {icon:recordIcon}).addTo(map).bindPopup(popupInfo);
                    
                    markers[i].on('mouseover', function (e) {
                        this.openPopup();
                    });
                    markers[i].on('mouseout', function (e) {
                        this.closePopup();
                    });
                }
            };
            markers[coords.length - 1] = L.marker(coords[coords.length-1], {
                title: "Coordenadas",
                draggable:false,
                icon: startendIcon
                }).addTo(map).bindPopup("<b>Punto final</b>");
            polyline.setLatLngs(coords);            
        }, 1000);
    };
};
createDivs();
