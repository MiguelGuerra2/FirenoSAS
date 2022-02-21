const logoContainer = document.getElementById('header');
let lastScrollTop = 0;
window.addEventListener("scroll", () => { 
   let st = window.pageYOffset || document.documentElement.scrollTop;
   if (st > lastScrollTop){
        logoContainer.style.transform = 'translateY(-50px)';
   } else {
    logoContainer.style.transform = 'translateY(0px)';
   };
   lastScrollTop = st <= 0 ? 0 : st; 
}, false);