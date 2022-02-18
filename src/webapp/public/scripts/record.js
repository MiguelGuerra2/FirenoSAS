const infoColumn = document.getElementById('infoColumn');
const fragment = document.createDocumentFragment();
const polyline = L.polyline([["0", "0"]], {color: "black"}).addTo(map);
let markers = {};

const recordIcon = new L.Icon({
    iconUrl: "/images/circle.png",
    iconSize: [8, 8]
});
const startendIcon = new L.Icon({
    iconUrl: "/images/circle2.png",
    iconSize: [12, 12]
});

const createDivs = async () => {
    const response = await fetch('http://localhost:3000/apiClient/getCoordsRealTime')
    if (response.status == 200) {
        const info = await response.json();
        for (let i = 0; i < info.length; i++) {
            const div = document.createElement("div");
            div.className += "infoContainer";
            const numero = document.createElement("p");
            const referencia = document.createElement("p");
            const marca = document.createElement("p");
            const fecha1 = document.createElement("input");
            const fecha2 = document.createElement("input");
            const button = document.createElement("button");

            fecha1.type = 'datetime-local';
            fecha2.type = 'datetime-local';
            fecha1.name = 'iDate'+info[i].Equipo;
            fecha2.name = 'fDate'+info[i].Equipo;
            fecha1.id = 'iDate'+info[i].Equipo;
            fecha2.id = 'fDate'+info[i].Equipo;

            button.textContent = `Realizar consulta`;
            button.addEventListener('click',()=>recordData(info[i].Equipo));
            numero.textContent = `Numero del Equipo: ${info[i].Numero}`
            referencia.textContent = `Referencia : ${info[i].Referencia}`
            marca.textContent = `Marca: ${info[i].Marca}`;

            div.appendChild(numero);
            div.appendChild(referencia);
            div.appendChild(marca);
            div.appendChild(fecha1);
            div.appendChild(fecha2);
            div.appendChild(button);
            fragment.appendChild(div);
        };
        infoColumn.appendChild(fragment);
    };
};
const recordData = async (machine) => {
    let coords = [];
    let iDate = document.getElementById('iDate'+machine).value;
    let fDate = document.getElementById('fDate'+machine).value;
    iDate = iDate.replace('T','+');
    iDate = iDate.replace(/-/g,'/');
    fDate = fDate.replace('T','+');
    fDate = fDate.replace(/-/g,'/');
    const response = await fetch(`http://localhost:3000/apiClient/getCoordsRecord?machine=${machine}&idate=${iDate}&fdate=${fDate}`);
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
        polyline.setLatLngs(coords);
    };
};
createDivs();