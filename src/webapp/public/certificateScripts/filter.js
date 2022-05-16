// Get container with all certificates information
const infoContainer = document.getElementById('infoCertificateContainer');

// Get all certificates
const certificates = infoContainer.childNodes;

// Filter certificates from specific Client
const filter = (optionSelected) => {
    if (optionSelected == '') {
        certificates.forEach(certificate => {
            if (certificate.id) {
                certificate.style.display = 'block';
            };
        });
    } else {
        certificates.forEach(certificate => {
            if (certificate.id) {        
                // Get attribute called data-client from certificates        
                const checkData = certificate.getAttribute('data-client');
                // If dataClient is equal to checkbox name, show certificate.
                if (checkData==optionSelected) {
                    certificate.style.display = 'block';
                } else {
                    certificate.style.display = 'none';
                };
            };
        });
    };
};