/* cookies.js — gestor de consentimiento propio de ricardodesign.co (19 oct 2026). Sin librerías. Se minifica con: node scripts/compat.mjs → js/cookies.min.js
   Qué hace: GA4, Microsoft Clarity y el píxel de Meta se cargan SOLO después de aceptar su categoría (Analítica = GA4 + Clarity · Publicidad = Meta).
   Sin decisión, o con «Rechazar», no se pide ningún script de terceros ni se escribe ninguna cookie. Sin JS tampoco se mide nada.
   La decisión vive en localStorage.rd_consent = {a:0|1, p:0|1, t:ms} durante 12 meses. El aviso y el panel los crea este archivo (position:fixed, no mueven la página).
   Cualquier elemento con [data-config-cookies] reabre el panel. */
(function () {
  'use strict';

  /* ======================= CONFIGURACIÓN (lo único que se edita) =======================
     Un ID vacío = ese servicio NO se carga, aunque el visitante acepte.
       clarity : ID del proyecto de Microsoft Clarity (el que antes estaba incrustado en index.html).
       ga4     : ID de medición de Google Analytics 4, formato 'G-XXXXXXXXXX'.
       meta    : ID numérico del píxel de Meta, p. ej. '123456789012345'.
     Tras editar: node scripts/compat.mjs (regenera js/cookies.min.js) y publicar. */
  var RD_IDS = { clarity: 'z0cdw5h42e', ga4: '', meta: '' };
  /* ===================================================================================== */

  var K = 'rd_consent', VIGENCIA = 365 * 864e5;
  var w = window, d = document, h = d.documentElement;
  var mem = null, cargado = {}, vis = {}, B, M, N, foco, tN;

  /* ---------- Decisión guardada ---------- */
  function leer() {
    var c = mem;
    try { c = JSON.parse(localStorage.getItem(K)) || c; } catch (e) {}
    return c && Date.now() - c.t < VIGENCIA ? { a: c.a ? 1 : 0, p: c.p ? 1 : 0, t: c.t } : null;
  }
  function guardar(a, p) {
    var c = { a: a ? 1 : 0, p: p ? 1 : 0, t: Date.now() };
    mem = c;
    try { localStorage.setItem(K, JSON.stringify(c)); } catch (e) {}
    return c;
  }

  /* ---------- Carga condicionada de servicios ---------- */
  function js(src) { var s = d.createElement('script'); s.async = true; s.src = src; d.head.appendChild(s); }
  function gtag() { w.dataLayer.push(arguments); }
  var RA = /^(_ga|_ga_.+|_gid|_gat.*|_clck|_clsk|CLID|MUID|SM|ANONCHK)$/, RP = /^(_fbp|_fbc)$/;
  function borrar(re) {
    if (!d.cookie) return;
    var host = location.hostname, doms = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    d.cookie.split(';').forEach(function (x) {
      var n = x.split('=')[0].replace(/^\s+/, '');
      if (re.test(n)) doms.forEach(function (dm) { d.cookie = n + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + (dm ? ';domain=' + dm : ''); });
    });
  }
  function aplicar(c) {
    var I = RD_IDS;
    if (I.ga4) {
      /* Consent Mode v2: todo negado hasta que la categoría se acepte; gtag.js no se pide antes */
      gtag('consent', 'update', { analytics_storage: c.a ? 'granted' : 'denied', ad_storage: c.p ? 'granted' : 'denied', ad_user_data: c.p ? 'granted' : 'denied', ad_personalization: c.p ? 'granted' : 'denied' });
    }
    if (c.a) {
      if (I.clarity && !cargado.c) {
        cargado.c = 1;
        w.clarity = w.clarity || function () { (w.clarity.q = w.clarity.q || []).push(arguments); };
        js('https://www.clarity.ms/tag/' + encodeURIComponent(I.clarity));
      }
      if (I.ga4 && !cargado.g) {
        cargado.g = 1;
        js('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(I.ga4));
        gtag('js', new Date()); gtag('config', I.ga4);
      }
    } else {
      if (cargado.c) try { w.clarity('consent', false); } catch (e) {}
      borrar(RA);
    }
    if (c.p) {
      if (I.meta && !cargado.m) {
        cargado.m = 1;
        var f = w.fbq = function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
        if (!w._fbq) w._fbq = f;
        f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
        js('https://connect.facebook.net/en_US/fbevents.js');
        f('init', I.meta); f('track', 'PageView');
      } else if (cargado.m) w.fbq('consent', 'grant');
    } else {
      if (cargado.m) w.fbq('consent', 'revoke');
      borrar(RP);
    }
  }

  /* ---------- Interfaz ---------- */
  function vista(k, v) { vis[k] = v; h.classList.toggle('ck-on', !!(vis.b || vis.m || vis.n)); }
  function crear(cls, html, attrs) {
    var e = d.createElement('div'); e.className = cls; e.innerHTML = html;
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    /* respaldo si la hoja aún no llegó: nunca en el flujo de la página */
    e.style.position = 'fixed';
    return e;
  }
  function mostrar(e, k) { void e.offsetWidth; e.classList.add('ck--ver'); vista(k, true); }
  function ocultar(e, k) { e.classList.remove('ck--ver'); vista(k, false); }

  function aviso() {
    if (B) return;
    B = crear('ck',
      '<p class="ck__t">Usamos cookies para medir el sitio y mejorar los anuncios. Tú decides. <a href="/cookies/">Más información</a></p>' +
      '<div class="ck__b"><button type="button" class="ck__btn ck__btn--p" data-ck="a">Aceptar</button><button type="button" class="ck__btn" data-ck="r">Rechazar</button><button type="button" class="ck__btn ck__btn--l" data-ck="c">Configurar</button></div>',
      { role: 'region', 'aria-label': 'Aviso de cookies' });
    B.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-ck]'); a = a && a.getAttribute('data-ck');
      if (a === 'a') decidir(1, 1); else if (a === 'r') decidir(0, 0); else if (a === 'c') panel(e.target.closest('button'));
    });
    d.body.insertBefore(B, d.body.firstChild);
    mostrar(B, 'b');
  }

  function panel(origen) {
    var c = leer() || { a: 0, p: 0 };
    foco = origen || d.activeElement;
    if (!M) {
      M = crear('ck-m',
        '<div class="ck-m__c" role="dialog" aria-modal="true" aria-labelledby="ck-mt" tabindex="-1"><h2 id="ck-mt">Configurar cookies</h2>' +
        '<p class="ck-m__s">Elige qué podemos usar. Puedes cambiarlo cuando quieras desde «Configurar cookies», en el pie de página.</p><ul>' +
        '<li><label class="ck-s"><span><b>Necesarias</b><small>Hacen que el sitio funcione y recuerdan tu decisión. Siempre activas.</small></span><input type="checkbox" role="switch" checked disabled></label></li>' +
        '<li><label class="ck-s"><span><b>Analítica</b><small>Google Analytics y Microsoft Clarity: cuentan visitas y muestran cómo se usa el sitio.</small></span><input type="checkbox" role="switch" data-k="a"></label></li>' +
        '<li><label class="ck-s"><span><b>Publicidad</b><small>Meta: mide y mejora nuestros anuncios en Facebook e Instagram.</small></span><input type="checkbox" role="switch" data-k="p"></label></li></ul>' +
        '<div class="ck-m__b"><button type="button" class="ck__btn ck__btn--p" data-ck="g">Guardar selección</button><button type="button" class="ck__btn" data-ck="x">Cancelar</button></div>' +
        '<p class="ck-m__a"><a href="/cookies/">Leer la política de cookies</a></p></div>', {});
      M.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('[data-ck]'); a = a && a.getAttribute('data-ck');
        if (a === 'g') decidir(M.querySelector('[data-k=a]').checked, M.querySelector('[data-k=p]').checked);
        else if (a === 'x' || e.target === M) cerrar();
      });
      M.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
        if (e.key !== 'Tab') return;
        var f = M.querySelectorAll('button,a[href],input:not(:disabled)'), p = f[0], u = f[f.length - 1];
        if (e.shiftKey && (d.activeElement === p || d.activeElement === M.firstChild)) { e.preventDefault(); u.focus(); }
        else if (!e.shiftKey && d.activeElement === u) { e.preventDefault(); p.focus(); }
      });
      d.body.appendChild(M);
    }
    M.querySelector('[data-k=a]').checked = !!c.a;
    M.querySelector('[data-k=p]').checked = !!c.p;
    mostrar(M, 'm');
    M.firstChild.focus();
  }
  function cerrar() {
    if (!M) return;
    ocultar(M, 'm');
    if (foco && d.body.contains(foco)) foco.focus();
  }

  function aviso2(txt) {
    if (!N) { N = crear('ck-n', '', { role: 'status', 'aria-live': 'polite' }); d.body.appendChild(N); }
    clearTimeout(tN);
    setTimeout(function () { N.textContent = txt; }, 60);
    mostrar(N, 'n');
    tN = setTimeout(function () { ocultar(N, 'n'); }, 6500);
  }

  function decidir(a, p) {
    var antes = leer(), c = guardar(a, p);
    /* retiro = dejó sin permiso algo que esta página ya había cargado: los scripts viejos siguen vivos hasta recargar */
    var retiro = (!c.a && cargado.c || !c.a && cargado.g || !c.p && cargado.m) && antes;
    aplicar(c);
    if (M && M.classList.contains('ck--ver')) { ocultar(M, 'm'); }
    if (B) { ocultar(B, 'b'); var b = B; B = null; setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 700); }
    aviso2(retiro ? 'Listo. Dejamos de medir; el cambio se aplica por completo al recargar la página.' : 'Listo, guardamos tu decisión.');
  }

  /* ---------- Arranque ---------- */
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-config-cookies]');
    if (t) { e.preventDefault(); panel(t); }
  });
  
  if (RD_IDS.ga4) { w.dataLayer = w.dataLayer || []; gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); }
  var c0 = leer();
  if (c0) aplicar(c0); else aviso();
})();
