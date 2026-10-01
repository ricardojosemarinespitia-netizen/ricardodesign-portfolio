/* app.js — Ricardo Design. Sin dependencias. Cargado con defer.
   Todo es mejora progresiva: sin JS el sitio se lee completo, el FAQ abre
   (details nativo), los formularios van a WhatsApp con un texto por defecto
   y los proyectos se ven todos. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  html.classList.add('js');

  // Anti-framing (mitigación parcial mientras no haya cabeceras HTTP reales)
  try { if (window.top !== window.self) window.top.location = window.self.location; } catch (e) {}

  var WA = d.body.getAttribute('data-wa') || '573027981468';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  function waUrl(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function push(ev) { try { if (window.RD_MEDICION && window.RD_MEDICION.activo && window.dataLayer) window.dataLayer.push(ev); } catch (e) {} }

  /* ---------- Desplegable "Servicios" ---------- */
  $$('.nav-btn').forEach(function (btn) {
    var panel = d.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    function cerrar() { btn.setAttribute('aria-expanded', 'false'); panel.hidden = true; }
    btn.addEventListener('click', function () {
      var abierto = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!abierto)); panel.hidden = abierto;
    });
    d.addEventListener('click', function (e) { if (!btn.parentNode.contains(e.target)) cerrar(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { cerrar(); btn.focus(); } });
  });

  /* ---------- Menú móvil (foco atrapado, Esc cierra) ---------- */
  var bm = d.querySelector('.btn-menu'), mm = d.getElementById('menu-movil');
  if (bm && mm) {
    var cerrarMenu = function (volver) {
      bm.setAttribute('aria-expanded', 'false'); bm.setAttribute('aria-label', 'Abrir menú'); mm.hidden = true; d.body.classList.remove('menu-abierto');
      if (volver) bm.focus();
    };
    bm.addEventListener('click', function () {
      var abrir = bm.getAttribute('aria-expanded') !== 'true';
      bm.setAttribute('aria-expanded', String(abrir)); mm.hidden = !abrir;
      d.body.classList.toggle('menu-abierto', abrir);
      bm.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
      if (abrir) { var p = mm.querySelector('.menu-panel a'); setTimeout(function () { if (p) p.focus(); }, 30); }
    });
    mm.addEventListener('click', function (e) { if (e.target.closest('a')) cerrarMenu(false); else if (e.target.closest('[data-cerrar-menu]')) cerrarMenu(true); });
    d.addEventListener('keydown', function (e) {
      if (mm.hidden) return;
      if (e.key === 'Escape') cerrarMenu(true);
      if (e.key === 'Tab') {
        var f = $$('a, button', mm), i = f.indexOf(d.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- Pausar animaciones (WCAG 2.2.2) ---------- */
  var pausaBtns = $$('[data-pausa]');
  function setPausa(on) {
    html.classList.toggle('motion-paused', on);
    window.__motionPaused = on;
    pausaBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', String(on));
      var t = b.querySelector('[data-pausa-txt]'); if (t) t.textContent = on ? 'Reanudar animaciones' : 'Pausar animaciones';
    });
    store('rd_pausa', on ? '1' : '0');
  }
  if (store('rd_pausa') === '1') setPausa(true);
  pausaBtns.forEach(function (b) { b.addEventListener('click', function () { setPausa(!html.classList.contains('motion-paused')); }); });
  d.addEventListener('visibilitychange', function () { html.classList.toggle('oculta', d.hidden); });

  /* ---------- Reveal (un solo IntersectionObserver) ---------- */
  var rv = $$('.rv');
  // Stagger: cada .rv recibe un retardo según su posición entre hermanos .rv (máx. 5 pasos)
  rv.forEach(function (el) {
    var her = Array.prototype.filter.call(el.parentNode.children, function (x) { return x.classList.contains('rv'); });
    var i = her.indexOf(el); if (i > 0) el.style.setProperty('--rv-d', Math.min(i, 5) * 90 + 'ms');
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('is-in'); }); }


  /* ---------- Parallax suave (sólo transform; escritorio, sin reduced-motion) ---------- */
  if (finePointer && !reduce && window.innerWidth >= 1024) {
    var par = $$('[data-par]'), pt = false;
    var mover = function () {
      pt = false; if (window.__motionPaused) return;
      var vh = window.innerHeight;
      par.forEach(function (el) {
        var r = el.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
        var v = parseFloat(el.getAttribute('data-par')) || 0.05;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -v).toFixed(1) + 'px,0)';
      });
    };
    if (par.length) { window.addEventListener('scroll', function () { if (!pt) { pt = true; requestAnimationFrame(mover); } }, { passive: true }); mover(); }
    var col = d.querySelector('[data-collage]');
    if (col) {
      var hero = col.closest('section') || col;
      hero.addEventListener('pointermove', function (e) {
        if (window.__motionPaused) return;
        var r = hero.getBoundingClientRect();
        col.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        col.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      hero.addEventListener('pointerleave', function () { col.style.setProperty('--px', 0); col.style.setProperty('--py', 0); });
    }
  }

  /* ---------- Luz que sigue al puntero en tarjetas ---------- */
  if (finePointer && !reduce) {
    $$('.svc-card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Pestañas de simulaciones (patrón ARIA tabs) ---------- */
  $$('[role="tablist"]').forEach(function (tl) {
    var tabs = $$('[role="tab"]', tl);
    function activar(t, foco) {
      tabs.forEach(function (x) {
        var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        var p = d.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
      if (foco) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activar(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); activar(n, true); }
      });
    });
  });

  /* ---------- Arma tu plan → WhatsApp ---------- */
  var plan = d.querySelector('[data-plan]');
  if (plan) {
    var lista = plan.querySelector('.plan-lista'), enviar = plan.querySelector('[data-plan-enviar]');
    var tgl = $$('.toggle', plan);
    var pintar = function () {
      var sel = tgl.filter(function (t) { return t.getAttribute('aria-pressed') === 'true'; });
      lista.innerHTML = '';
      if (!sel.length) {
        var li = d.createElement('li'); li.className = 'vacio'; li.textContent = 'Elige uno o varios servicios.'; lista.appendChild(li);
      }
      sel.forEach(function (t) {
        var li = d.createElement('li'), a = d.createElement('span'), b = d.createElement('span');
        a.textContent = t.getAttribute('data-nombre'); b.textContent = t.getAttribute('data-precio');
        li.appendChild(a); li.appendChild(b); lista.appendChild(li);
      });
      var nombres = sel.map(function (t) { return t.getAttribute('data-nombre').toLowerCase(); });
      var txt = nombres.length
        ? 'Hola Ricardo, quiero cotizar: ' + nombres.join(', ') + '.' + (nombres.length > 1 ? ' Me interesa un plan combinado.' : '')
        : 'Hola Ricardo, quiero cotizar un proyecto para mi negocio.';
      enviar.href = waUrl(txt);
      enviar.setAttribute('data-servicio', nombres.join('+') || 'general');
    };
    tgl.forEach(function (t) {
      t.addEventListener('click', function () { t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true')); pintar(); });
    });
    pintar();
  }

  /* ---------- Mini-brief → WhatsApp ---------- */
  /* Formularios genéricos: cada campo toma su etiqueta de data-label del
     contenedor. Sin JS, el form hace GET a wa.me con el texto por defecto. */
  $$('form[data-wa-form]').forEach(function (form) {
    var vista = form.querySelector('[data-wa-vista]'), intro = form.getAttribute('data-intro') || 'Hola Ricardo.';
    var armar = function () {
      var l = [intro], datos = {}, orden = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'hidden' || el.type === 'submit') return;
        if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
        var v = String(el.value || '').trim().slice(0, 80); if (!v) return;
        var cont = el.closest('[data-label]'), lab = cont ? cont.getAttribute('data-label') : el.name;
        if (!datos[lab]) { datos[lab] = []; orden.push(lab); }
        datos[lab].push(v);
      });
      orden.forEach(function (k) { l.push(k + ': ' + datos[k].join(', ')); });
      return { texto: l.join('\n'), datos: datos };
    };
    var actualizar = function () { if (vista) vista.textContent = armar().texto; };
    form.addEventListener('input', actualizar); form.addEventListener('change', actualizar); actualizar();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = armar();
      // Al dataLayer sólo van categorías, nunca el nombre del negocio.
      push({ event: form.getAttribute('data-evento') || 'brief_submit', servicio: (r.datos['Servicio'] || []).join('+') || d.body.getAttribute('data-servicio') || 'general', presupuesto: (r.datos['Presupuesto aproximado'] || [''])[0], plazo: (r.datos['¿Para cuándo?'] || [''])[0] });
      window.open(waUrl(r.texto), '_blank', 'noopener');
    });
  });

  /* ---------- Filtros de proyectos ---------- */
  var filtros = d.querySelector('[data-filtros]');
  if (filtros) {
    var cards = $$('[data-servicios]'), vivo = d.querySelector('[data-filtro-vivo]'), bts = $$('button', filtros);
    var aplicar = function (val, guardar) {
      var n = 0;
      bts.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === val)); });
      cards.forEach(function (c) {
        var ok = val === 'todos' || (' ' + c.getAttribute('data-servicios') + ' ').indexOf(' ' + val + ' ') > -1;
        c.hidden = !ok; if (ok) n++;
      });
      if (vivo) vivo.textContent = 'Mostrando ' + n + (n === 1 ? ' proyecto' : ' proyectos');
      if (guardar) { try { var u = new URL(location.href); if (val === 'todos') u.searchParams.delete('servicio'); else u.searchParams.set('servicio', val); history.replaceState(null, '', u); } catch (e) {} }
    };
    bts.forEach(function (b) { b.addEventListener('click', function () { aplicar(b.getAttribute('data-f'), true); }); });
    var ini = 'todos'; try { ini = new URL(location.href).searchParams.get('servicio') || 'todos'; } catch (e) {}
    if (!bts.some(function (b) { return b.getAttribute('data-f') === ini; })) ini = 'todos';
    aplicar(ini, false);
  }

  /* ---------- Fases: fase activa + barra de progreso (un rAF) ---------- */
  var fasesEl = d.querySelector('.fases');
  if (fasesEl) {
    var fases = $$('.fase', fasesEl), prog = fasesEl.querySelector('.fases-prog'), tick = false;
    var calc = function () {
      tick = false;
      var r = fasesEl.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      if (prog) prog.style.setProperty('--prog', p.toFixed(3));
      fases.forEach(function (f) { var fr = f.getBoundingClientRect(); f.classList.toggle('activa', fr.top < vh * 0.6 && fr.bottom > vh * 0.25); });
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(calc); } }, { passive: true });
    calc();
  }

  /* ---------- Diagrama de recorrido: resaltar nodos en secuencia ---------- */
  var nodos = $$('.rc-nodo');
  if (nodos.length && !reduce) {
    var k = 0;
    setInterval(function () {
      if (window.__motionPaused || d.hidden) return;
      nodos.forEach(function (n, i) { n.classList.toggle('on', i === k); }); k = (k + 1) % nodos.length;
    }, 1400);
  }

  /* ---------- Formatos de contenido: vista previa ---------- */
  var fl = d.querySelector('[data-formatos]');
  if (fl) {
    var pieza = d.querySelector('[data-pieza]'), spec = d.querySelector('[data-pieza-spec]'), titulo = d.querySelector('[data-pieza-titulo]');
    $$('.formato-btn', fl).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.formato-btn', fl).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        pieza.style.setProperty('--ar', b.getAttribute('data-ar'));
        pieza.className = 'pieza ' + (b.getAttribute('data-tipo') || '');
        if (titulo) titulo.textContent = b.getAttribute('data-nombre');
        if (spec) spec.textContent = b.getAttribute('data-spec');
      });
    });
  }

  /* ---------- WhatsApp flotante: se oculta sobre #contacto y con el banner ---------- */
  var wf = d.querySelector('.wa-float'), zona = d.getElementById('contacto') || d.querySelector('.cta-final');
  if (wf && zona && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { wf.classList.toggle('oculto', es[0].isIntersecting); }, { threshold: 0.15 }).observe(zona);
  }

  /* ---------- Eventos de medición (sólo si hay consentimiento y medición activa) ---------- */
  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (a) push({ event: 'cta_whatsapp_click', servicio: a.getAttribute('data-servicio') || d.body.getAttribute('data-servicio') || 'general', ubicacion: a.getAttribute('data-ubicacion') || 'pagina' });
  });

  /* ---------- Consentimiento de cookies (plan §9.2) ----------
     Con RD_MEDICION.activo === false (por defecto) NO se muestra banner y
     NO se carga ninguna etiqueta de terceros. */
  var M = window.RD_MEDICION || { activo: false };
  var banner = d.getElementById('cookies');
  var idValido = M.gtmId && String(M.gtmId).indexOf('{{') === -1 && /^GTM-[A-Z0-9]+$/.test(M.gtmId);
  var activo = !!(M.activo && idValido);
  function leerC() { try { var c = JSON.parse(store('rd_consent') || 'null'); if (c && c.v === 1 && (Date.now() - c.fecha) < 31536e6) return c; } catch (e) {} return null; }
  function gtag() { window.dataLayer.push(arguments); }
  function cargarGTM(c) {
    if (window.__gtm) return; window.__gtm = true;
    gtag('consent', 'update', { analytics_storage: c.analitica ? 'granted' : 'denied', ad_storage: c.publicidad ? 'granted' : 'denied', ad_user_data: c.publicidad ? 'granted' : 'denied', ad_personalization: c.publicidad ? 'granted' : 'denied' });
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    if (c.publicidad) window.dataLayer.push({ event: 'consent_marketing' });
    if (c.analitica) window.dataLayer.push({ event: 'consent_analytics' });
    var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(M.gtmId); d.head.appendChild(s);
  }
  function guardar(an, pu) { var c = { v: 1, fecha: Date.now(), analitica: an, publicidad: pu }; store('rd_consent', JSON.stringify(c)); if (banner) banner.hidden = true; if (an || pu) cargarGTM(c); }
  if (activo && banner) {
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500 });
    var c0 = leerC();
    if (c0) { if (c0.analitica || c0.publicidad) cargarGTM(c0); } else banner.hidden = false;
    var cfg = banner.querySelector('.cookies-cfg');
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]'); if (!b) return;
      var a = b.getAttribute('data-c');
      if (a === 'todas') guardar(true, true);
      if (a === 'rechazar') guardar(false, false);
      if (a === 'config') cfg.hidden = !cfg.hidden;
      if (a === 'guardar') guardar(banner.querySelector('[name=c-analitica]').checked, banner.querySelector('[name=c-publicidad]').checked);
    });
  }
  $$('[data-config-cookies]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (activo && banner) { banner.hidden = false; var f = banner.querySelector('button'); if (f) f.focus(); }
      else { var r = b.getAttribute('data-href'); if (r) location.href = r; }
    });
  });

  /* ---------- Splash (la secuencia es CSS; aquí sólo saltar y limpiar) ---------- */
  var capaS = d.querySelector('.splash-capa');
  if (html.classList.contains('splash') && capaS) {
    var finS = function () { html.classList.remove('splash'); html.classList.add('splash-fin'); if (capaS.parentNode) capaS.parentNode.removeChild(capaS); };
    var saltar = function () { capaS.classList.add('sube-ya'); setTimeout(finS, 650); };
    capaS.addEventListener('animationend', function (e) { if (e.animationName === 'cortina') finS(); });
    ['click', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) { window.addEventListener(ev, saltar, { once: true, passive: true }); });
    setTimeout(finS, 3600); // red de seguridad
  } else if (capaS) { capaS.parentNode.removeChild(capaS); }

  /* ---------- Letras del nombre que reaccionan al cursor ---------- */
  var wm = d.querySelector('.hero-wordmark');
  if (wm && finePointer && !reduce) {
    var letras = $$('i', wm);
    wm.parentNode.addEventListener('pointermove', function (e) {
      if (window.__motionPaused) return;
      letras.forEach(function (l) {
        var r = l.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var dist = Math.sqrt(dx * dx + dy * dy), f = Math.max(0, 1 - dist / 220);
        l.style.transform = f ? 'translate(' + (-dx * f * 0.12).toFixed(1) + 'px,' + (-dy * f * 0.18 - f * 8).toFixed(1) + 'px) rotate(' + (dx * f * 0.04).toFixed(1) + 'deg) scale(' + (1 + f * 0.08).toFixed(3) + ')' : '';
        l.classList.toggle('cerca', f > 0.35);
      });
    });
    wm.parentNode.addEventListener('pointerleave', function () { letras.forEach(function (l) { l.style.transform = ''; l.classList.remove('cerca'); }); });
  }


  /* ---------- Buscador (índice estático window.RD_BUSQUEDA) ---------- */
  var bb = d.querySelector('.btn-buscar'), bz = d.getElementById('buscador');
  if (bb && bz) {
    var q = bz.querySelector('input'), res = bz.querySelector('.buscador-res'), est = d.getElementById('buscador-estado');
    var raiz = d.body.getAttribute('data-raiz') || '';
    var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var abrirB = function () { bz.hidden = false; bb.setAttribute('aria-expanded', 'true'); d.body.classList.add('menu-abierto'); setTimeout(function () { q.focus(); }, 30); };
    var cerrarB = function () { bz.hidden = true; bb.setAttribute('aria-expanded', 'false'); d.body.classList.remove('menu-abierto'); bb.focus(); };
    var pintarB = function () {
      var datos = window.RD_BUSQUEDA || [], t = norm(q.value).trim();
      res.innerHTML = '';
      if (!t) { est.textContent = ''; return; }
      var palabras = t.split(/\s+/);
      var hits = datos.map(function (x) {
        var h = norm(x.t + ' ' + x.d), s = 0;
        for (var i = 0; i < palabras.length; i++) { if (h.indexOf(palabras[i]) === -1) return null; s += norm(x.t).indexOf(palabras[i]) > -1 ? 3 : 1; }
        return { x: x, s: s };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 12);
      if (!hits.length) { var li = d.createElement('li'); li.className = 'vacio'; li.textContent = 'Sin resultados. Prueba con otra palabra o escríbenos por WhatsApp.'; res.appendChild(li); est.textContent = 'Sin resultados'; return; }
      hits.forEach(function (h) {
        var li = d.createElement('li'), a = d.createElement('a'), g = d.createElement('small'), b = d.createElement('b'), p = d.createElement('span');
        a.href = raiz + h.x.u; g.textContent = h.x.g; b.textContent = h.x.t; p.textContent = h.x.d;
        a.appendChild(g); a.appendChild(b); if (h.x.d) a.appendChild(p); li.appendChild(a); res.appendChild(li);
        a.addEventListener('click', function () { bz.hidden = true; d.body.classList.remove('menu-abierto'); });
      });
      est.textContent = hits.length + (hits.length === 1 ? ' resultado' : ' resultados');
    };
    bb.addEventListener('click', abrirB);
    q.addEventListener('input', pintarB);
    $$('[data-sugerencias] button', bz).forEach(function (b) { b.addEventListener('click', function () { q.value = b.textContent; pintarB(); q.focus(); }); });
    bz.addEventListener('click', function (e) { if (e.target.closest('[data-cerrar-buscador]')) cerrarB(); });
    bz.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); cerrarB(); return; }
      var links = $$('.buscador-res a', bz), i = links.indexOf(d.activeElement);
      if (e.key === 'ArrowDown' && links.length) { e.preventDefault(); (links[i + 1] || links[0]).focus(); }
      if (e.key === 'ArrowUp' && links.length) { e.preventDefault(); if (i <= 0) q.focus(); else links[i - 1].focus(); }
      if (e.key === 'Enter' && d.activeElement === q && links[0]) { e.preventDefault(); location.href = links[0].href; }
      if (e.key === 'Tab') { var f = $$('button, input, a', bz).filter(function (x) { return x.offsetParent !== null; }), k = f.indexOf(d.activeElement);
        if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
  }

  /* ---------- Sombra del header al hacer scroll ---------- */
  var cabE = d.querySelector('.cab');
  if (cabE) { var cs = function () { cabE.classList.toggle('con-sombra', window.scrollY > 8); }; window.addEventListener('scroll', cs, { passive: true }); cs(); }

  /* ---------- Ventana emergente de proyectos (contenido desde <template>) ---------- */
  var pm = d.getElementById('pj-modal');
  if (pm) {
    var cuerpo = pm.querySelector('[data-modal-cuerpo]'), origen = null;
    var cerrarM = function () { pm.hidden = true; d.body.classList.remove('menu-abierto'); cuerpo.innerHTML = ''; if (origen) origen.focus(); };
    d.addEventListener('click', function (e) {
      var a = e.target.closest('[data-modal]'); if (!a) return;
      var tpl = d.getElementById(a.getAttribute('data-modal')); if (!tpl || !tpl.content) return;
      e.preventDefault(); origen = a;
      cuerpo.innerHTML = ''; cuerpo.appendChild(tpl.content.cloneNode(true));
      var h = cuerpo.querySelector('h2'); if (h) h.id = 'pj-modal-t';
      var card = a.closest('[data-acento]'); pm.setAttribute('data-acento', card ? card.getAttribute('data-acento') : 'azul');
      pm.hidden = false; d.body.classList.add('menu-abierto');
      setTimeout(function () { var x = pm.querySelector('.pj-modal-x'); if (x) x.focus(); }, 30);
    });
    pm.addEventListener('click', function (e) { if (e.target.closest('[data-cerrar-modal]')) cerrarM(); });
    pm.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); cerrarM(); return; }
      if (e.key === 'Tab') { var f = $$('a, button', pm).filter(function (x) { return x.offsetParent !== null; }), k = f.indexOf(d.activeElement);
        if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
  }

  /* ---------- Servicios: conmutador temporal Cuadrícula | Carrusel ---------- */
  var sv = d.querySelector('[data-svc-vista]');
  if (sv) {
    var pista = sv.querySelector('[data-svc-pista]'), btnsV = $$('[data-vista-btn]'), puntos = sv.querySelector('[data-car-puntos]');
    var tarjetas = $$('.svc-card', pista);
    var ponerVista = function (v, guardar) {
      if (v !== 'carrusel') v = 'cuadricula';
      sv.setAttribute('data-svc-vista', v);
      btnsV.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-vista-btn') === v)); });
      if (v === 'carrusel') { pista.setAttribute('role', 'region'); pista.setAttribute('aria-label', 'Carrusel de servicios'); pista.tabIndex = 0; }
      else { pista.removeAttribute('role'); pista.removeAttribute('aria-label'); pista.tabIndex = -1; }
      if (guardar) store('rd_svc_vista', v);
      marcar();
    };
    var actual = function () { var w = pista.clientWidth, x = pista.scrollLeft, best = 0, bd = 1e9;
      tarjetas.forEach(function (t, i) { var dd = Math.abs(t.offsetLeft - pista.offsetLeft - x); if (dd < bd) { bd = dd; best = i; } }); return best; };
    var ir = function (i) { i = Math.max(0, Math.min(tarjetas.length - 1, i)); pista.scrollTo({ left: tarjetas[i].offsetLeft - pista.offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); };
    tarjetas.forEach(function (t, i) { var b = d.createElement('button'); b.type = 'button'; b.className = 'svc-punto'; b.setAttribute('aria-label', 'Ir al servicio ' + (i + 1)); b.addEventListener('click', function () { ir(i); }); puntos.appendChild(b); });
    var marcar = function () { var k = actual(); $$('.svc-punto', puntos).forEach(function (b, i) { b.setAttribute('aria-current', i === k ? 'true' : 'false'); }); };
    sv.querySelector('[data-car="prev"]').addEventListener('click', function () { ir(actual() - 1); });
    sv.querySelector('[data-car="next"]').addEventListener('click', function () { ir(actual() + 1); });
    pista.addEventListener('scroll', function () { requestAnimationFrame(marcar); }, { passive: true });
    pista.addEventListener('keydown', function (e) {
      if (sv.getAttribute('data-svc-vista') !== 'carrusel' || e.target !== pista) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual() - 1); }
    });
    btnsV.forEach(function (b) { b.addEventListener('click', function () { ponerVista(b.getAttribute('data-vista-btn'), true); }); });
    var vIni = null; try { vIni = new URL(location.href).searchParams.get('servicios'); } catch (e) {}
    ponerVista(vIni || store('rd_svc_vista') || 'cuadricula', !!vIni);
  }

})();
