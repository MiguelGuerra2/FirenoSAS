
// Search certificates by CC (DNI) 
const search = (searchInput) => {
    const pageName = window.location.pathname.split('/').pop();
    let noResultsDiv = document.getElementById('noResults');
    let elementsFound = 0;
    // Get all elements
    let elements;
    if (pageName == 'realTime') {
        elements = document.querySelectorAll('.vehicleInfo');
    } else if (pageName == 'users' || pageName == 'machines') {
        elements = document.querySelectorAll('.divUsers');
    } else {
        elements = document.querySelectorAll('.vehicleInfoRecord');
    };
    // Apply filter if exist
    filter();
    
    // Get value of input type search
    const searchData = searchInput.value.toString().toLowerCase();
    // Apply search if input isn't empty
    if (searchData != '') {
        elements.forEach(element => {
            if (element.id) { 
                // Check if certificate id starts with text on input type search
                if (element.id.startsWith(searchData)) {
                    element.style.display = 'block';
                    elementsFound++
                } else {
                    element.style.display = 'none';
                };
            };
        });
        if (elementsFound == 0) {
            noResultsDiv.classList.remove('d-none');
            noResultsDiv.classList.add('d-block');
        } else {
            noResultsDiv.classList.remove('d-block');
            noResultsDiv.classList.add('d-none');
        };
    } else {
        noResultsDiv.classList.remove('d-block');
        noResultsDiv.classList.add('d-none');
    };
};