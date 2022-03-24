const infoColumn = document.getElementById('infoColumn');
const fragment = document.createDocumentFragment();
const polyline = L.polyline([["0", "0"]], {color: "black"}).addTo(map);
let firstLoop = true;
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
    elements.divCalendar1 = document.createElement('div')
    elements.divCalendar2 = document.createElement('div')
    elements.divButton = document.createElement('div')
    elements.divArrow = document.createElement('div')

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

    elements.button = document.createElement('button');
    return elements;
};

const assignClasses = (elements) => {
    elements.div.classList.add('vehicleInfoRecord');
    elements.divCalendar1.classList.add('form-floating','mb-2','form-control','position-relative','p-0')
    elements.divCalendar2.classList.add('form-floating','mb-2','form-control','position-relative','p-0')
    elements.divButton.classList.add('container','flex-column','col-12','vehicleButtonRecord');
    elements.divArrow.classList.add('d-flex');

    elements.p1.classList.add('textLabel');
    elements.p2.classList.add('textInfo');
    elements.p3.classList.add('textLabel');
    elements.p4.classList.add('textInfo');
    elements.p5.classList.add('textLabel');
    elements.p6.classList.add('textInfo');
    elements.p7.classList.add('textLabel');
    elements.p8.classList.add('textInfo');

    elements.arrow.classList.add('arrowDown','mx-auto');
    
    elements.label1.classList.add('mt-3');
    elements.calendar1.classList.add('col-12','mx-0','border-0','p-2','rounded','rounded-3');
    elements.calendar2.classList.add('col-12','mx-0','border-0','p-2','rounded','rounded-3');
    elements.button.classList.add('btn','btn-dark','mx-auto','mt-2');
    return elements;
}

const configElements = (elements,info) => {
    elements.div.id = info.Numero;
    elements.p1.textContent = 'Numero del equipo:';
    elements.p2.textContent = info.Numero;
    elements.p3.textContent = 'Marca:';
    elements.p4.textContent = info.Marca;
    elements.p5.textContent = 'Referencia:';
    elements.p6.textContent = info.Referencia;
    elements.p7.textContent = 'Empresa:';
    elements.p8.textContent = info.Empresa;
    elements.button.textContent = 'Ver ubicacion';
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
    elements.divCalendar1.appendChild(elements.calendar1);
    elements.divCalendar2.appendChild(elements.calendar2);
    elements.divButton.appendChild(elements.label1);
    elements.divButton.appendChild(elements.divCalendar1);
    elements.divButton.appendChild(elements.label2);
    elements.divButton.appendChild(elements.divCalendar2);
    elements.divButton.appendChild(elements.button);
    elements.divArrow.appendChild(elements.arrow);

    elements.div.appendChild(elements.p1);
    elements.div.appendChild(elements.p2);
    elements.div.appendChild(elements.p3);
    elements.div.appendChild(elements.p4);
    elements.div.appendChild(elements.p5);
    elements.div.appendChild(elements.p6);
    elements.div.appendChild(elements.p7);
    elements.div.appendChild(elements.p8);
    elements.div.appendChild(elements.divButton);
    elements.div.appendChild(elements.divArrow);    

    return elements.div;
};

const addListeners = (vehicle,info) => {
    const vehicleArrow = vehicle.lastElementChild;
    const buttonDiv = vehicle.children[8];
    const button = buttonDiv.lastElementChild;
    vehicleArrow.addEventListener('click',()=> {
        const vehicle = document.getElementById(info.Numero);
        const buttonDivs = document.querySelectorAll('.vehicleButtonRecord');
        const vehicleDivs = document.querySelectorAll('.vehicleInfoRecord');
        const arrows = document.querySelectorAll('.arrowDown');
        if (vehicle.style.height == '412px') {
            vehicle.style.height = '190px';
            buttonDiv.style.display = 'none';
            vehicleArrow.style.transform = 'rotate(0deg)';
        } else {
            for (let i = 0; i < buttonDivs.length; i++) {                
                vehicleDivs[i].style.height = '190px';
                buttonDivs[i].style.display = 'none';
                arrows[i].style.transform = 'rotate(0deg)';
            };
            vehicle.style.height = '412px';
            buttonDiv.style.display = 'flex';
            vehicleArrow.style.transform = 'rotate(180deg)';
            vehicle.scrollIntoView({
                behavior: 'smooth'
            });
        }
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
            coords.push(coord);
            if (i == 0) {
                markers[i] = L.marker(coords[0],{
                    title: "Coordenadas",
                    draggable:false,
                    icon: startendIcon
                    }).addTo(map);
                map.flyTo(coords[0], 12, {
                    animate: true,
                    duration: 1
                });
            } else if (i == info.length-1){
                markers[i] = L.marker(coords[coords.length-1], {
                    title: "Coordenadas",
                    draggable:false,
                    icon: startendIcon
                    }).addTo(map);
            } else {
                markers[i] = L.marker(coord, {icon:recordIcon}).addTo(map);
            };
        };
        if (firstLoop == true) {
            setTimeout(() => {
                polyline.setLatLngs(coords);            
            }, 1000);
            firstLoop = false;
        } else {
            polyline.setLatLngs(coords);            
        }
    };
};
createDivs();