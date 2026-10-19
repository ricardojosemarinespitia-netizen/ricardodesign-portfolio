/* Panel de diagnóstico (solo con ?diag=1 o #diag; lo carga el arranque de index.html tras load).
   Muestra en el teléfono: navegador/WebView, WebGL, formatos, APIs, viewport, estado de cada pieza 3D (window.RDCAP.estados)
   y los últimos 20 errores capturados. ES5. No toca nada de la página. */
(function () {
  var d = document, C = window.RDCAP || {}, ua = navigator.userAgent || '';
  function si(b) { return b ? 'sí' : 'no'; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function imagen(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i.naturalWidth > 0); }; i.onerror = function () { res(false); }; i.src = src; }); }
  var v = d.createElement('video'), puede = function (t) { try { return v.canPlayType(t) || 'no'; } catch (e) { return 'no'; } };
  var fmt = { avif: null, webp: null, mp4: puede('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'), webm: puede('video/webm; codecs="vp9"') || puede('video/webm; codecs="vp8"') };
  Promise.all([imagen('assets/web/garantia3d/v2/reportes.avif'), imagen('assets/web/garantia3d/v2/reportes.webp')]).then(function (r) { fmt.avif = r[0]; fmt.webp = r[1]; pintar(); });

  /* también captura lo que salga por console.error / console.warn desde ahora */
  ['error', 'warn'].forEach(function (k) { var o = console[k]; console[k] = function () { try { C.error && C.error(k + ': ' + [].slice.call(arguments).map(function (a) { return a && a.message ? a.message : String(a); }).join(' ').slice(0, 200)); } catch (e) {} return o.apply(console, arguments); }; });

  var panel = d.createElement('section');
  panel.id = 'rd-diag'; panel.setAttribute('aria-label', 'Diagnóstico técnico');
  panel.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;max-height:62vh;overflow:auto;-webkit-overflow-scrolling:touch;background:#1E1E1E;color:#EBEBEB;font:12px/1.45 ui-monospace,Menlo,Consolas,monospace;padding:12px 14px calc(12px + env(safe-area-inset-bottom,0px));box-shadow:0 -12px 30px rgba(22,22,22,.5);border-top:2px solid #BDBDBD';
  var pre = d.createElement('pre'); pre.style.cssText = 'margin:0;white-space:pre-wrap;word-break:break-word';
  var barra = d.createElement('div'); barra.style.cssText = 'display:flex;gap:8px;margin:0 0 10px;flex-wrap:wrap';
  function boton(t, f) { var b = d.createElement('button'); b.type = 'button'; b.textContent = t; b.style.cssText = 'min-height:44px;padding:0 14px;border:1px solid #BDBDBD;border-radius:4px;background:#2A2A2A;color:#FAFAFA;font:600 13px Figtree,system-ui,sans-serif'; b.addEventListener('click', f); barra.appendChild(b); return b; }
  var copiar = boton('Copiar diagnóstico', function () {
    var t = pre.textContent;
    function listo() { copiar.textContent = 'Copiado'; setTimeout(function () { copiar.textContent = 'Copiar diagnóstico'; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(listo, function () { selec(); });
    else selec();
    function selec() { var r = d.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); try { d.execCommand('copy'); listo(); } catch (e) {} }
  });
  boton('Cerrar', function () { panel.parentNode && panel.parentNode.removeChild(panel); clearInterval(iv); });
  panel.appendChild(barra); panel.appendChild(pre);
  d.body.appendChild(panel);

  function pintar() {
    var e = C.estados || {}, err = C.errores || [], L = [];
    L.push('ricardodesign.co · diagnóstico ' + new Date().toISOString().slice(0, 19).replace('T', ' '));
    L.push('UA: ' + ua);
    L.push('WebView: ' + (C.webview || 'no (navegador normal)') + ' · clases html: ' + d.documentElement.className);
    L.push('Pantalla: ' + innerWidth + '×' + innerHeight + ' css px · DPR ' + (devicePixelRatio || 1) + ' · pantalla ' + screen.width + '×' + screen.height + (matchMedia('(prefers-reduced-motion: reduce)').matches ? ' · movimiento reducido' : ''));
    L.push('WebGL2: ' + si(C.webgl2) + ' · WebGL1: ' + si(C.webgl1 || C.webgl2) + ' · pinta: ' + si(C.pinta) + ' · shader: ' + si(C.shader) + ' · MAX_TEXTURE_SIZE: ' + (C.maxTex || '-'));
    L.push('GPU: ' + (C.renderer || '(no expuesta)') + (C.vendor ? ' · ' + C.vendor : '') + (C.software ? ' · RENDER POR SOFTWARE' : ''));
    L.push('3D en vivo: ' + si(C.puede3d && C.puede3d()) + (C.motivo ? ' (' + C.motivo + ')' : ''));
    L.push('Imágenes: AVIF ' + (fmt.avif === null ? '…' : si(fmt.avif)) + ' · WebP ' + (fmt.webp === null ? '…' : si(fmt.webp)) + ' · Video: mp4/H.264 ' + fmt.mp4 + ' · webm ' + fmt.webm);
    L.push('APIs: IntersectionObserver ' + si(C.io) + (C.io ? '' : ' (polyfill)') + ' · ResizeObserver ' + si(C.ro) + (C.ro ? '' : ' (polyfill)') + ' · requestIdleCallback ' + si(C.ric) + ' · import() ' + si(C.modulo) + ' · saveData ' + si(C.saveData) + ' · memoria ' + (navigator.deviceMemory || '?') + ' GB · núcleos ' + (navigator.hardwareConcurrency || '?'));
    L.push('');
    L.push('PIEZAS 3D');
    ['hero', 'plataformas', 'dispositivos', 'garantia', 'iconos', 'servicios'].forEach(function (k) { L.push('  ' + (k + '          ').slice(0, 13) + (e[k] || '-')); });
    L.push('');
    L.push('ERRORES (' + err.length + ')' + (err.length ? '' : ' ninguno'));
    err.forEach(function (x, i) { L.push('  ' + (i + 1) + '. ' + x); });
    pre.innerHTML = esc(L.join('\n'));
  }
  pintar();
  var iv = setInterval(pintar, 1000);
})();
