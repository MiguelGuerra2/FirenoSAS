// Validate if input content is correct
const validateInput = (input) => {
    if (input.checkValidity()) {        
        
        if(input.classList.contains('is-invalid')){
            input.classList.remove('is-invalid');
        };

        // If input content is valid add "is-valid" class.
        return input.classList.add('is-valid');
    } else {
        
        if(input.classList.contains('is-valid')){
            input.classList.remove('is-valid');
        };

        // If input content is valid add "is-invalid" class.
        return input.classList.add('is-invalid');
    };
};
    