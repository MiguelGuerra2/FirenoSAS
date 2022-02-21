const validateInput = (input) => {
    if (input.checkValidity()) {
        if(input.classList.contains('is-invalid')){
            input.classList.remove('is-invalid')
        };
        return input.classList.add('is-valid')
    } else {
        if(input.classList.contains('is-valid')){
            input.classList.remove('is-valid')
        };
        return input.classList.add('is-invalid')
    };
};
    