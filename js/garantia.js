/* Garantía v2 (#garantia): pliego en dos tiempos + íconos 3D que giran sobre su eje.
   Coreografía por scroll (scrub): 1) entra el papel (fondo fijo + rd), sin texto;
   2) el texto entra por grupos: kicker y su hilo, titular por líneas (máscara), lede, filete de las cláusulas que se dibuja,
      folios 01-04 con su objeto, "Campañas rentables." y letra chica.
   Íconos: hoja de giro 6x4 (24 cuadros, 360°) de assets/web/garantia3d/<nombre>-gira.(avif|webp), cargada al acercarse;
   gira por CSS (steps) y se pausa fuera de pantalla. Reducido, ?estatico, WebView de Instagram/Facebook y ahorro de datos:
   cuadro fijo (<nombre>[-320].avif|webp), sin animación. Si el archivo no existe, queda el SVG. Texto siempre en el DOM. */
(function () {
  var sec = document.getElementById('garantia');
  if (!sec) return;
  var root = document.documentElement;
  var quieto = root.classList.contains('quieto'), wv = root.classList.contains('webview');
  var ahorro = !!(navigator.connection && navigator.connection.saveData);
  function Q(s, e) { return [].slice.call((e || sec).querySelectorAll(s)); }
  function abs(el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }

  /* ---------- íconos 3D ---------- */
  var DIR = 'assets/web/garantia3d/', VUELTA = 8;             /* segundos por vuelta */
  var fijo = quieto || wv || ahorro;
  var hi = (window.devicePixelRatio || 1) > 1.4;
  var icos = Q('.g3d');
  var activos = !!sec.querySelector('[data-g3d-on]');           /* se enciende cuando los assets 3D están publicados (evita 404) */
  function probar(urls, ok, i) {
    i = i || 0; if (i >= urls.length) return;
    var im = new Image(); im.decoding = 'async';
    im.onload = function () { ok(urls[i]); };
    im.onerror = function () { probar(urls, ok, i + 1); };
    im.src = urls[i];
  }
  function cargar(g, k) {
    if (g._c) return; g._c = 1;
    var n = g.getAttribute('data-g3d'), capa = document.createElement('i');
    capa.className = 'g3d__giro'; g.insertBefore(capa, g.firstChild);
    var cA = document.createElement('i'); cA.className = 'g3d__c'; capa.appendChild(cA);
    var base = DIR + n + (fijo ? (hi ? '-320' : '') : '-gira');
    probar([base + '.avif', base + '.webp'], function (u) {
      cA.style.backgroundImage = 'url(' + u + ')';
      if (fijo) g.classList.add('g3d--fijo');
      else {
        g.style.setProperty('--g3d-t', VUELTA + 's');
        g.style.setProperty('--g3d-t4', VUELTA / 4 + 's');
        g.style.setProperty('--g3d-f', (VUELTA / 24).toFixed(4) + 's');   /* un cuadro */
        var cB = cA.cloneNode(); capa.appendChild(cB);
        g.style.setProperty('--g3d-d', (-k * VUELTA * 0.27).toFixed(2) + 's');   /* desfasados entre sí */
        g.classList.add('g3d--gira');
      }
      g.classList.add('g3d--vivo');
    });
  }
  if (activos && icos.length && 'IntersectionObserver' in window) {
    var cerca = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { cargar(e.target, icos.indexOf(e.target)); cerca.unobserve(e.target); } });
    }, { rootMargin: '900px 0px' });
    var vista = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('g3d--en', e.isIntersecting); });
    }, { rootMargin: '40px 0px' });
    icos.forEach(function (g) { cerca.observe(g); if (!fijo) vista.observe(g); });
  }
  /* inclinación hacia el puntero (solo puntero fino y con movimiento): variables + transición CSS, sin bucle propio */
  if (activos && !fijo && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var lista = sec.querySelector('.clausulas'), pend = 0, px = 0, py = 0;
    var inclinar = function () {
      pend = 0;
      icos.forEach(function (g) {
        var r = g.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = Math.max(-1, Math.min(1, (px - cx) / 420)), dy = Math.max(-1, Math.min(1, (py - cy) / 300));
        g.style.setProperty('--ry', (dx * 16).toFixed(1) + 'deg');
        g.style.setProperty('--rx', (-dy * 12).toFixed(1) + 'deg');
      });
    };
    if (lista) {
      lista.addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; if (!pend) { pend = 1; requestAnimationFrame(inclinar); } });
      lista.addEventListener('pointerleave', function () { icos.forEach(function (g) { g.style.setProperty('--rx', '0deg'); g.style.setProperty('--ry', '0deg'); }); });
    }
  }

  if (quieto) return;                                          /* reducido o ?estatico: el CSS ya muestra el estado final */

  /* ---------- coreografía ---------- */
  function limpiar() {
    ScrollTrigger.getAll().forEach(function (st) {
      var t = st.trigger;
      if (t && sec.contains(t)) { if (st.animation) st.animation.kill(); st.kill(); }
    });
    gsap.set(sec, { clearProps: 'clipPath' });                 /* el CSS clip-path:inset(0) sostiene el fondo fijo */
    gsap.set(Q('.clausula .ico, [data-estampa]'), { clearProps: 'all' });
  }

  function montar() {
    var H = function () { return window.innerHeight; };
    var sS = function () { return abs(sec); };
    var cab = sec.querySelector('.pliego__cab'), claus = sec.querySelector('.clausulas'),
        rent = sec.querySelector('.rentables'), letra = sec.querySelector('.letra-chica');
    var kick = Q('.pliego__kick .versal', cab), hilo = Q('.pliego__hilo', cab), lines = Q('h2 .gl > span', cab),
        lede = Q('.pliego__lede', cab), sello = Q('[data-estampa]');
    var lis = Q('.clausula', claus), nums = Q('.clausula__n', claus), gs = Q('.g3d', claus);

    limpiar();

    var gate = function () { return sS() - 0.40 * H(); };
    var L0 = function () { return Math.min(0.46 * H(), 440); };
    var s1 = function () { return Math.max(abs(claus) - 0.90 * H(), gate() + 0.55 * L0()); };
    var L1 = function () { return 0.46 * H(); };
    var s2 = function () { return Math.max(abs(rent) - 0.93 * H(), s1() + 0.6 * L1()); };
    var L2 = function () { return 0.30 * H(); };
    var s3 = function () { return Math.max(abs(letra) - 0.97 * H(), s2() + 0.55 * L2()); };
    var L3 = function () { return 0.22 * H(); };
    function st(s, L) { return { start: s, end: function () { return s() + L(); }, scrub: 0.7, invalidateOnRefresh: true }; }

    /* 0) rd: acompaña al papel antes que cualquier texto */
    if (sello.length) gsap.fromTo(sello, { scale: 1.1, opacity: 0, y: 18 }, { scale: 1, opacity: 1, y: 0, ease: 'power2.out',
      scrollTrigger: { start: function () { return sS() - 0.98 * H(); }, end: function () { return sS() - 0.58 * H(); }, scrub: 0.7, invalidateOnRefresh: true } });

    /* 0b) papel: se asienta y se desplaza apenas dentro del fondo fijo */
    var papel = sec.querySelector('.pliego__fondo img');
    if (papel) gsap.fromTo(papel, { yPercent: 3, scale: 1.14 }, { yPercent: -3, scale: 1.08, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });

    /* 1) cabecera */
    gsap.timeline({ scrollTrigger: st(gate, L0) })
      .fromTo(kick, { opacity: 0, y: 12 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.2 }, 0)
      .fromTo(hilo, { scaleX: 0 }, { scaleX: 1, ease: 'power2.inOut', duration: 0.6 }, 0.04)
      .fromTo(lines, { yPercent: 112 }, { yPercent: 0, ease: 'power3.out', duration: 0.5, stagger: 0.14 }, 0.1)
      .fromTo(lede, { opacity: 0, y: 22 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.36 }, 0.52)
      .to({}, { duration: 0.04 });

    /* 2) folios: el filete se dibuja, luego cada cláusula con su número y su objeto */
    gsap.timeline({ scrollTrigger: st(s1, L1) })
      .fromTo(claus, { '--filete': 0 }, { '--filete': 1, ease: 'power2.inOut', duration: 0.45 }, 0)
      .fromTo(lis, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.42, stagger: 0.16 }, 0.12)
      .fromTo(nums, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.2, stagger: 0.16 }, 0.22)
      .fromTo(gs, { scale: 0.7, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, ease: 'back.out(1.6)', duration: 0.4, stagger: 0.16 }, 0.2);

    /* 3) cierre y 4) letra chica */
    if (rent) gsap.timeline({ scrollTrigger: st(s2, L2) })
      .fromTo(rent, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.6 }, 0)
      .fromTo(rent.querySelector('p'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', ease: 'power2.out', duration: 0.5 }, 0.25);
    if (letra) gsap.timeline({ scrollTrigger: st(s3, L3) }).fromTo(letra, { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'power3.out' });

    ScrollTrigger.refresh();
  }

  var n = 0;
  (function esperar() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      if (wv) { limpiar(); gsap.set(Q('.clausula, .rentables, .letra-chica, .pliego__lede, .versal, h2 .gl > span'), { clearProps: 'opacity,transform,visibility' }); }
      else montar();
    } else if (++n < 80) setTimeout(esperar, 100);
  })();
})();
