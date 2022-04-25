const getElement = (url) => {
    let pageName = url.split('/');
    pageName[1] == 'auth' || pageName[1] == 'tools' ? pageName = pageName[2] : pageName = pageName[1]; 
    if (pageName == '') {
        const element = document.getElementById('home');
        return element;
    } else {
        const element = document.getElementById(pageName);
        return element;
    };
};

const link = window.location.pathname;
const element = getElement(link);
if (element) {
    element.classList.add('active-link');
};

