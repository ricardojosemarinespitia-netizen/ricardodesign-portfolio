/* splash.js — se carga SIN defer en el <head> del home para decidir, antes del
   primer pintado, si se muestra el splash (evita parpadeo; CSP sin inline).
   Cuándo: primera visita de la sesión (sessionStorage 'rd_splash').
   Forzar: añade ?splash=1 a la URL. Nunca con prefers-reduced-motion ni con
   "Pausar animaciones" activado. Sin JS no hay splash. */
(function () {
  try {
    var forzar = /[?&]splash=1(&|$)/.test(location.search);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pausa = false; try { pausa = localStorage.getItem('rd_pausa') === '1'; } catch (e) {}
    var visto = false; try { visto = sessionStorage.getItem('rd_splash') === '1'; } catch (e) {}
    // Navegadores integrados de Instagram/Facebook: sin splash (capa fija + scroll bloqueado
    // dan problemas ahí) salvo que se fuerce con ?splash=1.
    var integrado = /Instagram|FBAN|FBAV|FB_IAB|FBIOS/i.test(navigator.userAgent || '');
    if (reduce || pausa || (integrado && !forzar) || (visto && !forzar)) return;
    try { sessionStorage.setItem('rd_splash', '1'); } catch (e) {}
    var h = document.documentElement;
    h.classList.add('splash');
    // Red de seguridad independiente de app.js: si app.js no carga o falla en este
    // navegador, el splash NO puede dejar la página tapada, sin scroll ni portada.
    setTimeout(function () {
      if (!h.classList.contains('splash')) return;
      h.classList.remove('splash'); h.classList.add('splash-fin');
      var c = document.querySelector('.splash-capa');
      if (c && c.parentNode) c.parentNode.removeChild(c);
    }, 4200);
  } catch (e) {}
})();
