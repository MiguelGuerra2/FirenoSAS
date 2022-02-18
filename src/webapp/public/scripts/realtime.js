const infoColumn = document.getElementById('infoColumn');
const viewAll = document.getElementById('viewAll');
const fragment = document.createDocumentFragment();

let firstTime = false;
let markers = {};
let divs = {};
let markersName = 'marcador';
let divsName = 'div';

const addAllMarkers = () => {
    for (marker in markers){
        markers[marker].addTo(map);
    };
};

const removeMarkers = (Marker1) => {
    for (marker in markers) {
        map.removeLayer(markers[marker]);
    };
    Marker1.addTo(map);
}

const updateData = async () => {
    const response = await fetch('http://localhost:3000/apiClient/getCoordsRealTime')
    if (response.status == 200) {
        const info = await response.json();
        if (firstTime == false) { 
            for (let i = 0; i < info.length; i++) {
                
                const id = document.createElement("p");
                const referencia = document.createElement("p");
                const marca = document.createElement("p");
                const problema = document.createElement("p");
                const alerta = document.createElement("p");

                divs[divsName+i] = document.createElement("div");
                divs[divsName+i].className += "infoContainer";

                id.textContent = `Id del Equipo: ${info[i].Equipo}`
                referencia.textContent = `Referencia : ${info[i].Referencia}`
                marca.textContent = `Marca: ${info[i].Marca}`;
                info[i].Problema == 1 ? (problema.textContent = `Problema: Con problemas`,problema.style.color='red'): problema.textContent = `Problema: Sin problemas`;
                info[i].Alarma == 1 ? (problema.textContent = `Alarma: Con Alarma`,problema.style.color='red') : alerta.textContent = `Alarma: Sin alarma`;
                
                divs[divsName+i].appendChild(referencia);
                divs[divsName+i].appendChild(marca);
                divs[divsName+i].appendChild(problema);
                divs[divsName+i].appendChild(alerta);
                divs[divsName+i].addEventListener('click',()=>removeMarkers(markers[markersName+i]));
                fragment.appendChild(divs[divsName+i]);  
                
                markers[markersName+i] = L.marker([info[i].Latitud,info[i].Longitud], {
                    title: "Coordenadas",
                    draggable:false
                    }).addTo(map);
            };
            infoColumn.appendChild(fragment);
            firstTime = true;
        } else {
            for (let i = 0; i < info.length; i++) {
                markers[markersName+i].setLatLng([info[i].Latitud,info[i].Longitud]);
            };
        };
            
    };
};

viewAll.addEventListener('click',addAllMarkers);
updateData();
setInterval(updateData,5000);