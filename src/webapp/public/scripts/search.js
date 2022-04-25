
// Search certificates by CC (DNI) 
const search = (searchInput) => {
    const pageName = window.location.pathname.split('/').pop();
    let noResultsDiv = document.getElementById('noResults');
    let machinesFound = 0;
    // Get all machines
    let machines;
    if (pageName == 'realTime') {
        machines = document.querySelectorAll('.vehicleInfo');
    } else {
        machines = document.querySelectorAll('.vehicleInfoRecord');
    };
    // Apply filter if exist
    filter();
    // Get value of input type search
    const searchData = searchInput.value;
    // Apply search if input isn't empty
    if (searchData != '') {
        machines.forEach(element => {
            if (element.id) { 
                // Check if certificate id starts with text on input type search
                if (element.id.startsWith(searchData)) {
                    element.style.display = 'block';
                    machinesFound++
                } else {
                    element.style.display = 'none';
                };
            };
        });
        if (machinesFound == 0) {
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