const machinesColumn = document.getElementById('machinesColumn');
const fragment = document.createDocumentFragment();

const getUsers = async () => {
    const response = await fetch('http://localhost:3000/apiAdmin/getElements?q=2');
    if (response.status == 200){
        const machinesData = await response.json();
        for (let i = 0; i < machinesData.length; i++) {

            const div = document.createElement("div");
            div.className += "machineContainer";

            const number = document.createElement("p");
            const reference = document.createElement("p");
            const trademark = document.createElement("p");
            const link = document.createElement("a");

            number.textContent = `Numero: ${machinesData[i].Numero}`;
            reference.textContent = `Referencia : ${machinesData[i].Referencia}`;
            trademark.textContent = `Marca : ${machinesData[i].Marca}`;
            link.innerHTML = 'Modificar';
            link.href = `updateMachine?id=${machinesData[i].Id}`;

            div.appendChild(number);
            div.appendChild(reference);
            div.appendChild(trademark);
            div.appendChild(link);
            fragment.appendChild(div);
        }
        machinesColumn.appendChild(fragment);
    }   
}
getUsers();