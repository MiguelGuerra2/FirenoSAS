const id = document.getElementById('id').value;
const actualName = document.getElementById('actualName');
const actualLastname = document.getElementById('actualLastname');
const actualCompany = document.getElementById('actualCompany');
const actualRol = document.getElementById('actualRol');

const getUser = async () => {
    const result = await fetch(`/api/getElement?id=${id}`);
    if (result.status == 200) {
        const info = await result.json();

        actualName.innerText = info[0].Nombre;
        actualLastname.innerText = info[0].Apellido;
        actualCompany.innerText = info[0].Compania;
        
        if (info[0].Rol == 1) {
            actualRol.innerText = 'Cliente';
        } else if (info[0].Rol == 2) {
            actualRol.innerText = 'Miembro de Fireno S.A.S';
        } else if (info[0].Rol == 3) {
            actualRol.innerText = 'Administrador';
        };
    };
};
getUser();