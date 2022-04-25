// Search certificates by CC (DNI) 
const search = (searchInput) => {
    // Apply filter if exist
    filter();
    // Get value of input type search
    const searchData = searchInput.value;
    
    // Apply search if input isn't empty
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