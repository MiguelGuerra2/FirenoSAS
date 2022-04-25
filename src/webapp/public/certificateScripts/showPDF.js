// Show PDF file with specific name
const showPDF = (cc) => {
    // Path to file
    const direction = `./../certificates/${cc}.pdf`;
    // Open file in new tab and fullscreen
    window.open(direction, '_blank', 'fullscreen=yes'); 
};

