(function () {
  'use strict';

  const C = window.LG.components;

  window.LG.mount('#app', [
    C.TopBar,
    () => C.Header({ current: 'seguimiento.html', isHome: false }),
    C.TrackingHero,
    C.TrackingMainSearch,
    C.TrackingFullFAQ,
    () => C.Footer({ isHome: false }),
    () => C.FloatingWidgets({ isHome: false })
  ]);
})();
