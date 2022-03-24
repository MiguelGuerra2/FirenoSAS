// This function is used to custom inputs type:date
// Depending the navigator we show icon or not.

// Get input fields
let inputDate1 = document.getElementById('created_at');
let inputDate2 = document.getElementById('valid_until');

// Get current navigator
const userAgent = navigator.userAgent;

// If navigator is Google Chrome, show icon
if (userAgent.match(/chrome|chromium|crios/i)){
    
    inputDate1.classList.add('chromeInput');
    inputDate2.classList.add('chromeInput');

// If navigator is Mozilla Firefox, don't show icon
} else if (userAgent.match(/firefox|fxios/i)){

    inputDate1.classList.add('mozillaInput');
    inputDate2.classList.add('mozillaInput');

};