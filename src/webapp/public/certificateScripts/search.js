// Search certificates by CC (DNI) 
const search = (searchInput) => {
    const filterInput = document.getElementById('filterInput');
    const searchData = searchInput.value;

    filter(filterInput.value);
    
    if (searchData != '') {
        certificates.forEach(certificate => {
            if (certificate.id) {                
                if (certificate.style.display == 'block') {
                    // Check if certificate id starts with text on input type search
                    if (certificate.id.startsWith(searchData)) {
                        certificate.style.display = 'block';
                    } else {
                        certificate.style.display = 'none';
                    };
                };
            };
        });
    };
};