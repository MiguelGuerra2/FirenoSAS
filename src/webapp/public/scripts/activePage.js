const getElement = (url) => {
    const pageName = url.split('/').pop();
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
element.classList.add('active-link');
