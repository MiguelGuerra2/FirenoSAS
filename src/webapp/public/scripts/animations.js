
const createObserver = (observerName,selector,transitionClass) => {
    observers[observerName] = new IntersectionObserver(entries => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) {
                entry.target.classList.add(transitionClass);
            } else {
                entry.target.classList.remove(transitionClass);
                entry.target.classList.add(selector);
            };
        });
    });
};
const initObserver = (selectorType,selector,transitionClass) => {
    const observerName = selector+'Observer';
    let elementList;
    if (selectorType == 'class'){
        elementList = document.getElementsByClassName(selector);
        createObserver(observerName,selector,transitionClass);
        for (let i=0; i<elementList.length; i++){
            observers[observerName].observe(elementList[i]);
        };
    } else {
        elementList = document.getElementById(selector);
        if(elementList) {
            createObserver(observerName,selector,transitionClass);
            observers[observerName].observe(elementList);    
        }
    }
};

let observers = {};
initObserver('class','transparent','appear');
initObserver('class','infoFlexContainer','saturate');
initObserver('id','firstDiv','slide-right');
initObserver('id','secondDiv','slide-left');
