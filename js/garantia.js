/* Garantía v2 (#garantia): pliego en dos tiempos + íconos 3D que giran sobre su eje.
   Coreografía por scroll (scrub): 1) entra el papel (fondo fijo + rd), sin texto;
   2) el texto entra por grupos: kicker y su hilo, titular por líneas (máscara), lede, filete de las cláusulas que se dibuja,
      folios 01-04 con su objeto, "Campañas rentables." y letra chica.
   Íconos: hoja de giro 12x6 (72 cuadros de 5°, 360°, sin sombra) de assets/web/garantia3d/<nombre>-gira72.(avif|webp), cargada al acercarse;
   gira por CSS (steps) y se pausa fuera de pantalla. Reducido, ?estatico, WebView de Instagram/Facebook y ahorro de datos:
   primer cuadro de la misma hoja, quieto, sin animación. Si el archivo no existe, queda el SVG. Texto siempre en el DOM. */
(function () {
  var sec = document.getElementById('garantia');
  if (!sec) return;
  var root = document.documentElement;
  var quieto = root.classList.contains('quieto'), wv = root.classList.contains('webview');
  var ahorro = !!(navigator.connection && navigator.connection.saveData);
  function Q(s, e) { return [].slice.call((e || sec).querySelectorAll(s)); }
  function abs(el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }

  /* ---------- íconos 3D en tiempo real (js/g3d.js, WebGL propio) ----------
     Se arman al acercarse (900 px). Vaivén ±32°, puntero y scroll inclinan el objeto de verdad; cada uno vive.
     Reducido, ?estatico, WebView de Instagram/Facebook, ahorro de datos o sin WebGL: foto fija (assets/web/garantia3d/v2). */
  var fijo = quieto || wv || ahorro;
  var icos = Q('.g3d'), G = null;
  function foto(g) {
    if (g._f) return; g._f = 1;
    var n = g.getAttribute('data-g3d'), im = new Image();
    im.className = 'g3d__foto'; im.alt = ''; im.decoding = 'async'; im.width = im.height = 240;
    im.onload = function () { g.classList.add('g3d--vivo'); };
    im.src = 'assets/web/garantia3d/v2/' + n + (window.G3D_AVIF === false ? '.webp' : '.avif');
    im.onerror = function () { if (!/webp$/.test(im.src)) im.src = im.src.replace(/avif$/, 'webp'); };
    g.insertBefore(im, g.firstChild);
  }
  function armar() {
    if (G) return;
    G = (!fijo && window.G3D) ? window.G3D(icos, { scroll: function (it) {
      var r = it.el.getBoundingClientRect(); return ((r.top + r.height / 2) / (innerHeight || 1) - .5) * .22;
    } }) : { ok: false };
    if (!G.ok) { icos.forEach(foto); return; }
    icos.forEach(function (g) { g.classList.add('g3d--vivo', 'g3d--rt'); });
    var vis = 0, fn = function (ms) { G.cuadro(ms); };
    var tk = window.RDFX && RDFX.tick, propio = 0;
    function arr() { if (tk) tk.add(fn); else if (!propio) { propio = 1; (function l(ms) { if (!propio) return; fn(ms); requestAnimationFrame(l); })(performance.now()); } }
    function par() { if (tk) tk.remove(fn); else propio = 0; }
    var vista = new IntersectionObserver(function (es) {
      es.forEach(function (e) { G.ver(e.target, e.isIntersecting); vis += e.isIntersecting ? 1 : -1; });
      vis = Math.max(0, vis); if (vis) arr(); else par();
    }, { rootMargin: '60px 0px' });
    icos.forEach(function (g) { vista.observe(g); });
    var rs = 0; addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(G.medir, 150); });
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      var lista = sec.querySelector('.clausulas'), pend = 0, px = 0, py = 0;
      lista.addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; if (!pend) { pend = 1; requestAnimationFrame(function () {
        pend = 0; icos.forEach(function (g) { var r = g.getBoundingClientRect();
          G.inclinar(g, cl((py - r.top - r.height / 2) / 300) * .22, cl((px - r.left - r.width / 2) / 420) * .38); });
      }); } });
      lista.addEventListener('pointerleave', function () { icos.forEach(function (g) { G.inclinar(g, 0, 0); }); });
    }
  }
  function cl(x) { return Math.max(-1, Math.min(1, x)); }
  if (icos.length && sec.querySelector('[data-g3d-on]') && 'IntersectionObserver' in window) {
    var cerca = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { cerca.disconnect(); armar(); }
    }, { rootMargin: '900px 0px' });
    icos.forEach(function (g) { cerca.observe(g); });
  }

  /* rd: se inclina apenas hacia el puntero (variables CSS sobre el <picture>; la entrada usa el contenedor) */
  var rd = sec.querySelector('.pliego__rd');
  if (rd && !fijo && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var rp = 0, rx = 0, ry = 0;
    sec.addEventListener('pointermove', function (e) { rx = e.clientX; ry = e.clientY; if (!rp) { rp = 1; requestAnimationFrame(function () {
      rp = 0; var b = rd.getBoundingClientRect();
      var dx = Math.max(-1, Math.min(1, (rx - b.left - b.width / 2) / 600)), dy = Math.max(-1, Math.min(1, (ry - b.top - b.height / 2) / 500));
      rd.style.setProperty('--rd-ry', (dx * 10).toFixed(1) + 'deg'); rd.style.setProperty('--rd-rx', (-dy * 7).toFixed(1) + 'deg');
    }); } });
    sec.addEventListener('pointerleave', function () { rd.style.setProperty('--rd-ry', '0deg'); rd.style.setProperty('--rd-rx', '0deg'); });
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

    /* 0a) rd: inclinación sutil con el scroll (de 8° a -4° mientras cruza la pantalla) */
    if (rd) gsap.fromTo(rd, { '--rd-sy': '8deg' }, { '--rd-sy': '-4deg', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

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

/* rd negro mate: WebGL en vivo con el MISMO motor del hero (js/rd3d.min.js, export giro(): misma geometría, material, estudio y
   sombra de contacto). Gira sobre su eje a velocidad constante, 16 s por vuelta, sin cuadros ni fantasma; pausa fuera de pantalla
   y con la pestaña oculta; suelta el contexto WebGL al salir de vista. El módulo es el mismo que importa el hero (misma URL):
   si el hero ya lo cargó no se descarga nada nuevo.
   ROT_MODO: 'vuelta' (360°, el reverso muestra el rd en espejo: es inherente a la vuelta completa) o 'balanceo' (±ROT_AMPLITUD°).
   Reducido, ?estatico, WebView de Instagram/Facebook, ahorro de datos, red 2g, equipo débil o sin WebGL2: queda el póster fijo del HTML. */
(function () {
  var ROT_MODO = 'vuelta', ROT_AMPLITUD = 35, ROT_SEG = 16000;
  var rd = document.querySelector('#garantia .pliego__rd');
  if (!rd || !window.IntersectionObserver) return;
  var root = document.documentElement, t = navigator, red = t.connection || {};
  if (root.classList.contains('quieto') || root.classList.contains('webview') || /[?&]estatico/.test(location.search) ||
      /Instagram|FBAN|FBAV|FB_IAB/.test(t.userAgent) || matchMedia('(prefers-reduced-motion: reduce)').matches ||
      red.saveData || /(^|-)2g$/.test(red.effectiveType || '') ||
      (t.deviceMemory && t.deviceMemory < 4) || (t.hardwareConcurrency && t.hardwareConcurrency < 4)) return;
  try { var gl = document.createElement('canvas').getContext('webgl2'); if (!gl) return; var lc = gl.getExtension('WEBGL_lose_context'); lc && lc.loseContext(); } catch (e) { return; }
  var hecho = 0, zona = document.getElementById('garantia');
  var cerca = new IntersectionObserver(function (es) {
    if (hecho || !es[0].isIntersecting) return; hecho = 1; cerca.disconnect();
    import(new URL('js/rd3d.min.js', document.baseURI).href).then(function (m) {
      return m.giro(rd, { modo: ROT_MODO, amplitud: ROT_AMPLITUD, seg: ROT_SEG, zona: zona, exp: 2.2 });   /* exposición sobre papel claro: el mismo negro mate se lee como el póster de Blender */
    }).then(function (g) { window.__rdGiro = g; }).catch(function (e) { rd.classList.remove('rd-vivo', 'rd-3d'); console.warn('rd giro', e && e.message); });
  }, { rootMargin: '700px 0px' });
  cerca.observe(zona);                                        /* la sección: su clip-path impide observar al rd directamente */
})();
