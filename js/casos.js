/* Casos v2 · flechas y teclado de la pista, recorrido de pantallas solo en vista, inclinación 3D con brillo.
   Sin bucle propio continuo: la inclinación se pinta en un rAF puntual por movimiento del puntero. */
(function () {
  var sec = document.getElementById('casos');
  if (!sec) return;
  var html = document.documentElement;
  var pista = sec.querySelector('.casos__pista');
  var ua = navigator.userAgent || '';
  var webview = /Instagram|FBAN|FBAV|FB_IAB/i.test(ua);
  var estatico = /[?&]estatico\b/.test(location.search);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (webview || estatico) html.classList.add('casos-quieto');
  else html.classList.add('casos-anima');

  /* desfase del recorrido por tarjeta */
  [].forEach.call(pista.children, function (li, i) { li.style.setProperty('--i', i); });

  /* recorrido solo con la tarjeta en pantalla */
  if ('IntersectionObserver' in window && !webview && !estatico) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('vivo', e.isIntersecting); });
    }, { root: null, threshold: 0.35 });
    [].forEach.call(pista.querySelectorAll('.caso--web, .caso--meta'), function (li) { io.observe(li); });
  } else {
    [].forEach.call(pista.querySelectorAll('.caso--meta'), function (li) { li.classList.add('vivo'); });
  }

  /* flechas */
  var ant = sec.querySelector('.casos__btn--ant'), sig = sec.querySelector('.casos__btn--sig');
  function paso() { var c = pista.children[0]; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(pista).columnGap || 0) : 300; }
  function estado() {
    var max = pista.scrollWidth - pista.clientWidth - 2;
    if (ant) ant.disabled = pista.scrollLeft <= 2;
    if (sig) sig.disabled = pista.scrollLeft >= max;
  }
  function mover(dir) { pista.scrollBy({ left: dir * paso(), behavior: reduce ? 'auto' : 'smooth' }); }
  if (ant) ant.addEventListener('click', function () { mover(-1); });
  if (sig) sig.addEventListener('click', function () { mover(1); });
  pista.addEventListener('scroll', function () { requestAnimationFrame(estado); }, { passive: true });
  addEventListener('resize', estado, { passive: true });
  estado();
  pista.addEventListener('keydown', function (e) {
    if (e.target !== pista) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
  });

  /* inclinación 3D suave + brillo especular (solo puntero fino, sin reducido ni WebView) */
  if (!fino || reduce || webview || estatico) return;
  [].forEach.call(pista.querySelectorAll('.caso>a'), function (a) {
    var esc = a.querySelector('.caso__escena'); if (!esc) return;
    var pend = null, caja = null;
    function pinta() {
      var p = pend; pend = null; if (!p || !caja) return;
      var x = (p.x - caja.left) / caja.width, y = (p.y - caja.top) / caja.height;
      x = Math.max(0, Math.min(1, x)); y = Math.max(0, Math.min(1, y));
      esc.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg');
      esc.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
      esc.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      esc.style.setProperty('--px', (x - 0.5).toFixed(3));
      esc.style.setProperty('--py', (y - 0.5).toFixed(3));
      esc.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    }
    a.addEventListener('pointerenter', function () { caja = esc.getBoundingClientRect(); esc.classList.add('sigue'); });
    a.addEventListener('pointermove', function (e) {
      if (!pend) requestAnimationFrame(pinta);
      pend = { x: e.clientX, y: e.clientY };
    });
    a.addEventListener('pointerleave', function () {
      pend = null; esc.classList.remove('sigue');
      esc.style.setProperty('--rx', '0deg'); esc.style.setProperty('--ry', '0deg');
      esc.style.setProperty('--px', '0'); esc.style.setProperty('--py', '0');
    });
  });
})();
