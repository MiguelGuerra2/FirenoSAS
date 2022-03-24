
// Search certificates by CC (DNI) 
const search = (searchInput) => {
    const pageName = window.location.pathname.split('/').pop();
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
                } else {
                    element.style.display = 'none';
                };
            };
        });
    };
};