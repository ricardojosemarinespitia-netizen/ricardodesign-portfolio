/* paginas.js — páginas internas de ricardodesign.co (oct 2026).
   Menú (panel del home), progreso de lectura en el filete del nav, nav que se
   esconde al bajar, e índice activo en documentos largos. Un solo rAF por
   scroll. Sin dependencias. Sin JS todo se lee completo. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Panel de menú ---------- */
  var btn = d.querySelector('.nav__menu'), panel = d.getElementById('panel');
  if (btn && panel) {
    var foco = function () { return Array.prototype.slice.call(panel.querySelectorAll('a, button')); };
    var cerrar = function (volver) {
      panel.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); d.body.classList.remove('menu-abierto');
      if (volver) btn.focus();
    };
    btn.addEventListener('click', function () {
      panel.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); d.body.classList.add('menu-abierto');
      setTimeout(function () { var f = panel.querySelector('ul a'); if (f) f.focus(); }, reduce ? 0 : 120);
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('[data-cerrar]')) cerrar(true); else if (e.target.closest('a')) cerrar(false);
    });
    d.addEventListener('keydown', function (e) {
      if (!panel.classList.contains('abierto')) return;
      if (e.key === 'Escape') { e.preventDefault(); cerrar(true); }
      if (e.key === 'Tab') {
        var f = foco(), i = f.indexOf(d.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- Índice del documento ---------- */
  var indice = d.querySelector('.doc-indice'), enlaces = [], secciones = [];
  if (indice) {
    var det = indice.querySelector('details');
    /* Cerrado en el HTML (móvil sin salto de diseño); en escritorio se abre en la columna lateral. */
    var ajustar = function () { if (det && innerWidth > 960) det.open = true; };
    ajustar();
    indice.querySelector('summary').addEventListener('click', function (e) { if (innerWidth > 960) e.preventDefault(); });
    enlaces = Array.prototype.slice.call(indice.querySelectorAll('a[href^="#"]'));
    secciones = enlaces.map(function (a) { return d.getElementById(a.getAttribute('href').slice(1)); });
    indice.addEventListener('click', function (e) { if (e.target.closest('a') && innerWidth <= 960 && det) det.open = false; });
  }

  /* ---------- Scroll: progreso, nav, sección activa (un rAF) ---------- */
  var nav = d.querySelector('.nav'), prog = d.querySelector('.progreso'), ultimo = 0, pend = false, activa = -1;
  var tick = function () {
    pend = false;
    var y = scrollY, alto = html.scrollHeight - innerHeight;
    if (prog) prog.style.setProperty('--p', alto > 0 ? Math.min(1, y / alto).toFixed(4) : 0);
    if (nav && !(panel && panel.classList.contains('abierto'))) nav.classList.toggle('oculta', y > 240 && y > ultimo + 2 && !d.activeElement.closest('.nav'));
    if (y < ultimo - 2 && nav) nav.classList.remove('oculta');
    ultimo = y;
    if (secciones.length) {
      var lim = innerHeight * 0.3, k = 0;
      for (var i = 0; i < secciones.length; i++) { if (secciones[i] && secciones[i].getBoundingClientRect().top <= lim) k = i; }
      if (y + innerHeight >= html.scrollHeight - 4) k = secciones.length - 1;
      if (k !== activa) { if (activa > -1) enlaces[activa].removeAttribute('aria-current'); enlaces[k].setAttribute('aria-current', 'true'); activa = k; }
    }
  };
  addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(tick); } }, { passive: true });
  tick();
  if (nav) nav.addEventListener('focusin', function () { nav.classList.remove('oculta'); });
})();
