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

// Filter machines from specific Client
const filter = (checkbox) => {
    const pageName = window.location.pathname.split('/').pop();
    // Get all machines
    let machines;
    if (pageName == 'realTime') {
        machines = document.querySelectorAll('.vehicleInfo');
    } else if (pageName == 'users' || pageName == 'machines') {
        machines = document.querySelectorAll('.divUsers');
    }  else {
        machines = document.querySelectorAll('.vehicleInfoRecord');
    };
    // If checkbox is defined, uncheck the others
    if (checkbox != undefined) { 
        unCheck(checkbox.id);
    };
    // Get which checkbox is checked
    const checkBox = getCheck();

    // If checkbox doesn't exist or is unchecked, don't apply filter (Show All machines) 
    if (checkBox == undefined || checkBox.checked == false) {
        machines.forEach(machine => {
            if (machine.id) {
                machine.style.display = 'block';
            };
        });
    // If checkbox exist and is checked, apply filter depending Client.
    }else {
        machines.forEach(machine => {
            if (machine.id) {        
                // Get attribute called data-client from machines        
                const checkData = machine.getAttribute('data-client');
                // If dataClient is equal to checkbox name, show machine.
                if (checkData==checkBox.name) {
                    machine.style.display = 'block';
                } else {
                    machine.style.display = 'none';
                };
            };
        });
    };
};