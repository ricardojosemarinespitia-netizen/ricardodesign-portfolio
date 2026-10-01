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
    if (reduce || pausa || (visto && !forzar)) return;
    try { sessionStorage.setItem('rd_splash', '1'); } catch (e) {}
    document.documentElement.classList.add('splash');
  } catch (e) {}
})();
