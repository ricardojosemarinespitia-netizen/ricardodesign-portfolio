/* Garantía (#garantia): coreografía por scroll en dos tiempos.
   1) entra el papel solo (fondo fijo + sello rd), sin texto;
   2) al seguir bajando, el texto entra por grupos (kicker, titular por líneas, subrayado, lede,
      cláusulas, campañas rentables, letra chica), todo con scrub (el scroll manda).
   Reemplaza las animaciones por tiempo que sitio.min.js / secciones.min.js crean sobre esta sección.
   Solo transform/opacity/stroke. Texto siempre en el DOM; reducido, ?estatico y WebView: estado final sin animar. */
(function () {
  var sec = document.getElementById('garantia');
  if (!sec) return;
  var root = document.documentElement;
  if (root.classList.contains('quieto')) return;                 /* reducido o ?estatico: el CSS ya muestra el estado final */

  function Q(s, e) { return [].slice.call((e || sec).querySelectorAll(s)); }
  function abs(el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }   /* inmune a transforms */

  function limpiar() {
    ScrollTrigger.getAll().forEach(function (st) {
      var t = st.trigger;
      if (t && sec.contains(t)) { if (st.animation) st.animation.kill(); st.kill(); }
    });
    gsap.set(sec, { clearProps: 'clipPath' });                    /* el CSS clip-path:inset(0) sostiene el fondo fijo */
  }

  function finales() {
    gsap.set(Q('.r-sube'), { opacity: 1, y: 0 });
    gsap.set(Q('h2 .lin > span'), { clearProps: 'all' });
    gsap.set(Q('.trazo path'), { strokeDashoffset: 0 });
    gsap.set(Q('.clausula'), { clearProps: 'opacity,transform' });
    gsap.set(Q('.clausula .ico'), { strokeDashoffset: 0 });
    gsap.set(Q('[data-estampa]'), { clearProps: 'opacity,transform' });
    Q('[data-cuenta]').forEach(function (n) { n.textContent = n.getAttribute('data-cuenta'); });
  }

  function montar() {
    var H = function () { return window.innerHeight; };
    var sS = function () { return abs(sec); };
    var cab = sec.querySelector('.pliego__cab'), claus = sec.querySelector('.clausulas'),
        rent = sec.querySelector('.rentables'), letra = sec.querySelector('.letra-chica');
    var cn = cab.querySelector('.r-sube');
    var kick = Q('.versal', cab), lines = Q('h2 .lin > span', cab), trazo = Q('.trazo path', cab),
        lede = Q('.pliego__lede', cab), sello = Q('[data-estampa]');
    var lis = Q('.clausula', claus), icos = Q('.clausula .ico', claus);

    limpiar();
    Q('[data-cuenta]').forEach(function (n) { n.textContent = n.getAttribute('data-cuenta'); });   /* el contador original las dejó en 0 */
    gsap.set(cn, { opacity: 1, y: 0 });
    if (rent) gsap.set(rent, { opacity: 1, y: 0 });

    /* secuencia: cada grupo arranca cuando le toca (compuerta del papel) o cuando entra en pantalla, lo que ocurra después */
    var gate = function () { return sS() - 0.40 * H(); };
    var L0 = function () { return Math.min(0.46 * H(), 440); };
    var s1 = function () { return Math.max(abs(claus) - 0.90 * H(), gate() + 0.55 * L0()); };
    var L1 = function () { return 0.42 * H(); };
    var s2 = function () { return Math.max(abs(rent) - 0.93 * H(), s1() + 0.6 * L1()); };
    var L2 = function () { return 0.30 * H(); };
    var s3 = function () { return Math.max(abs(letra) - 0.97 * H(), s2() + 0.55 * L2()); };
    var L3 = function () { return 0.24 * H(); };

    function st(s, L) {
      return { start: s, end: function () { return s() + L(); }, scrub: 0.7, invalidateOnRefresh: true };
    }

    /* 0) sello rd: acompaña al papel en la primera fase */
    if (sello.length) {
      gsap.fromTo(sello, { scale: 1.12, opacity: 0 }, {
        scale: 1, opacity: 1, ease: 'power2.out',
        scrollTrigger: { start: function () { return sS() - 0.98 * H(); }, end: function () { return sS() - 0.60 * H(); }, scrub: 0.7, invalidateOnRefresh: true }
      });
    }

    /* 0b) papel: se asienta y se desplaza apenas (solo transform, dentro del fondo que recorta) */
    var papel = sec.querySelector('.pliego__fondo img');
    if (papel) {
      gsap.fromTo(papel, { yPercent: 3, scale: 1.14 }, {
        yPercent: -3, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    }

    /* 1) cabecera: kicker, titular por líneas (máscara), subrayado que se dibuja, lede */
    var t0 = gsap.timeline({ scrollTrigger: st(gate, L0) });
    t0.fromTo(kick, { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.22 }, 0)
      .fromTo(lines, { yPercent: 118, rotate: 2.5 }, { yPercent: 0, rotate: 0, ease: 'power3.out', duration: 0.5, stagger: 0.13 }, 0.08)
      .fromTo(trazo, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.3 }, 0.62)
      .fromTo(lede, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.36 }, 0.5)
      .to({}, { duration: 0.04 });

    /* 2) cláusulas escalonadas (con su regla superior y su ícono dibujándose) */
    var t1 = gsap.timeline({ scrollTrigger: st(s1, L1) });
    t1.fromTo(lis, { opacity: 0, y: 46 }, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.42, stagger: 0.2 }, 0)
      .fromTo(icos, { strokeDasharray: 90, strokeDashoffset: 90 }, { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.4, stagger: 0.2 }, 0.08);

    /* 3) campañas rentables y 4) letra chica (el contenedor lleva su filete: entra completo) */
    if (rent) gsap.timeline({ scrollTrigger: st(s2, L2) }).fromTo(rent, { opacity: 0, y: 34 }, { opacity: 1, y: 0, ease: 'power3.out' });
    if (letra) gsap.timeline({ scrollTrigger: st(s3, L3) }).fromTo(letra, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power3.out' });

    ScrollTrigger.refresh();
  }

  function listo() {
    var h2 = sec.querySelector('h2');
    return window.gsap && window.ScrollTrigger && h2 && h2.classList.contains('lineas-listas');
  }
  var n = 0;
  (function esperar() {
    if (listo()) {
      gsap.registerPlugin(ScrollTrigger);
      if (root.classList.contains('webview')) { limpiar(); finales(); } else montar();
    } else if (++n < 80) setTimeout(esperar, 100);
  })();
})();
