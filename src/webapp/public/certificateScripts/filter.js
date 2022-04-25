// Get container with all certificates information
const infoContainer = document.getElementById('infoCertificateContainer');

// Get all certificates
const certificates = infoContainer.childNodes;

// Keep only one checkbox checked. 
// "checkId" is id from last checkbox checked.
const unCheck = (checkId) => {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input.form-check-input');
    // Uncheck all diferents checkboxes
    checkboxes.forEach(checkbox => {
        if (checkbox.id != checkId) {
            checkbox.checked = false;
        };
    });
};

// Get which checkbox is checked to can apply filter
const getCheck = () => {
    const checkboxes = document.querySelectorAll('input.form-check-input');
    let checkId;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked == true) {
            checkId = checkbox; 
        };
    });
    return checkId;
};

// Filter certificates from specific Client
const filter = (checkbox) => {
    // If checkbox is defined, uncheck the others
    if (checkbox != undefined) { 
        unCheck(checkbox.id);
    };
    // Get which checkbox is checked
    const checkBox = getCheck();

    // If checkbox doesn't exist or is unchecked, don't apply filter (Show All certificates) 
    if (checkBox == undefined || checkBox.checked == false) {
        certificates.forEach(certificate => {
            if (certificate.id) {
                certificate.style.display = 'block';
            };
        });
    // If checkbox exist and is checked, apply filter depending Client.
    }else {
        certificates.forEach(certificate => {
            if (certificate.id) {        
                // Get attribute called data-client from certificates        
                const checkData = certificate.getAttribute('data-client');
                // If dataClient is equal to checkbox name, show certificate.
                if (checkData==checkBox.name) {
                    certificate.style.display = 'block';
                } else {
                    certificate.style.display = 'none';
                };
            };
        });
    };
};