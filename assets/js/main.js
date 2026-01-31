// Minimal JS for header interactions and future enhancements
document.addEventListener('DOMContentLoaded', function(){
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function(){
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }
  // Cookie banner logic
  try{
    var banner = document.getElementById('cookie-banner');
    var acceptBtn = document.getElementById('cookie-accept');
    var consent = localStorage.getItem('codenity_consent');
    if (banner) {
      if (consent !== 'accept') {
        banner.hidden = false;
      }
    }
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function(){
        localStorage.setItem('codenity_consent','accept');
        if (banner) banner.hidden = true;
        // Load GA if available
        if (window.codenityLoadGA) window.codenityLoadGA();
      });
    }
  }catch(e){console.warn('cookie banner error',e)}
});
