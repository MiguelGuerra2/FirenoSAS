// Filter machines from specific Client
const filter = (filterInput) => {
    const pageName = window.location.pathname.split('/').pop();
    // Get all machines
    let machines;
    if (pageName == 'realTime') {
        machines = document.querySelectorAll('.vehicleInfo');
    } else if (pageName == 'users' || pageName == 'machines' || pageName == 'clients') {
        machines = document.querySelectorAll('.divUsers');
    } else if (pageName == 'admin') {
        elements = document.querySelectorAll('.certificateContainer');
    } else {
        machines = document.querySelectorAll('.vehicleInfoRecord');
    };

    if ( !filterInput ) {
        machines.forEach(machine => {
            if (machine.id) {
                machine.style.display = 'block';
            };
        });
    } else {
        console.log(filterInput.value)
        if ( filterInput.value == '' ) {
            machines.forEach(machine => {
                if (machine.id) {
                    machine.style.display = 'block';
                };
            });
        }
        machines.forEach(machine => {
            if (machine.id) {        
                // Get attribute called data-client from machines        
                const checkData = machine.getAttribute('data-client');
                if ( checkData ) {
                    // If dataClient is equal to checkbox name, show machine.
                    if (checkData==filterInput.value) {
                        machine.style.display = 'block';
                    } else {
                        machine.style.display = 'none';
                    };
                } else {
                    if (machine.id==filterInput.value) {
                        machine.style.display = 'block';
                    } else {
                        machine.style.display = 'none';
                    };
                }
            };
        });
    };
};