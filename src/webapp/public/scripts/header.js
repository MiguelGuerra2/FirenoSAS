const logoContainer = document.getElementById('header');
const actualPage = window.location.pathname;
let lastScrollTop = 0;

window.addEventListener("scroll", () => { 
   // Calculate distance scrolled from top
   let st = window.pageYOffset || document.documentElement.scrollTop;
   if (st > lastScrollTop){
      // Scroll down: Header hidden
      logoContainer.style.transform = 'translateY(-60px)';
   } else {
      // Scroll up: Header apear
      logoContainer.style.transform = 'translateY(0px)';
   };
   // To movil
   lastScrollTop = st <= 0 ? 0 : st; 
}, false);

