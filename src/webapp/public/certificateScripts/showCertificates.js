// Create elements to make certificate div
const createElements = () => {
    let elements = {};
    elements.div1 = document.createElement("div");
    elements.div2 = document.createElement("div");
    elements.div3 = document.createElement("div");
    elements.div4 = document.createElement("div");
    elements.h4 = document.createElement("h4");
    elements.p1 = document.createElement("p");
    elements.p2 = document.createElement("p");
    elements.p3 = document.createElement("p");
    elements.p4 = document.createElement("p");
    elements.p5 = document.createElement("p");
    elements.p6 = document.createElement("p");
    elements.p7 = document.createElement("p");
    elements.p8 = document.createElement("p");
    elements.p9 = document.createElement("p");
    elements.p10 = document.createElement("p");
    elements.a1 = document.createElement("a");
    elements.a2 = document.createElement("a");
    elements.a3 = document.createElement("a");
    elements.img = document.createElement("img");
    return elements;
};

// Assign classes to elements
const assignClasses = (elements) => {
    elements.div1.classList.add('certificateContainer');
    elements.div2.classList.add('certificate');
    elements.div3.classList.add('ms-auto','d-flex');    
    elements.div4.classList.add('d-flex','col-12','position-relative');    
    elements.h4.classList.add('text-center','mx-auto','d-inline-block');
    elements.p1.classList.add('labelCertificate');
    elements.p2.classList.add('infoCertificate');
    elements.p3.classList.add('labelCertificate');
    elements.p4.classList.add('infoCertificate');
    elements.p5.classList.add('labelCertificate');
    elements.p6.classList.add('infoCertificate');
    elements.p7.classList.add('labelCertificate');
    elements.p8.classList.add('infoCertificate');
    elements.p9.classList.add('labelCertificate');
    elements.p10.classList.add('infoCertificate');
    elements.a1.classList.add('btn','btn-success','ms-auto','mt-3');
    elements.a2.classList.add('btn','btn-danger','mx-2','mt-3');
    elements.a3.classList.add('rounded-circle','position-absolute','me-3','updateLogoContainer');
    elements.img.classList.add('updateLogo');
    return elements;
};

// Get date of one month from today
const getOneMonth = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear() ;
    let date = currentDate.getDate();
    let month = currentDate.getMonth()+2;
    date < 10 ? date = '0'+ date : date = date;
    month < 10 ? month = '0'+ month : month = month;
    return `${year}/${month}/${date}`;
};

// Check if certificate is old
const checkOldCertificates = (info) => {
    // If certificate expires in less than one month return true
    const oneMonthDate = getOneMonth();
    const oneMonth = new Date(oneMonthDate);
    const valid_until = new Date(info.Valid_Until);
    if (valid_until <= oneMonth) {
        return true;
    } else {
        return false;
    };
};

// Add dinamic info to elements
const configElements = (elements,info) => {
    // Check if certificate is old
    const isOldCertificate = checkOldCertificates(info);
    
    // If certificate is old, assign diferent style
    if (isOldCertificate) {
        elements.div1.classList.add('oldCertificate','border','border-3','border-danger');
    };
    
    // Add data to elements
    elements.img.src = '../icons/settings.svg'
    elements.div1.id = info.Cc;
    elements.div1.dataset.client = info.Client;
    elements.h4.textContent = `Certificado # ${info.Id}`;
    elements.p1.textContent = `Nombre completo:`;
    elements.p2.textContent = info.Name + ' ' + info.Lastname;
    elements.p3.textContent = `Cedula de ciudadania:`;
    elements.p4.textContent = info.Cc;
    elements.p5.textContent = `Certificado creado el dia:`;
    formatDates(info.Created_At,elements.p6);
    elements.p7.textContent = `Certificado valido hasta:`;
    formatDates(info.Valid_Until,elements.p8);
    elements.p9.textContent = `Cliente:`;
    elements.p10.textContent = info.Client;
    
    elements.a1.innerHTML = 'Ver certificado';
    elements.a1.id = info.Cc;
    
    // Add event listener to open PDF files
    elements.a1.addEventListener('click',()=>{showPDF(info.Cc)});
    
    elements.a2.innerHTML = 'Eliminar certificado';
    elements.a2.dataset.bsToggle = 'modal';
    elements.a2.dataset.bsTarget = '#deleteModal'; 
    elements.a3.dataset.bsToggle = 'modal';
    elements.a3.dataset.bsTarget = '#updateModal'; 

    
    // Add event listener to delete certificates
    elements.a2.addEventListener('click',()=>{
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.href = `/apiCertificate/deleteCertificate?cc=${info.Cc}`;
    });
    // Add event listener to update certificates
    elements.a3.addEventListener('click',()=>{
        const idInput = document.getElementById('updateId');
        idInput.value = `${info.Cc}`;
    });
    return elements;
};

// Make certificate with elements created previously
const createCertificate = (info) => {
    let elements = createElements();
    elements = assignClasses(elements);
    elements = configElements(elements,info);

    elements['div2'].appendChild(elements['p1']);
    elements['div2'].appendChild(elements['p2']);
    elements['div2'].appendChild(elements['p3']);
    elements['div2'].appendChild(elements['p4']);
    elements['div2'].appendChild(elements['p5']);
    elements['div2'].appendChild(elements['p6']);
    elements['div2'].appendChild(elements['p7']);
    elements['div2'].appendChild(elements['p8']);
    elements['div2'].appendChild(elements['p9']);
    elements['div2'].appendChild(elements['p10']);
    elements['div3'].appendChild(elements['a1']);
    elements['div3'].appendChild(elements['a2']);
    elements['a3'].appendChild(elements['img']);
    elements['div4'].appendChild(elements['h4']);
    elements['div4'].appendChild(elements['a3']);
    elements['div1'].appendChild(elements['div4']);
    elements['div1'].appendChild(elements['div2']);
    elements['div1'].appendChild(elements['div3']);

    return elements['div1'];
};

// Get info from API and show certificates
const showCertificates = async () => {
    
    // Get div where will be certificates
    const infoContainer = document.getElementById('infoCertificateContainer');

    // Create a fragment to add it to DOM
    const fragment = document.createDocumentFragment();

    // Fetch to get info from API 
    const response = await fetch('/apiCertificate/getCertificates');
    if (response.status == 200){
        const certificates = await response.json();

        // Create every single certificate with info from API
        for (let i = 0; i < certificates.length; i++) {
            const certificate = createCertificate(certificates[i]);
            fragment.appendChild(certificate);
        };
        // Add fragment to DOM
        infoContainer.appendChild(fragment);
    }
};

//Execute function to show certificates
showCertificates();