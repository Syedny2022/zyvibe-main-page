(function () {
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  window.zyTrack = track;

  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    if (link.getAttribute('data-nav') === path) link.setAttribute('aria-current', 'page');
  });

  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.querySelector('.sr-only').textContent = open ? 'Open menu' : 'Close menu';
      menu.hidden = open;
    });
  }

  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      track('cta_click', { location: el.getAttribute('data-cta') });
    });
  });

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
