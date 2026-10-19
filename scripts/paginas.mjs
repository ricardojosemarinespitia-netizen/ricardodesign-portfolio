/* ============================================================================
   paginas.mjs — Contenido y plantillas de cada página.
   Copy según PLAN_DISENO_FINAL.md. Lo marcado [POR VALIDAR] está listado en
   LEEME.md > Pendientes. No hay cifras de resultados, testimonios ni IDs
   inventados: si falta un dato, la pieza no se renderiza.
   ========================================================================= */

export function paginas(ctx, crearLinks) {
  const { S, C, OPC, esc, wa, svc, visibles, proyectos, casoIndexable, metricasOk, testimonios, ETQ, SITIO, ICO_WA, EXT, FLECHA } = ctx;
  const out = [];
  const NEGOCIO_ID = SITIO + '/#negocio';

  /* ================= Componentes ================= */
  const btnWa = (txt, label, cls = 'btn btn-pri', servicio = '', ubic = '') =>
    `<a class="${cls}" href="${wa(txt)}" target="_blank" rel="noopener noreferrer"${servicio ? ` data-servicio="${servicio}"` : ''}${ubic ? ` data-ubicacion="${ubic}"` : ''}>${esc(label)} ${FLECHA}${EXT}</a>`;

  const cabSec = (kicker, h2, intro = '', id = '') =>
    `<div class="sec-head rv">${kicker ? `<p class="kicker">${kicker}</p>` : ''}<h2 class="h-sec"${id ? ` id="${id}"` : ''}>${h2}</h2>${intro ? `<p class="lead">${intro}</p>` : ''}</div>`;

  const ilu = {
    web: '<div class="svc-ilu" aria-hidden="true"><span class="etq">Ejemplo</span><div class="ilu-web"><i></i><i></i><i></i><u></u></div></div>',
    mantenimiento: '<div class="svc-ilu" aria-hidden="true"><span class="etq">Ejemplo</span><div class="ilu-mant"><span>Precio actualizado</span><span>Sección nueva publicada</span><span>Dominio renovado</span></div></div>',
    ads: '<div class="svc-ilu" aria-hidden="true"><span class="etq">Ejemplo</span><div class="ilu-ads"><span>Público</span><span>Medición</span><span>Campaña</span><span>Informe</span></div></div>',
    contenido: '<div class="svc-ilu" aria-hidden="true"><span class="etq">Ejemplo</span><div class="ilu-cont"><i></i><i></i><i></i></div></div>'
  };

  const SVC_AC = { web: 'morado', mantenimiento: 'azul', ads: 'naranja', contenido: 'turquesa' };
  const svcCard = (s, i, L) => `<article class="svc-card svc2 rv" data-acento="${SVC_AC[s.id]}">
  ${s.nuevo ? '<span class="svc-sello">Nuevo</span>' : ''}
  <span class="svc-icono2" aria-hidden="true">${ICO_SVC[s.id] || ''}</span>
  <h3 class="svc2-h">${esc(s.nombre)}</h3>
  <p class="svc-frase">${esc(s.frase)}</p>
  <p class="svc-precio"><b>${esc(s.precio.texto)}</b></p>
  <div class="svc2-pie">
    ${btnWa(s.whatsappTexto, 'Cotizar ' + s.nombre.toLowerCase(), 'btn btn-pri btn-sm', s.id, 'tarjeta-servicio')}
    <a class="enlace svc2-mas" href="${L.a(s.ruta)}" data-modal="svm-${s.id}" aria-haspopup="dialog">Ver qué incluye<span class="sr-only"> en ${esc(s.nombre)}</span> <span class="fl" aria-hidden="true">→</span></a>
  </div>
  <template id="svm-${s.id}">
    <p class="pj-eyebrow">Servicio</p>
    <h2 class="pjm-h">${esc(s.nombre)}</h2>
    <p class="pjm-p">${esc(s.frase)}</p>
    <h3 class="pjm-sub">Qué incluye</h3>
    <ul class="lista-check">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    <p class="svc-precio svc-precio--modal"><b>${esc(s.precio.texto)}</b> <span>${esc(s.precio.detalle)}</span></p>
    <div class="pjm-links">${btnWa(s.whatsappTexto, 'Cotizar ' + s.nombre.toLowerCase(), 'btn btn-pri btn-sm', s.id, 'modal-servicio')}<a class="btn btn-sec btn-sm" href="${L.a(s.ruta)}">Ver página completa <span class="fl" aria-hidden="true">→</span></a></div>
  </template>
</article>`;

  const imgProyecto = (p, eager = false, r = '') => {
    // Rutas relativas a la raíz del sitio (assets/img/...) se ajustan a la profundidad de la página.
    const fx = (u) => (!u || /^(https?:|\/)/.test(u) ? u : r + u);
    const im = { ...p.imagen, desktop: fx(p.imagen.desktop), movil: fx(p.imagen.movil) };
    const lazy = eager ? '' : ' loading="lazy"';
    const pos = im.foco ? ` style="object-position:${esc(im.foco)}"` : '';
    const dims = im.ancho && im.alto ? ` width="${im.ancho}" height="${im.alto}"` : '';
    const conExt = /^https?:|\.(jpe?g|png|webp|avif)$/i.test(im.desktop);
    if (conExt) {
      const src = im.movil ? `<source media="(max-width: 767px)" srcset="${esc(im.movil)}">` : '';
      return `<picture>${src}<img src="${esc(im.desktop)}" alt="${esc(im.alt)}"${dims}${lazy} decoding="async"${pos}></picture>`;
    }
    // Ruta sin extensión → variantes optimizadas (-480/-800/-1200 en avif/webp/jpg)
    const m = im.movil || im.desktop, dsk = im.desktop;
    return `<picture>
<source media="(max-width: 767px)" type="image/avif" srcset="${m}-480.avif 480w, ${m}-800.avif 800w" sizes="100vw">
<source media="(max-width: 767px)" type="image/webp" srcset="${m}-480.webp 480w, ${m}-800.webp 800w" sizes="100vw">
<source type="image/avif" srcset="${dsk}-800.avif 800w, ${dsk}-1200.avif 1200w" sizes="(min-width:1200px) 33vw, 50vw">
<source type="image/webp" srcset="${dsk}-800.webp 800w, ${dsk}-1200.webp 1200w" sizes="(min-width:1200px) 33vw, 50vw">
<img src="${dsk}-800.jpg" alt="${esc(im.alt)}"${dims}${lazy} decoding="async"${pos}></picture>`;
  };

  const pjCard = (p, L, i = 0) => `<article class="pj-card rv rv-d${i % 3}" data-servicios="${p.servicios.join(' ')}">
  <a class="pj-media" href="${L.a('proyectos/' + p.slug + '/')}" tabindex="-1" aria-hidden="true"><span class="pj-ini">${esc(p.cliente.charAt(0))}</span>${imgProyecto(p, false, L.r)}<span class="pj-ver">Ver caso →</span></a>
  <div class="pj-body">
    <p class="pj-eyebrow">${esc(p.cliente)} · ${esc(p.rubro)}</p>
    <h3><a href="${L.a('proyectos/' + p.slug + '/')}">${esc(p.titulo)}<span class="sr-only"> para ${esc(p.cliente)}</span></a></h3>
    <p>${esc(p.resumen)}</p>
    <ul class="pj-tags" aria-label="Servicios">${p.servicios.map((s) => `<li class="chip">${ETQ[s]}</li>`).join('')}</ul>
    <div class="pj-links"><a class="enlace" href="${L.a('proyectos/' + p.slug + '/')}">Ver caso<span class="sr-only"> de ${esc(p.cliente)}</span> <span class="fl" aria-hidden="true">→</span></a>${p.url ? `<a class="enlace" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Visitar sitio${EXT} <span aria-hidden="true">↗</span></a>` : ''}</div>
  </div>
</article>`;


  /* Fila zig-zag de proyecto (estilo editorial: imagen grande + barra CTA + insignia) */
  const ICO_SVC = {
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>',
    ads: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l6 4V6L7 10H4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    contenido: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><path d="M16.5 7.5h.01"/></svg>',
    mantenimiento: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/></svg>'
  };
  const pjFila = (p, L, i = 0, hN = 3) => `<article class="pj-fila" data-servicios="${p.servicios.join(' ')}">
  <div class="pj-fila-media rv">
    <div class="pj-fila-img" data-par="0.06"><span class="pj-ini" aria-hidden="true">${esc(p.cliente.charAt(0))}</span>${imgProyecto(p, false, L.r)}</div>
    <span class="pj-insignia" aria-hidden="true">${ICO_SVC[p.servicios[0]] || ICO_SVC.web}</span>
    <a class="pj-barra" href="${L.a('proyectos/' + p.slug + '/')}">Ver caso<span class="sr-only">: ${esc(p.titulo)} para ${esc(p.cliente)}</span> <span aria-hidden="true">→</span></a>
  </div>
  <div class="pj-fila-txt rv rv-d1">
    <p class="pj-eyebrow">${esc(p.cliente)} · ${esc(p.rubro)}</p>
    <h${hN} class="pj-fila-h">${esc(p.titulo)}</h${hN}>
    <p class="pj-fila-p">${esc(p.resumen)}</p>
    ${(() => { const ms = metricasOk(p); const sol = ((p.caso && p.caso.solucion) || []).slice(0, 3);
      if (ms.length) return `<ul class="pj-claves" aria-label="Resultados">${ms.slice(0, 3).map((m) => `<li><b>${esc(m.valor)}</b> ${esc(m.label)} <small>(${esc(m.periodo)})</small></li>`).join('')}</ul>`;
      return sol.length ? `<ul class="pj-claves" aria-label="Qué hicimos">${sol.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''; })()}
    <ul class="pj-tags" aria-label="Servicios">${p.servicios.map((s) => `<li class="chip">${ETQ[s]}</li>`).join('')}</ul>
    ${(p.etiquetas || []).length ? `<ul class="pj-etqs" aria-label="Qué incluye">${p.etiquetas.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
    <div class="pj-links"><a class="enlace" href="${L.a('proyectos/' + p.slug + '/')}">Ver caso<span class="sr-only"> de ${esc(p.cliente)}</span> <span class="fl" aria-hidden="true">→</span></a>${p.url ? `<a class="enlace" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Ver en vivo${EXT} <span aria-hidden="true">↗</span></a>` : ''}</div>
  </div>
</article>`;
  const pjFilas = (ps, L, hN = 3, extra = '') => `<div class="pj-filas">${ps.map((p, i) => pjFila(p, L, i, hN)).join('\n')}${extra}</div>`;

  /* Columnas de capturas en bucle vertical (hero). Decorativas: aria-hidden; los
     proyectos completos y accesibles están en la sección Proyectos. */
  const heroCols = (L) => {
    const ps = proyectos.filter((p) => p.imagen && p.imagen.desktop);
    if (!ps.length) return '';
    const tile = (p) => { const im = /^(https?:|\/)/.test(p.imagen.desktop) ? p.imagen.desktop : L.r + p.imagen.desktop;
      return `<li class="hc-tile"><img src="${esc(/\.(jpe?g|png|webp|avif)$|^https?:/i.test(im) ? im : im + '-800.jpg')}" alt="" width="600" height="400" loading="eager" decoding="async" fetchpriority="low"><span>${esc(p.cliente)}</span></li>`; };
    const col = (k) => { const orden = ps.map((_, j) => ps[(j + k * 2) % ps.length]); const set = orden.map(tile).join('');
      return `<div class="hc-col hc-col--${k % 2 ? 'baja' : 'sube'}"><ul class="hc-track">${set}${set}</ul></div>`; };
    return `<div class="hero-cols" aria-hidden="true">${[0, 1, 2].map(col).join('')}</div>`;
  };

  /* Decoración SVG propia (aria-hidden): estrellas, anillos, garabatos, blobs. */
  const SVGD = {
    estrella: '<svg viewBox="0 0 40 40"><path d="M20 2c1.6 9.6 8.4 16.4 18 18-9.6 1.6-16.4 8.4-18 18-1.6-9.6-8.4-16.4-18-18 9.6-1.6 16.4-8.4 18-18z"/></svg>',
    anillo: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="none" stroke-width="5"/></svg>',
    garabato: '<svg viewBox="0 0 120 40"><path d="M3 30 C 18 4, 30 4, 40 22 S 62 40, 72 18 S 98 2, 117 20" fill="none" stroke-width="5" stroke-linecap="round"/></svg>',
    blob: '<svg viewBox="0 0 200 200"><path d="M44 -58c14 12 25 29 26 47 1 18-9 37-24 49-16 12-37 18-55 13-19-5-34-21-41-40-7-19-5-41 7-55 12-15 33-21 51-22 18-1 31 0 36 8z" transform="translate(100 100)"/></svg>',
    puntos: '<svg viewBox="0 0 60 60"><g>' + [0,1,2,3].map((r)=>[0,1,2,3].map((c)=>`<circle cx="${8+c*15}" cy="${8+r*15}" r="2.6"/>`).join('')).join('') + '</g></svg>',
    flecha: '<svg viewBox="0 0 80 60"><path d="M4 50 C 20 10, 50 4, 72 18" fill="none" stroke-width="4" stroke-linecap="round"/><path d="M60 8 L74 18 L60 28" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const deco = (lista) => `<div class="deco" aria-hidden="true">${lista.map(([t, cls]) => `<span class="dc dc-${t} ${cls}">${SVGD[t]}</span>`).join('')}</div>`;
  const DECOS = {
    a: [['blob', 'p1'], ['estrella', 'p2'], ['puntos', 'p3'], ['anillo', 'p4']],
    b: [['garabato', 'p1'], ['estrella', 'p5'], ['anillo', 'p3'], ['blob', 'p6']],
    c: [['puntos', 'p2'], ['flecha', 'p4'], ['estrella', 'p6'], ['blob', 'p3']],
    d: [['anillo', 'p1'], ['garabato', 'p6'], ['estrella', 'p3'], ['puntos', 'p5']]
  };

  const collage = (L) => {
    const ps = proyectos.filter((p) => p.imagen && p.imagen.desktop);
    if (!ps.length) return '';
    const src = (p) => { const im = /^(https?:|\/)/.test(p.imagen.desktop) ? p.imagen.desktop : L.r + p.imagen.desktop; return /\.(jpe?g|png|webp|avif)$|^https?:/i.test(im) ? im : im + '-800.jpg'; };
    const g = (i) => ps[i % ps.length];
    const img = (p) => `<img src="${esc(src(p))}" alt="" width="600" height="400" decoding="async" fetchpriority="low">`;
    return `<div class="collage" aria-hidden="true" data-collage>
  ${heroCols(L)}
  <figure class="mk mk-nav"><div class="mk-barra"><i></i><i></i><i></i><span>${esc((g(0).url || '').replace(/^https?:\/\//, ''))}</span></div>${img(g(0))}</figure>
  <figure class="mk mk-tel"><div class="mk-notch"></div>${img(g(1))}</figure>
  <span class="flt f1"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>Diseño web</span>
  <span class="flt f2"><svg viewBox="0 0 24 24"><path d="M4 10v4h3l6 4V6L7 10H4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/></svg>Publicidad</span>
  <span class="flt f3"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></svg>Pagos</span>
  <span class="flt f4"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/></svg>Contenido</span>
  <span class="mini mi1"><b>✓ Pago aprobado</b><small>Ejemplo</small></span>
  <span class="mini mi2"><b>Nuevo pedido</b><small>Ejemplo</small></span>
  <span class="dc dc-estrella s1">${SVGD.estrella}</span><span class="dc dc-estrella s2">${SVGD.estrella}</span><span class="dc dc-anillo s3">${SVGD.anillo}</span><span class="dc dc-garabato s4">${SVGD.garabato}</span>
</div>`;
  };

  /* Mosaico de proyectos: imagen de fondo + texto encima; detalle en ventana emergente.
     Sin JS, "Ver caso" es un enlace normal a la página del caso. */
  const ALTO = [3, 2, 2, 3, 2, 3];
  const pjMos = (p, L, i) => `<article class="pj-mos rv" data-servicios="${p.servicios.join(' ')}" data-acento="${esc(p.acento || 'azul')}" style="--filas:${ALTO[i % ALTO.length]}">
  <div class="pj-mos-img"><span class="pj-ini" aria-hidden="true">${esc(p.cliente.charAt(0))}</span>${imgProyecto(p, false, L.r)}</div>
  <span class="pj-mos-sticker">Proyecto real</span>
  <div class="pj-mos-txt">
    <p class="pj-mos-eyebrow">${esc(p.cliente)} · ${esc(p.rubro)}</p>
    <h3 class="pj-mos-h">${esc(p.titulo)}</h3>
    ${p.frase ? `<p class="pj-mos-frase">${esc(p.frase)}</p>` : ''}
    <a class="pj-mos-btn" href="${L.a('proyectos/' + p.slug + '/')}" data-modal="pjm-${p.slug}" aria-haspopup="dialog">Ver caso<span class="sr-only"> de ${esc(p.cliente)}</span> <span aria-hidden="true">→</span></a>
  </div>
  <template id="pjm-${p.slug}">
    <p class="pj-eyebrow">${esc(p.cliente)} · ${esc(p.rubro)}</p>
    <h2 class="pjm-h">${esc(p.titulo)} para ${esc(p.cliente)}</h2>
    <p class="pjm-p">${esc(p.resumen)}</p>
    ${(p.caso && p.caso.solucion && p.caso.solucion.length) ? `<h3 class="pjm-sub">Qué hicimos</h3><ul class="lista-check">${p.caso.solucion.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${metricasOk(p).length ? `<h3 class="pjm-sub">Resultados</h3><ul class="lista-check">${metricasOk(p).map((m) => `<li><strong>${esc(m.label)}:</strong> ${esc(m.valor)} (${esc(m.periodo)}; fuente: ${esc(m.fuente)})</li>`).join('')}</ul>` : ''}
    <ul class="pj-tags" aria-label="Servicios">${p.servicios.map((s) => `<li class="chip">${ETQ[s]}</li>`).join('')}</ul>
    ${(p.etiquetas || []).length ? `<ul class="pj-etqs" aria-label="Qué incluye">${p.etiquetas.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
    <div class="pjm-links"><a class="btn btn-pri btn-sm" href="${L.a('proyectos/' + p.slug + '/')}">Ver página completa del caso <span class="fl" aria-hidden="true">→</span></a>${p.url ? `<a class="btn btn-sec btn-sm" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Ver en vivo${EXT} ↗</a>` : ''}</div>
  </template>
</article>`;
  const pjMosaico = (ps, L) => `<div class="pj-mosaico">${ps.map((p, i) => pjMos(p, L, i)).join('\n')}<div class="pj-mas pj-mos-mas rv" style="--filas:2"><b>Más proyectos en camino</b><p>Estamos documentando nuevos casos. Se anexarán aquí a medida que los clientes los aprueben.</p><a class="enlace" href="${L.a('#contacto')}">¿Quieres que el próximo sea el tuyo? <span class="fl" aria-hidden="true">→</span></a></div></div>
<div class="pj-modal" id="pj-modal" role="dialog" aria-modal="true" aria-labelledby="pj-modal-t" hidden>
  <div class="menu-fondo" data-cerrar-modal></div>
  <div class="pj-modal-panel"><button class="btn-redondo pj-modal-x" type="button" data-cerrar-modal aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div data-modal-cuerpo></div></div>
</div>`;

  const pjMas = (L) => `<div class="pj-mas rv"><b>Más proyectos en camino</b><p>Estamos documentando nuevos casos. Se anexarán aquí a medida que los clientes los aprueben.</p><a class="enlace" href="${L.a('#contacto')}">¿Quieres que el próximo sea el tuyo? <span class="fl" aria-hidden="true">→</span></a></div>`;

  const DEMOS = {
    pago: { tab: 'Pago en línea', h: 'El cliente paga sin salir de tu página', alt: 'El cliente elige tarjeta, PSE o Nequi, paga en línea y recibe la confirmación al instante.', barra: 'Checkout · pago en línea',
      html: '<div class="d-pago"><div class="fila"><span>Collar de ejemplo</span><b>$000.000</b></div><div class="metodos"><span>Tarjeta</span><span>PSE</span><span>Nequi</span></div><div class="btnp">Pagar ahora</div></div><div class="d-pago ok"><div><b>✓</b>Pago aprobado<br><small>Pedido #0001 · ejemplo</small></div></div>' },
    correo: { tab: 'Correo automático', h: 'Confirmación en el correo, sin que muevas un dedo', alt: 'Apenas se confirma el pago, el cliente recibe un correo con el resumen de su pedido.', barra: 'Bandeja de entrada',
      html: '<div class="d-mail"><div class="m"><i>R</i><span><b>Tu pedido fue confirmado</b><small>Gracias por tu compra. Este es el resumen…</small></span><small>ahora</small></div><div class="m"><i>R</i><span><b>Bienvenida al club</b><small>Tu código de descuento es…</small></span><small>ayer</small></div><div class="m"><i>R</i><span><b>Tu pedido va en camino</b><small>Número de guía…</small></span><small>lun</small></div></div>' },
    hoja: { tab: 'Registro de ventas', h: 'Una hoja de cálculo que se llena sola', alt: 'Cada venta queda registrada automáticamente en una hoja de cálculo con fecha, producto y valor.', barra: 'Ventas · hoja de cálculo',
      html: '<table class="d-hoja"><thead><tr><th>Fecha</th><th>Producto</th><th>Valor</th></tr></thead><tbody><tr class="n"><td>Hoy</td><td>Producto A</td><td>$000.000</td></tr><tr><td>Ayer</td><td>Producto B</td><td>$000.000</td></tr><tr><td>Lun</td><td>Producto C</td><td>$000.000</td></tr><tr><td>Dom</td><td>Producto A</td><td>$000.000</td></tr></tbody></table>' },
    aviso: { tab: 'Aviso al vendedor', h: 'Te enteras de cada pedido al instante', alt: 'El vendedor recibe un aviso con los datos del pedido para despacharlo.', barra: 'Notificaciones',
      html: '<div class="d-aviso"><div class="b"><b>Nuevo pedido #0001</b><br><small>Collar de ejemplo · pago aprobado</small></div><div class="b"><b>Datos de envío listos</b><br><small>Ciudad de ejemplo · revisar y despachar</small></div></div>' }
  };
  const simTabs = (ids, pre) => `<div class="sim-cab">
  <div class="tabs" role="tablist" aria-label="Simulaciones">${ids.map((id, i) => `<button class="tab" type="button" role="tab" id="${pre}-t-${id}" aria-controls="${pre}-p-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${DEMOS[id].tab}</button>`).join('')}</div>
  <button class="btn-pausa" type="button" data-pausa aria-pressed="false"><svg viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="2" width="3" height="10"/><rect x="8" y="2" width="3" height="10"/></svg><span data-pausa-txt>Pausar animaciones</span></button>
</div>
${ids.map((id, i) => `<div class="sim-panel" role="tabpanel" id="${pre}-p-${id}" aria-labelledby="${pre}-t-${id}"${i ? ' hidden' : ''} tabindex="0">
  <div class="ventana" aria-hidden="true"><div class="ventana-barra"><i></i><i></i><i></i><em>${DEMOS[id].barra}</em></div><span class="chip chip-sim">Simulación</span><div class="ventana-cuerpo">${DEMOS[id].html}</div></div>
  <div class="demo-alt"><h3>${DEMOS[id].h}</h3><p><span class="chip chip-sim">Simulación</span> ${DEMOS[id].alt}</p></div>
</div>`).join('\n')}`;

  const faq = (items) => `<div class="faq">${items.map(([q, a]) => `<details class="rv"><summary>${esc(q)}</summary><div class="r"><p>${a}</p></div></details>`).join('')}</div>`;
  const faqLd = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });

  const paqCards = (s) => {
    const ps = visibles(s);
    if (!ps.length) return '';
    return `<div class="paq-grid${ps.length === 3 ? ' paq-grid--3' : ''}">${ps.map((p, i) => `<article class="paq${p.destacado ? ' paq--dest' : ''} rv rv-d${i % 3}">
  ${p.destacado ? '<span class="chip paq-dest-tag">Recomendado</span>' : ''}
  <h3>${esc(p.nombre)}${p.estado === 'por_validar' ? ' <span class="chip">Por validar</span>' : ''}</h3>
  <div><p class="paq-precio paq-precio--cotiza">${esc(p.precio)}</p><p class="paq-unidad">${esc(p.unidad)}</p></div>
  <ul class="lista-check">${p.incluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  ${btnWa(`Hola Ricardo, quiero cotizar ${/^plan /i.test(p.nombre) ? 'el ' + p.nombre : 'el plan ' + p.nombre.toLowerCase()} de ${s.nombreLargo}.`, 'Cotizar este plan', p.destacado ? 'btn btn-claro' : 'btn btn-sec', s.id, 'paquete')}
</article>`).join('')}</div>`;
  };

  const migas = (L, items) => `<nav class="migas wrap" aria-label="Ruta de navegación"><ol>${items.map(([t, r], i) => i === items.length - 1 ? `<li><span aria-current="page">${esc(t)}</span></li>` : `<li><a href="${L.a(r)}">${esc(t)}</a></li>`).join('')}</ol></nav>`;
  const migasLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([t, r], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: SITIO + '/' + r })) });

  const ctaFinal = (h2, p, msg, label, servicio) => `<section class="sec"><div class="wrap"><div class="cta-final rv"><h2>${h2}</h2><p>${p}</p><div class="acciones">${btnWa(msg, label, 'btn btn-claro', servicio, 'cta-final')}</div></div></div></section>`;

  const relacionados = (L, excluir) => `<section class="sec" aria-labelledby="rel-h"><div class="wrap">${cabSec('Combínalo', 'Servicios que funcionan <em>mejor juntos</em>', '', 'rel-h')}<div class="relacionados">${S.servicios.filter((s) => s.id !== excluir).map((s) => `<a class="rel rv" href="${L.a(s.ruta)}"><b>${esc(s.nombre)}</b><span>${esc(s.frase)}</span><span class="enlace" aria-hidden="true">Ver detalle <span class="fl">→</span></span></a>`).join('')}</div></div></section>`;

  const proyectosDe = (id, L) => {
    const ps = proyectos.filter((p) => p.servicios.includes(id));
    if (!ps.length) return '';
    return `<section class="sec" aria-labelledby="pj-rel-h"><div class="wrap">${cabSec('Proyectos', 'Trabajos con <em>este servicio</em>', '', 'pj-rel-h')}<div class="pj-grid">${ps.map((p, i) => pjCard(p, L, i)).join('')}</div></div></section>`;
  };

  const serviceLd = (s, url) => ({
    '@context': 'https://schema.org', '@type': 'Service', name: s.nombreLargo, description: s.frase, url,
    provider: { '@id': NEGOCIO_ID }, areaServed: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Colombia'],
  });

  /* ---------- formulario WhatsApp genérico ---------- */
  const opciones = (name, label, vals, req = false) => `<fieldset data-label="${esc(label)}"><legend>${esc(label)}</legend><div class="opciones">${vals.map((v, i) => `<label class="opcion"><input type="radio" name="${name}" value="${esc(v)}"${req && i === 0 ? ' required' : ''}><span>${esc(v)}</span></label>`).join('')}</div></fieldset>`;
  const checks = (name, label, vals) => `<fieldset data-label="${esc(label)}"><legend>${esc(label)}</legend><div class="opciones">${vals.map((v) => `<label class="opcion"><input type="checkbox" name="${name}" value="${esc(v)}"><span>${esc(v)}</span></label>`).join('')}</div></fieldset>`;
  const formWa = (L, intro, campos, evento, idp) => `<form class="brief" method="get" action="https://wa.me/${C.whatsapp}" target="_blank" data-wa-form data-intro="${esc(intro)}" data-evento="${evento}" aria-describedby="${idp}-nota">
  <input type="hidden" name="text" value="${esc(intro)}">
  ${campos}
  <div class="brief-vista" aria-live="polite"><b>Así se verá tu mensaje:</b><span data-wa-vista>${esc(intro)}</span></div>
  <button class="btn btn-pri" type="submit">Enviar por WhatsApp ${FLECHA}<span class="sr-only"> (se abre en otra pestaña)</span></button>
  <p class="legal-nota" id="${idp}-nota">Al enviar, abrirás WhatsApp con este mensaje. No guardamos datos en este sitio. Tratamos tus datos según nuestra <a href="${L.a('privacidad/')}">Política de privacidad</a>.</p>
</form>`;

  /* ================= HOME ================= */
  {
    const L = crearLinks('index.html');
    const FAQ = [
      ['¿Cuánto cuesta una página web?', 'Depende de las secciones y de las funciones (pagos, correos automáticos, catálogo). Te enviamos una cotización a la medida en 24 horas hábiles.'],
      ['¿Cuánto se demora?', '10 días hábiles desde que recibimos toda tu información (textos, fotos y accesos).'],
      ['¿El dominio y el hosting están incluidos?', 'No. Se cobran aparte y quedan a tu nombre.'],
      ['¿Cuánto debo invertir en Meta Ads?', 'La inversión se paga directo a Meta y es aparte de nuestros honorarios. En la cotización te recomendamos un monto diario según tu objetivo, para que la campaña tenga datos útiles.'],
      ['¿Me garantizan ventas?', 'Las ventas son el objetivo que medimos contigo, pero nadie controla el mercado ni el algoritmo de Meta, y por eso no te prometemos una cifra. Garantizamos lo que depende de nosotros: lo entregable, los plazos, los reportes y los ajustes quedan escritos desde el primer día. Garantía sujeta a las condiciones del contrato.'],
      ['¿De quién son las cuentas?', 'Tuyas. Business Manager, píxel, Google Analytics y el código final quedan a tu nombre (el código, al completar el pago).'],
      ['¿Hacen el contenido para los anuncios?', 'Sí, con el servicio de Contenido para redes. La gestión de Meta Ads por sí sola trabaja con contenido que ya tengas publicado.'],
      ['¿Trabajan fuera de Bucaramanga?', 'Sí, atendemos clientes en toda Colombia de forma remota.']
    ];
    const destacados = proyectos.filter((p) => p.destacado).slice(0, 3);
    const PRECIO_CORTO = { web: 'Cotización en 24 h', mantenimiento: 'Se cotiza', ads: 'Se cotiza', contenido: 'Se cotiza' };
    const cuerpo = `
<span id="hero" class="ancla-vieja"></span>
<section class="hero" id="inicio" aria-labelledby="h1">
  <div class="hero-luces" aria-hidden="true"><i class="o1"></i><i class="o2"></i><i class="o3"></i></div>
  <p class="hero-wordmark" aria-hidden="true" data-wordmark><span class="wm-pal"><i style="--i:0">R</i><i style="--i:1">i</i><i style="--i:2">c</i><i style="--i:3">a</i><i style="--i:4">r</i><i style="--i:5">d</i><i style="--i:6">o</i></span> <span class="wm-pal"><i style="--i:7">D</i><i style="--i:8">e</i><i style="--i:9">s</i><i style="--i:10">i</i><i style="--i:11">g</i><i style="--i:12">n</i></span></p>
  <div class="wrap">
   <div class="hero-split">
    <div class="hero-txt">
    <p class="kicker hero-eyebrow">Estudio digital en Bucaramanga</p>
    <h1 id="h1" class="h1-gigante"><span class="ln l1"><span>Páginas web,</span></span> <span class="ln l2"><span>publicidad en Meta</span></span> <span class="ln l3"><span>y contenido para redes</span></span> <span class="ln l4"><span>que <em class="clave">venden</em></span></span></h1>
    <p class="hero-desc">Diseñamos tu página, la conectamos a pagos, correos y registros automáticos, y llevamos clientes con anuncios medidos y contenido que se ve profesional.</p>
    <div class="acciones">${btnWa(C.whatsappGeneral, 'Cotizar mi proyecto', 'btn btn-pri btn-pulso', 'general', 'hero')}<a class="btn btn-sec" href="#servicios">Ver servicios <span class="fl" aria-hidden="true">→</span></a></div>
    </div>
    ${collage(L)}
   </div>
    <ul class="hechos">
      <li class="hecho rv"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><div><b>10 días hábiles</b><span>para entregar tu página web</span></div></li>
      <li class="hecho rv rv-d1"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg><div><b>Pagos en línea con Wompi</b><span>cobra desde tu propia página</span></div></li>
      <li class="hecho rv rv-d2"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/></svg><div><b>Cuentas a tu nombre</b><span>píxel, Business Manager y analítica</span></div></li>
    </ul>
  </div>
</section>
<div class="cinta" aria-hidden="true"><div class="cinta-pista">${[0, 1].map(() => '<span>Páginas web</span><span>Meta Ads</span><span>Contenido para redes</span><span>Pagos en línea</span><span>Correos automáticos</span><span>Hojas de cálculo que se llenan solas</span><span>Informes claros</span>').join('')}</div></div>

<span id="services" class="ancla-vieja"></span>
<section class="sec" id="servicios" aria-labelledby="servicios-h">
  <div class="wrap">
    ${cabSec('Servicios', 'Lo que hacemos <em>por tu negocio</em>', 'Cuatro servicios que funcionan solos o combinados. Todo se cotiza según tu negocio; la inversión en anuncios se paga directamente a Meta.', 'servicios-h')}
    <div class="svc-vistas" role="group" aria-label="Vista de servicios (temporal)"><button type="button" class="tab" data-vista-btn="cuadricula" aria-pressed="true">Cuadrícula</button><button type="button" class="tab" data-vista-btn="carrusel" aria-pressed="false">Carrusel</button></div>
    <div class="svc-carrusel" data-svc-vista="cuadricula">
      <div class="svc-grid" data-svc-pista tabindex="-1">${S.servicios.map((s, i) => svcCard(s, i, L)).join('\n')}</div>
      <div class="svc-ctrl"><button type="button" class="btn-redondo" data-car="prev" aria-label="Servicio anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="svc-puntos" data-car-puntos></span><button type="button" class="btn-redondo" data-car="next" aria-label="Servicio siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div>
    </div>

    <div class="plan rv" data-plan>
      <div>
        <p class="kicker">Arma tu plan</p>
        <h3>¿Contenido + publicidad? Los anuncios rinden más con piezas hechas para pauta.</h3>
        <p>Elige lo que necesitas y te llega a WhatsApp un mensaje listo para enviar. Pregunta por el plan combinado.</p>
        <fieldset><legend>Servicios</legend><div class="toggles">${S.servicios.map((s) => `<button class="toggle" type="button" aria-pressed="false" data-nombre="${esc(s.nombre)}" data-precio="${esc(PRECIO_CORTO[s.id])}">${esc(s.nombre)}</button>`).join('')}</div></fieldset>
      </div>
      <div class="plan-res" aria-live="polite">
        <h4>Tu selección</h4>
        <ul class="plan-lista"><li class="vacio">Elige uno o varios servicios.</li></ul>
        <a class="btn btn-pri" style="width:100%" href="${wa(C.whatsappGeneral)}" target="_blank" rel="noopener noreferrer" data-plan-enviar data-ubicacion="arma-tu-plan">${ICO_WA}Cotizar por WhatsApp${EXT}</a>
        <p class="nota">Todo se cotiza según tu negocio, también los paquetes combinados.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec" id="como-trabajamos" aria-labelledby="proceso-h">
  <div class="wrap">
    ${cabSec('Proceso', 'Cómo <em>trabajamos</em>', 'Un proceso corto y claro, sin sorpresas.', 'proceso-h')}
    <ol class="pl-lista">
      <li class="pl-paso rv"><span class="pl-num" aria-hidden="true">01</span><div class="pl-txt"><h3><span class="pl-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v10H9l-5 4z"/></svg></span>Conversación</h3><p>Nos cuentas tu negocio por WhatsApp o en una llamada de 20 minutos. Te enviamos la cotización en 24 horas hábiles.</p></div></li>
      <li class="pl-paso rv"><span class="pl-num" aria-hidden="true">02</span><div class="pl-txt"><h3><span class="pl-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></svg></span>Anticipo e insumos</h3><p>Con el 50 % de anticipo y tus textos, fotos y accesos, empieza el conteo de entrega.</p></div></li>
      <li class="pl-paso rv"><span class="pl-num" aria-hidden="true">03</span><div class="pl-txt"><h3><span class="pl-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/></svg></span>Diseño y revisiones</h3><p>Te mostramos avances y ajustamos contigo antes de publicar.</p></div></li>
      <li class="pl-paso rv"><span class="pl-num" aria-hidden="true">04</span><div class="pl-txt"><h3><span class="pl-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3c3 2 5 6 5 10l-2 3H9l-2-3c0-4 2-8 5-10z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 18l-2 3M15 18l2 3"/></svg></span>Publicación y acompañamiento</h3><p>Publicamos, verificamos que todo funcione y te acompañamos 15 días hábiles de garantía.</p></div></li>
    </ol>
  </div>
</section>

<span id="demos" class="ancla-vieja"></span><span id="automatiza" class="ancla-vieja"></span>
<section class="sec" id="demostraciones" aria-labelledby="demos-h">
  <div class="wrap">
    ${cabSec('Simulación', 'Así funciona una tienda <em>que construimos</em>', '<strong>Simulación</strong> con datos de ejemplo de lo que hace una página conectada: cobrar, avisar y registrar cada venta.', 'demos-h')}
    ${simTabs(['pago', 'correo', 'hoja', 'aviso'], 'h')}
    <p class="nota marcas-nota">Las marcas mencionadas pertenecen a sus titulares y se usan sólo como referencia de integraciones posibles.</p>
  </div>
</section>

<span id="portfolio" class="ancla-vieja"></span>
<section class="sec" id="proyectos" aria-labelledby="pj-h">
  <div class="wrap">
    <div class="sec-head sec-head--fila"><div class="rv"><p class="kicker">Proyectos</p><h2 class="h-sec" id="pj-h">Sistemas reales, <em>vendiendo hoy</em></h2></div><a class="btn btn-sec rv" href="${L.a('proyectos/')}">Ver todos los proyectos →</a></div>
    ${pjMosaico(proyectos, L)}
  </div>
</section>
${testimonios.length >= 2 ? `<section class="sec" id="testimonios" aria-labelledby="t-h"><div class="wrap">${cabSec('Testimonios', 'Lo que dicen <em>nuestros clientes</em>', '', 't-h')}<div class="pj-grid">${testimonios.map((t) => `<figure class="tarjeta rv"><blockquote><p class="sobre-cita">“${esc(t.cita)}”</p></blockquote><figcaption>${esc(t.autor)}${t.cargo ? ' · ' + esc(t.cargo) : ''}</figcaption></figure>`).join('')}</div></div></section>` : '<!-- Testimonios: se omite la sección hasta tener ≥ 2 testimonios reales autorizados (proyectos.json → testimonio). -->'}

<section class="sec" id="sobre-ricardo" aria-labelledby="sobre-h">
  <div class="wrap sobre">
    <div class="rv"><p class="kicker">Quién está detrás</p><h2 class="h-sec" id="sobre-h">Una persona, <em>de principio a fin</em></h2></div>
    <div class="rv rv-d1">
      <!-- [POR VALIDAR] Texto y foto de "Sobre Ricardo" (D15). Sin foto: no se usa imagen de stock. -->
      <p class="sobre-cita">Quien te cotiza es quien diseña tu página, monta tus anuncios y te responde por WhatsApp.</p>
      <p class="lead" style="margin-top:var(--e-4)">Soy Ricardo, diseñador y desarrollador web en Bucaramanga. Trabajo directamente con cada cliente, sin intermediarios.</p>
    </div>
  </div>
</section>

<section class="sec" id="preguntas" aria-labelledby="faq-h">
  <div class="wrap">
    ${cabSec('Preguntas', 'Preguntas <em>frecuentes</em>', '', 'faq-h')}
    ${faq(FAQ)}
  </div>
</section>

<span id="contact" class="ancla-vieja"></span>
<section class="sec contacto" id="contacto" aria-labelledby="contacto-h">
  <div class="wrap contacto-grid">
    <div class="rv">
      <p class="kicker">Contacto</p>
      <h2 class="h-sec" id="contacto-h">¿Hablamos de <em>tu negocio?</em></h2>
      <p class="lead">Cuéntanos qué necesitas y te respondemos por WhatsApp en horario hábil.</p>
      <div class="contacto-alt">
        <a href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent(C.whatsappGeneral)}" target="_blank" rel="noopener noreferrer" data-ubicacion="contacto-directo">Escribir sin formulario${EXT}</a>
        <a href="mailto:${esc(C.correo)}">${esc(C.correo)}</a>
        <span>${esc(C.cobertura)}</span>
      </div>
    </div>
    <div class="rv rv-d1">${formWa(L, 'Hola Ricardo, quiero cotizar.',
      opciones('servicio', 'Servicio', ['Diseño web', 'Mantenimiento web', 'Meta Ads', 'Contenido para redes', 'No estoy seguro']) +
      opciones('web', '¿Tienes página web?', ['Sí', 'No']) +
      `<div class="campo" data-label="Presupuesto aproximado"><label class="lbl" for="b-pres">Presupuesto aproximado</label><select id="b-pres" name="presupuesto"><option value="">Elige una opción</option><option>Menos de $500.000</option><option>$500.000-$1.500.000</option><option>Más de $1.500.000</option><option>Prefiero conversarlo</option></select></div>` +
      opciones('plazo', '¿Para cuándo?', ['Este mes', 'Próximos 3 meses', 'Sólo explorando']) +
      `<div class="campo" data-label="Negocio"><label class="lbl" for="b-neg">Nombre del negocio <span class="nota">(opcional)</span></label><input id="b-neg" name="negocio" type="text" maxlength="80" autocomplete="organization"></div>`,
      'brief_submit', 'brief')}</div>
  </div>
</section>`;
    out.push({
      salida: 'index.html', actual: 'inicio',
      title: 'Diseño web y publicidad en Meta en Bucaramanga | Ricardo Design',
      desc: 'Páginas web que venden, publicidad en Meta Ads con medición y contenido para redes sociales. Estudio en Bucaramanga, atención en toda Colombia.',
      canonical: '',
      cuerpo,
      jsonld: [
        { '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': NEGOCIO_ID, name: 'Ricardo Design', url: SITIO + '/', logo: SITIO + '/favicon-512.png', image: SITIO + '/favicon-512.png',
          email: C.correo, telephone: '+' + C.whatsapp,           address: { '@type': 'PostalAddress', addressLocality: 'Bucaramanga', addressRegion: 'Santander', addressCountry: 'CO' },
          areaServed: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Colombia'],
          hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Servicios', itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Creación de páginas web' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mantenimiento web por hora' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mantenimiento web mensual' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Campaña en Meta Ads' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gestión mensual de Meta Ads' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Contenido para redes sociales' } }
          ] } },
        { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Ricardo Design', url: SITIO + '/', inLanguage: 'es-CO' },
        faqLd(FAQ)
      ]
    });
  }

  /* ================= PUBLICIDAD DIGITAL ================= */
  {
    const salida = 'publicidad-digital/index.html', L = crearLinks(salida), s = svc('ads');
    const FAQ = [
      ['¿En qué redes salen los anuncios?', 'En Facebook, Instagram, Messenger, WhatsApp y Audience Network, según el objetivo de la campaña.'],
      ['¿Qué es el píxel y por qué lo necesito?', 'Es un código de Meta que se instala en tu página web y avisa cuando alguien ve un producto, agrega al carrito, paga o te escribe. Con esa información Meta muestra tus anuncios a personas con más probabilidad de comprar, y tú sabes qué anuncio trae resultados.'],
      ['¿Cuándo veo resultados?', 'Las primeras 2-4 semanas son de aprendizaje y pruebas. A partir de ahí optimizamos con datos.'],
      ['¿Puedo ver mis campañas?', 'Sí, siempre: la cuenta es tuya.'],
      ['¿Qué pasa con mis datos y los de mis clientes?', `Los tratamos sólo para prestar el servicio y según tus instrucciones. Lee nuestra <a href="${L.a('privacidad/')}">Política de privacidad</a>.`],
      ['¿Me garantizan ventas?', 'Las ventas son el objetivo que medimos contigo, pero nadie controla el mercado ni el algoritmo de Meta, y por eso no te prometemos una cifra. Garantizamos lo que depende de nosotros: lo entregable, los plazos, los reportes y los ajustes quedan escritos desde el primer día. Garantía sujeta a las condiciones del contrato.']
    ];
    const MIGAS = [['Inicio', ''], ['Meta Ads', 'publicidad-digital/']];
    const nodos = [['Anuncio', 'Facebook · Instagram'], ['Visita a tu web', 'con enlace UTM'], ['Evento', 'carrito · WhatsApp · compra'], ['Píxel y GA4', 'registran el evento'], ['Informe', 'qué funciona y qué no']];
    const cuerpo = `
${migas(L, MIGAS)}
<section class="p-hero"><div class="wrap">
  <p class="kicker">Meta Ads · Facebook e Instagram</p>
  <h1>Meta Ads con estudio de público y <em>medición real</em></h1>
  <p class="lead">Anuncios en Facebook, Instagram y WhatsApp pensados para tu cliente ideal, conectados a tu página web para saber qué funciona y qué no.</p>
  <div class="acciones">${btnWa(s.whatsappTexto, 'Cotizar Meta Ads', 'btn btn-pri', 'ads', 'hero')}<a class="btn btn-sec" href="#fases">Ver cómo trabajamos</a></div>
</div></section>

<section class="sec" aria-labelledby="pq-h" style="padding-top:0"><div class="wrap">
  ${cabSec('Para quién es', 'Si vendes por WhatsApp o en línea, <em>esto es para ti</em>', '', 'pq-h')}
  <ul class="para-quien">
    <li class="rv"><b>Negocios que venden por WhatsApp</b>y quieren más conversaciones de calidad.</li>
    <li class="rv rv-d1"><b>Tiendas en línea</b>que necesitan saber qué anuncio trae ventas.</li>
    <li class="rv rv-d2"><b>Marcas locales</b>que quieren llegar a Bucaramanga y su área metropolitana, o a toda Colombia.</li>
  </ul>
</div></section>

<section class="sec" id="fases" aria-labelledby="fases-h"><div class="wrap wrap-texto" style="max-width:960px">
  ${cabSec('Método en 6 fases', 'Cómo trabajamos <em>tu publicidad</em>', 'Cada fase tiene un entregable concreto. Así sabes siempre en qué vamos y qué recibes.', 'fases-h')}
  <div class="fases"><span class="fases-prog" aria-hidden="true"></span>
  <ol class="fases-ol">
    <li class="fase rv" data-n="1"><h3>Diagnóstico</h3><p>Revisamos tu cuenta publicitaria, tus campañas anteriores, tu oferta y los anuncios de tu competencia en la Biblioteca de anuncios de Meta.</p><p class="entregable"><b>Entregable:</b> diagnóstico de una página con oportunidades.</p></li>
    <li class="fase rv" data-n="2"><h3>Estudio de público objetivo</h3><p>Definimos con datos quién te compra: perfiles de cliente ideal (hasta 3), sus motivaciones y objeciones, ubicación, edad, intereses y comportamientos.</p>
      <ul class="lista-check"><li>Públicos personalizados: visitantes de tu web, personas que interactuaron en Instagram o Facebook y tu lista de clientes.</li><li>Públicos similares a tus mejores clientes.</li><li>Segmentación por zona: Bucaramanga y área metropolitana, Santander o toda Colombia.</li></ul>
      <p class="entregable"><b>Entregable:</b> documento de público objetivo con los públicos listos en tu cuenta.</p></li>
    <li class="fase rv" data-n="3"><h3>Medición y seguimiento <span class="chip">Si tienes página web</span></h3><p>Conectamos tu página con las plataformas de análisis para seguir el recorrido de cada visitante: desde que ve el anuncio hasta que escribe, agrega al carrito o paga.</p>
      <ul class="lista-check">
        <li><strong>Meta Pixel y API de Conversiones:</strong> eventos de vista de producto, carrito, inicio de pago, compra y contacto por WhatsApp.</li>
        <li><strong>Google Analytics 4 y Google Tag Manager:</strong> de dónde llegan tus visitantes y qué hacen en tu web.</li>
        <li><strong>Microsoft Clarity:</strong> mapas de calor y grabaciones anónimas para ver dónde se traban tus clientes.</li>
        <li><strong>Enlaces con UTM</strong> en todos los anuncios y verificación de dominio en Meta.</li>
        <li><strong>Aviso de cookies y consentimiento</strong>, como exige la ley colombiana.</li>
        <li><strong>Todo queda creado a tu nombre.</strong></li>
      </ul>
      <p class="entregable"><b>Entregable:</b> plan de medición (tabla de eventos) y accesos.</p>
      <p class="aviso-caja"><b>¿No tienes web?</b> Medimos con los resultados de Meta y las conversaciones de WhatsApp, y te recomendamos cuándo vale la pena dar el paso.</p></li>
    <li class="fase rv" data-n="4"><h3>Estrategia y montaje</h3><p>Armamos campañas por etapa: darte a conocer, generar interés y cerrar ventas (incluido el remarketing a quien ya te visitó). Probamos de 3 a 5 anuncios por grupo para descubrir cuál funciona.</p></li>
    <li class="fase rv" data-n="5"><h3>Optimización</h3><p>Revisamos las campañas con la frecuencia de tu plan (seguimiento mensual, análisis cada 15 días o seguimiento diario): ajustamos presupuesto, públicos y anuncios, y renovamos piezas cuando el público se cansa de verlas.</p></li>
    <li class="fase rv" data-n="6"><h3>Informes</h3><!-- La reunión de 30 min de la versión anterior se quitó: no está en los planes del home (revisar con Ricardo). -->
      <p>Recibes un informe en lenguaje claro, con 1, 2 o 4 reportes al mes según tu plan: cuánto invertiste, a cuántas personas llegaste, cuántos clics, mensajes o ventas obtuviste, cuánto te costó cada resultado y qué haremos después.</p>
      <p class="nota">Indicadores que verás:</p>
      <ul class="indicadores">${['Alcance', 'Frecuencia', 'CPM', 'CTR', 'Costo por clic', 'Costo por mensaje o cliente potencial', 'Costo por compra', 'ROAS (si hay compras medidas)'].map((x) => `<li class="chip">${x}</li>`).join('')}</ul></li>
  </ol></div>
</div></section>

<section class="sec" aria-labelledby="rc-h"><div class="wrap">
  ${cabSec('Medición', 'Del anuncio a la venta, <em>sin puntos ciegos</em>', 'Así viaja la información cuando tu página está conectada. Pasa el cursor por cada paso.', 'rc-h')}
  <div class="recorrido rv">
    <span class="chip chip-sim">Esquema ilustrativo</span>
    <svg class="rc-svg" viewBox="0 0 1000 170" role="img" aria-labelledby="rc-t rc-d">
      <title id="rc-t">Recorrido de medición</title>
      <desc id="rc-d">Esquema ilustrativo: el anuncio lleva a una visita a tu web; la visita genera un evento como carrito, WhatsApp o compra; el Meta Pixel y Google Analytics 4 registran el evento; y todo se resume en el informe mensual.</desc>
      ${nodos.slice(0, -1).map((_, i) => `<path class="rc-linea" d="M${190 + i * 200} 85 H${210 + i * 200}"/>`).join('')}
      ${nodos.map(([t, st], i) => `<g class="rc-nodo" tabindex="-1"><rect x="${10 + i * 200}" y="35" width="180" height="100" rx="14"/><text x="${100 + i * 200}" y="80" text-anchor="middle">${t}</text><text class="s" x="${100 + i * 200}" y="104" text-anchor="middle">${st}</text></g>`).join('')}
    </svg>
    <ol class="recorrido-movil">${nodos.map(([t, st]) => `<li><b>${t}</b><small>${st}</small></li>`).join('')}</ol>
  </div>
</div></section>

<section class="sec" id="paquetes" aria-labelledby="paq-h"><div class="wrap">
  ${cabSec('Planes', 'Pauta, <em>mes a mes</em>', 'Todo se cotiza según tu negocio. La diferencia entre los planes no es cuánta pauta se hace, sino cuánto se analiza y qué tanto se ajusta.', 'paq-h')}
  ${paqCards(s)}
  
  <div class="avisos">
    <p class="aviso-caja rv"><b>La inversión en anuncios</b> se paga directamente a Meta y no está incluida en los honorarios.</p>
    <p class="aviso-caja rv"><b>Garantizamos lo que depende de nosotros:</b> lo entregable, los plazos, los reportes y los ajustes quedan escritos desde el primer día. Las ventas son el objetivo que medimos contigo; nadie controla el mercado ni el algoritmo de Meta, y por eso no te prometemos una cifra. Garantía sujeta a las condiciones del contrato.</p>
    <p class="aviso-caja rv"><b>La gestión trabaja sobre contenido ya publicado.</b> ¿Necesitas piezas nuevas? Mira <a class="enlace" href="${L.a('contenido-redes-sociales/')}">Contenido para redes</a>.</p>
  </div>
</div></section>

<section class="sec" aria-labelledby="ni-h" style="padding-top:0"><div class="wrap">
  <div class="tarjeta rv"><h3 id="ni-h">Qué no incluye</h3><ul class="lista-x">${s.noIncluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div></section>

${proyectosDe('ads', L)}

<section class="sec" aria-labelledby="faq-h"><div class="wrap">${cabSec('Preguntas', 'Preguntas sobre <em>Meta Ads</em>', '', 'faq-h')}${faq(FAQ)}</div></section>
${ctaFinal('¿Listo para anunciar <em>con datos?</em>', 'Cuéntanos qué vendes y a quién. Te respondemos con una propuesta por WhatsApp.', s.whatsappTexto, 'Cotizar Meta Ads', 'ads')}
${relacionados(L, 'ads')}`;
    out.push({ salida, actual: 'ads', servicio: 'ads', cuerpo,
      title: 'Meta Ads en Bucaramanga | Ricardo Design',
      desc: 'Campañas en Facebook, Instagram y WhatsApp con estudio de público, Meta Pixel, Google Analytics e informes mensuales claros. Bucaramanga y toda Colombia.',
      jsonld: [serviceLd(s, SITIO + '/publicidad-digital/'), migasLd(MIGAS), faqLd(FAQ)] });
  }

  /* ================= CONTENIDO PARA REDES ================= */
  {
    const salida = 'contenido-redes-sociales/index.html', L = crearLinks(salida), s = svc('contenido');
    const MIGAS = [['Inicio', ''], ['Contenido para redes', 'contenido-redes-sociales/']];
    const FORMATOS = [
      ['Post estático', '1080×1350 px (4:5)', '4/5', ''],
      ['Carrusel', 'Hasta 10 láminas, 1080×1350 px', '4/5', 'carrusel'],
      ['Reel / TikTok', '9:16, 1080×1920 px, 15-45 s, guion, edición y subtítulos', '9/16', 'video'],
      ['Historias', '1080×1920 px', '9/16', ''],
      ['Portadas de destacados', 'Set con la identidad de tu marca', '1/1', ''],
      ['Textos (copys)', 'Con llamado a la acción y hashtags locales', '4/5', ''],
      ['Calendario editorial', 'Mensual, con fechas y objetivos de cada pieza', '4/3', ''],
      ['Plantillas de marca', 'Básicas en Canva o Figma para que publiques por tu cuenta', '1/1', '']
    ];
    const FAQ = [
      ['¿Para qué redes hacen contenido?', 'Instagram, Facebook y TikTok. Adaptamos cada pieza al formato de cada red.'],
      ['¿Necesito una sesión de fotos?', 'No siempre. Podemos trabajar con tu material o, si lo necesitas, programar una sesión de foto o video.'],
      ['¿Usan música en los reels?', 'Sí, sólo de bibliotecas comerciales con licencia, para que tu cuenta de empresa no tenga problemas.'],
      ['¿Lo puedo combinar con publicidad?', `Sí. Los anuncios rinden más con piezas hechas para pauta. Mira <a href="${L.a('publicidad-digital/')}">Meta Ads</a> y pregunta por el plan combinado.`],
      ['¿Quién publica las piezas?', 'Podemos entregártelas listas o programarlas en Meta Business Suite. Lo definimos contigo en la cotización.']
    ];
    const cuerpo = `
${migas(L, MIGAS)}
<section class="p-hero"><div class="wrap">
  <p class="kicker">Servicio nuevo · Contenido para redes</p>
  <h1>Contenido para redes sociales que muestra tu marca <em>y vende</em></h1>
  <p class="lead">Planeamos, diseñamos y editamos tus publicaciones cada mes para que tu Instagram, Facebook y TikTok se vean profesionales y constantes.</p>
  <div class="acciones">${btnWa(s.whatsappTexto, 'Cotizar contenido', 'btn btn-pri', 'contenido', 'hero')}<a class="btn btn-sec" href="#formatos">Ver formatos</a></div>
</div></section>

<section class="sec" id="formatos" aria-labelledby="fmt-h" style="padding-top:0"><div class="wrap">
  ${cabSec('Entregables', 'Formatos <em>que producimos</em>', 'Toca un formato para ver su proporción.', 'fmt-h')}
  <div class="formatos">
    <ul class="formato-lista" data-formatos>${FORMATOS.map(([n, sp, ar, t], i) => `<li><button class="formato-btn" type="button" aria-pressed="${i === 0}" data-nombre="${esc(n)}" data-spec="${esc(sp)}" data-ar="${ar}" data-tipo="${t}"><b>${esc(n)}</b><small>${esc(sp)}</small></button></li>`).join('')}</ul>
    <div class="lienzo" aria-hidden="true"><span class="chip chip-sim">Ejemplo ilustrativo</span><div><div class="pieza" data-pieza><b data-pieza-titulo>Post estático</b><small>Tu marca · ejemplo</small><span class="dots"><i></i><i></i><i></i></span><span class="play"></span></div><p class="pieza-spec" data-pieza-spec>1080×1350 px (4:5)</p></div></div>
  </div>
</div></section>

<section class="sec" aria-labelledby="pr-h"><div class="wrap">
  ${cabSec('Proceso', 'Un mes de contenido, <em>en 5 pasos</em>', '', 'pr-h')}
  <ol class="pasos">
    <li class="paso rv"><h3>Brief y pilares</h3><p>Definimos tus pilares de contenido: educar, mostrar producto, prueba social, detrás de cámaras y ofertas.</p></li>
    <li class="paso rv rv-d1"><h3>Calendario del mes</h3><p>Te enviamos el calendario para tu aprobación antes de producir.</p></li>
    <li class="paso rv rv-d2"><h3>Producción</h3><p>Con tu material o en sesión de foto o video.</p></li>
    <li class="paso rv rv-d3"><h3>Revisión y entrega</h3><!-- [POR VALIDAR] número de rondas de revisión (plan: hasta 2 por pieza) --><p>Revisas cada pieza (hasta 2 rondas de ajustes) y la entregamos o la programamos en Meta Business Suite, con las métricas del mes: alcance, guardados, compartidos, visitas al perfil y clics a WhatsApp.</p></li>
  </ol>
</div></section>

<section class="sec" id="paquete" aria-labelledby="paq-h"><div class="wrap">
  ${visibles(s).length ? cabSec('Paquetes', 'Elige tu <em>ritmo</em>', '', 'paq-h') + paqCards(s) : `<div class="contacto-grid">
    <div class="rv"><p class="kicker">Tu paquete</p><h2 class="h-sec" id="paq-h">Arma tu paquete <em>a la medida</em></h2><p class="lead">Cada marca necesita una cantidad distinta de piezas. Dinos qué quieres y te enviamos la cotización por WhatsApp.</p></div>
    <div class="rv rv-d1">${formWa(L, 'Hola Ricardo, quiero cotizar contenido para mis redes.',
      opciones('piezas', 'Piezas al mes', ['Unas 8', 'Entre 12 y 16', 'Más de 20', 'No sé todavía']) +
      checks('formatos', 'Formatos', ['Posts', 'Carruseles', 'Reels', 'Historias', 'Calendario']) +
      checks('redes', 'Redes', ['Instagram', 'Facebook', 'TikTok']) +
      opciones('ads', '¿También quieres anuncios en Meta?', ['Sí, plan combinado', 'No por ahora']),
      'brief_submit', 'cont')}</div>
  </div>`}
  <!-- [POR VALIDAR] Paquetes Básico/Crecimiento/Pro/Combo con precios (D3, D5). Se publican con --incluir-por-validar. -->
</div></section>

<section class="sec" aria-labelledby="cond-h" style="padding-top:0"><div class="wrap dos-col">
  <div class="tarjeta rv"><h3 id="cond-h">Condiciones</h3><ul class="lista-check">
    <li>Los derechos de uso de las piezas son tuyos al completar el pago.</li>
    <li>Música sólo de biblioteca comercial con licencia.</li>
    <li>Garantizas que tienes derechos sobre las fotos y logos que nos entregas.</li>
    <li>Revisiones, permanencia y archivos editables se definen en tu cotización.</li>
  </ul></div>
  <div class="tarjeta rv rv-d1"><h3>Qué no incluye</h3><ul class="lista-x">${s.noIncluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div></section>
${proyectosDe('contenido', L)}
<section class="sec" aria-labelledby="faq-h"><div class="wrap">${cabSec('Preguntas', 'Preguntas sobre <em>contenido</em>', '', 'faq-h')}${faq(FAQ)}</div></section>
${ctaFinal('Que tus redes se vean <em>como tu marca</em>', 'Te proponemos un calendario y un paquete según tu ritmo de publicación.', s.whatsappTexto, 'Cotizar contenido', 'contenido')}
${relacionados(L, 'contenido')}`;
    out.push({ salida, actual: 'contenido', servicio: 'contenido', cuerpo,
      title: 'Contenido para redes en Bucaramanga | Ricardo Design',
      desc: 'Posts, carruseles, historias y reels para Instagram, Facebook y TikTok con calendario mensual y textos que venden. Bucaramanga y toda Colombia.',
      jsonld: [serviceLd(s, SITIO + '/contenido-redes-sociales/'), migasLd(MIGAS), faqLd(FAQ)] });
  }

  /* ================= DISEÑO WEB ================= */
  {
    const salida = 'diseno-web/index.html', L = crearLinks(salida), s = svc('web');
    const MIGAS = [['Inicio', ''], ['Diseño web', 'diseno-web/']];
    const FAQ = [
      ['¿Cuánto cuesta una página web?', 'Depende de las secciones y funciones. Te enviamos una cotización a la medida en 24 horas hábiles.'],
      ['¿Cuánto se demora?', '10 días hábiles desde que recibimos toda tu información: textos, imágenes y accesos.'],
      ['¿Qué pasa después de la entrega?', `Tienes 15 días hábiles de corrección gratuita sobre errores del desarrollo. Después, los cambios se hacen con el plan de <a href="${L.a('mantenimiento-web/')}">mantenimiento</a>.`],
      ['¿De quién es el código?', 'Tuyo, al completar el pago del 100 % del valor acordado.'],
      ['¿Cómo se paga?', 'Con el 50 % de anticipo empieza el proyecto. El resto de condiciones de pago se indican en tu cotización.']
    ];
    const cuerpo = `
${migas(L, MIGAS)}
<section class="p-hero"><div class="wrap">
  <p class="kicker">Diseño web</p>
  <h1>Diseño de páginas web en Bucaramanga, <em>a la medida de tu negocio</em></h1>
  <p class="lead">Una página que se ve bien en el celular, carga rápido, cobra en línea y te avisa de cada venta. Hecha para tus clientes, no para una plantilla.</p>
  <div class="acciones">${btnWa(s.whatsappTexto, 'Cotizar mi página', 'btn btn-pri', 'web', 'hero')}<a class="btn btn-sec" href="#incluye">Qué incluye</a></div>
</div></section>

<section class="sec" aria-labelledby="pq-h" style="padding-top:0"><div class="wrap">
  ${cabSec('Para quién es', 'Tres tipos de página, <em>una sola idea</em>: que vendas', 'Todas se cotizan a la medida en 24 horas hábiles.', 'pq-h')}
  <ul class="para-quien">
    <li class="rv"><b>Página informativa</b>Para que te encuentren en Google y te escriban por WhatsApp. <span class="chip" style="margin-top:var(--e-3)">Cotización a la medida</span></li>
    <li class="rv rv-d1"><b>Catálogo</b>Para mostrar tus productos con fotos grandes y recibir pedidos. <span class="chip" style="margin-top:var(--e-3)">Cotización a la medida</span></li>
    <li class="rv rv-d2"><b>Tienda en línea</b>Para cobrar en línea, avisar al vendedor y registrar cada venta. <span class="chip" style="margin-top:var(--e-3)">Cotización a la medida</span></li>
  </ul>
</div></section>

<section class="sec" id="incluye" aria-labelledby="inc-h"><div class="wrap dos-col">
  <div class="rv">${cabSec('Qué incluye', 'Todo lo que tu página <em>necesita para vender</em>', '', 'inc-h')}</div>
  <div class="tarjeta rv rv-d1"><ul class="lista-check">
    <li>Diseño a medida, adaptable a celular y computador.</li>
    <li>Pagos en línea con Wompi.</li>
    <li>Correos automáticos de confirmación.</li>
    <li>Registro de ventas en hoja de cálculo.</li>
    <li>SEO básico para aparecer en Google.</li>
    <li>Formulario o botón de WhatsApp.</li>
    <li>Entrega en 10 días hábiles.</li>
    <li>15 días hábiles de garantía.</li>
  </ul></div>
</div></section>

<section class="sec" aria-labelledby="demo-h"><div class="wrap">
  ${cabSec('Simulación', 'Mira lo que hace <em>una página conectada</em>', 'Simulación con datos de ejemplo.', 'demo-h')}
  ${simTabs(['pago', 'correo'], 'w')}
</div></section>

<section class="sec" aria-labelledby="ni-h" style="padding-top:0"><div class="wrap">
  <div class="tarjeta rv"><h3 id="ni-h">Qué no incluye</h3><ul class="lista-x">${s.noIncluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div></section>
${proyectosDe('web', L)}
<section class="sec" aria-labelledby="faq-h"><div class="wrap">${cabSec('Preguntas', 'Preguntas sobre <em>diseño web</em>', '', 'faq-h')}${faq(FAQ)}</div></section>
${ctaFinal('¿Empezamos <em>tu página?</em>', 'Cuéntanos qué vendes y cómo te contactan tus clientes. Te enviamos la cotización en 24 horas hábiles.', s.whatsappTexto, 'Cotizar mi página', 'web')}
${relacionados(L, 'web')}`;
    out.push({ salida, actual: 'web', servicio: 'web', cuerpo,
      title: 'Diseño web en Bucaramanga | Ricardo Design',
      desc: 'Páginas web a la medida con pagos en línea, correos automáticos y entrega en 10 días hábiles. Bucaramanga y toda Colombia.',
      jsonld: [serviceLd(s, SITIO + '/diseno-web/'), migasLd(MIGAS), faqLd(FAQ)] });
  }

  /* ================= MANTENIMIENTO ================= */
  {
    const salida = 'mantenimiento-web/index.html', L = crearLinks(salida), s = svc('mantenimiento');
    const MIGAS = [['Inicio', ''], ['Mantenimiento web', 'mantenimiento-web/']];
    const FAQ = [
      ['¿En cuánto tiempo atienden un cambio?', 'Depende de la complejidad del cambio; te confirmamos el tiempo por WhatsApp antes de empezar.'],
      ['¿Qué pasa si necesito un cambio grande?', 'Si una solicitud supera 8 horas continuas de desarrollo, se cotiza como proyecto independiente.'],
      ['¿Hay permanencia en el plan mensual?', 'Sí, mínimo 3 meses. Para cancelar, avísanos con 30 días de anticipación.'],
      ['¿Qué conviene más, por hora o mensual?', 'Si haces cambios de vez en cuando, por hora. Si actualizas productos, precios o contenido cada semana, el plan mensual.']
    ];
    const cuerpo = `
${migas(L, MIGAS)}
<section class="p-hero"><div class="wrap">
  <p class="kicker">Mantenimiento web</p>
  <h1>Mantenimiento web: <em>tu página siempre al día</em></h1>
  <p class="lead">Cambios de textos, fotos, precios y secciones, sin que tengas que tocar código. Nos escribes, lo hacemos.</p>
  <div class="acciones">${btnWa(s.whatsappTexto, 'Pedir mantenimiento', 'btn btn-pri', 'mantenimiento', 'hero')}<a class="btn btn-sec" href="#planes">Ver planes</a></div>
</div></section>

<section class="sec" id="planes" aria-labelledby="pl-h" style="padding-top:0"><div class="wrap">
  ${cabSec('Modalidades', 'Dos formas <em>de trabajar</em>', 'Por hora o en suscripción mensual. Todo se cotiza según tu página y lo que necesites.', 'pl-h')}
  ${paqCards(s)}
</div></section>

<section class="sec" aria-labelledby="inc-h"><div class="wrap dos-col">
  <div class="tarjeta rv"><h3 id="inc-h">Incluye</h3><ul class="lista-check">${s.incluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="tarjeta rv rv-d1"><h3>No incluye</h3><ul class="lista-x">${s.noIncluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div></section>

<section class="sec" aria-labelledby="cp-h"><div class="wrap">
  ${cabSec('Así de simple', 'Cómo pides <em>un cambio</em>', '', 'cp-h')}
  <ol class="pasos">
    <li class="paso rv"><h3>Escríbenos</h3><p>Por WhatsApp, con lo que quieres cambiar y las fotos o textos nuevos.</p></li>
    <li class="paso rv rv-d1"><h3>Confirmamos</h3><p>Te decimos el tiempo estimado; si es por hora, cuántas horas.</p></li>
    <li class="paso rv rv-d2"><h3>Lo hacemos</h3><p>Te confirmamos el tiempo antes de empezar, según la complejidad.</p></li>
    <li class="paso rv rv-d3"><h3>Revisas</h3><p>Te avisamos cuando esté publicado para que lo veas.</p></li>
  </ol>
</div></section>
${proyectosDe('mantenimiento', L)}
<section class="sec" aria-labelledby="faq-h"><div class="wrap">${cabSec('Preguntas', 'Preguntas sobre <em>mantenimiento</em>', '', 'faq-h')}${faq(FAQ)}</div></section>
${ctaFinal('¿Tu página necesita <em>un cambio?</em>', 'Escríbenos qué quieres actualizar y te decimos cuánto tiempo toma.', s.whatsappTexto, 'Pedir mantenimiento', 'mantenimiento')}
${relacionados(L, 'mantenimiento')}`;
    out.push({ salida, actual: 'mantenimiento', servicio: 'mantenimiento', cuerpo,
      title: 'Mantenimiento web | Ricardo Design',
      desc: 'Cambios, actualizaciones y soporte para tu página web, por hora o en suscripción mensual. Se cotiza según tu página.',
      jsonld: [serviceLd(s, SITIO + '/mantenimiento-web/'), migasLd(MIGAS), faqLd(FAQ)] });
  }

  /* ================= PROYECTOS (índice) ================= */
  {
    const salida = 'proyectos/index.html', L = crearLinks(salida);
    const MIGAS = [['Inicio', ''], ['Proyectos', 'proyectos/']];
    const usados = ['web', 'mantenimiento', 'ads', 'contenido'].filter((id) => proyectos.some((p) => p.servicios.includes(id)));
    // Plan §8.3 pide filtros sólo con > 6 proyectos; el dueño pidió filtros interactivos,
    // así que se muestran siempre, sólo con servicios que tienen al menos un proyecto.
    const filtros = usados.length > 1 ? `<fieldset class="filtros" data-filtros><legend>Filtrar por servicio</legend><button class="tab" type="button" data-f="todos" aria-pressed="true">Todos</button>${usados.map((id) => `<button class="tab" type="button" data-f="${id}" aria-pressed="false">${ETQ[id]}</button>`).join('')}</fieldset><p class="sr-only" aria-live="polite" data-filtro-vivo></p>` : '';
    const cuerpo = `
${migas(L, MIGAS)}
<section class="p-hero"><div class="wrap">
  <p class="kicker">Portafolio</p>
  <h1>Proyectos</h1>
  <p class="lead">Tiendas en línea, catálogos y campañas que hemos construido para negocios en Colombia. Más proyectos se anexarán a medida que los clientes los aprueben.</p>
</div></section>
<section class="sec" style="padding-top:0" aria-labelledby="lista-h"><div class="wrap">
  <h2 class="sr-only" id="lista-h">Lista de proyectos</h2>
  ${filtros}
  ${pjMosaico(proyectos, L)}
  <p class="pj-externos"><b>Meta Ads sin página propia.</b> También gestionamos la pauta de <a class="enlace" href="https://www.instagram.com/abbart.rt/" target="_blank" rel="noopener noreferrer">Abbárt${EXT} <span aria-hidden="true">↗</span></a> y de <a class="enlace" href="https://piracanto.com" target="_blank" rel="noopener noreferrer">Piracanto × María Pía${EXT} <span aria-hidden="true">↗</span></a>.</p>
</div></section>
${ctaFinal('¿Quieres algo <em>así?</em>', 'Cuéntanos tu idea y te enviamos una propuesta.', C.whatsappGeneral, 'Cotizar mi proyecto', 'general')}`;
    out.push({ salida, actual: 'proyectos', cuerpo,
      title: 'Proyectos de diseño web y Meta Ads | Ricardo Design',
      desc: 'Tiendas en línea, catálogos y campañas de Meta Ads que hemos construido para negocios en Colombia.',
      jsonld: [migasLd(MIGAS)] });
  }

  /* ================= CASOS ================= */
  proyectos.forEach((p) => {
    const salida = `proyectos/${p.slug}/index.html`, L = crearLinks(salida);
    const MIGAS = [['Inicio', ''], ['Proyectos', 'proyectos/'], [p.cliente, `proyectos/${p.slug}/`]];
    const otros = proyectos.filter((x) => x.slug !== p.slug).slice(0, 2);
    const mets = metricasOk(p);
    const cs = p.caso || {};
    const cuerpo = `
${migas(L, MIGAS)}
<section class="p-hero"><div class="wrap">
  <p class="kicker">${esc(p.cliente)} · ${esc(p.rubro)}</p>
  <h1>${esc(p.titulo)} para <em>${esc(p.cliente)}</em></h1>
  <p class="lead">${esc(p.resumen)}</p>
  <ul class="pj-tags" aria-label="Servicios" style="margin-bottom:var(--e-5)">${p.servicios.map((s) => `<li class="chip">${ETQ[s]}</li>`).join('')}</ul>
  <div class="acciones">${p.url ? `<a class="btn btn-sec" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Visitar sitio${EXT} ↗</a>` : ''}</div>
</div></section>
<div class="wrap"><div class="caso-img rv" data-acento="${esc(p.acento || 'azul')}">${imgProyecto(p, true, L.r)}</div>
  ${cs.reto ? `<section class="caso-sec" aria-labelledby="reto-h"><h2 id="reto-h">Reto</h2><div class="prosa"><p>${esc(cs.reto)}</p></div></section>` : ''}
  ${cs.solucion && cs.solucion.length ? `<section class="caso-sec" aria-labelledby="sol-h"><h2 id="sol-h">Qué hicimos</h2><ul class="lista-check">${cs.solucion.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>` : ''}
  ${mets.length || cs.resultado ? `<section class="caso-sec" aria-labelledby="res-h"><h2 id="res-h">Resultados</h2><div class="prosa">${cs.resultado ? `<p>${esc(cs.resultado)}</p>` : ''}${mets.map((m) => `<p><strong>${esc(m.label)}:</strong> ${esc(m.valor)} (${esc(m.periodo)}${m.base ? ', vs. ' + esc(m.base) : ''}; fuente: ${esc(m.fuente)}, con autorización del cliente).</p>`).join('')}</div></section>` : ''}
  ${p.testimonio && p.testimonio.autorizado ? `<section class="caso-sec"><h2>Testimonio</h2><figure><blockquote><p class="sobre-cita">“${esc(p.testimonio.cita)}”</p></blockquote><figcaption>${esc(p.testimonio.autor)}</figcaption></figure></section>` : ''}
</div>
${ctaFinal('¿Quieres algo <em>así?</em>', 'Cuéntanos tu negocio y te enviamos una propuesta.', `Hola Ricardo, vi el proyecto ${p.cliente} y quiero algo similar.`, 'Cotizar', p.servicios[0])}
${otros.length ? `<section class="sec" aria-labelledby="otros-h"><div class="wrap">${cabSec('Más trabajo', 'Otros <em>proyectos</em>', '', 'otros-h')}<div class="pj-grid">${otros.map((x, i) => pjCard(x, L, i)).join('')}</div></div></section>` : ''}`;
    out.push({ salida, actual: 'proyectos', cuerpo, noindex: !casoIndexable(p), ogType: 'article',
      title: `${p.titulo} para ${p.cliente} · Caso | Ricardo Design`, desc: p.resumen,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: `${p.titulo} para ${p.cliente}`, description: p.resumen, url: SITIO + `/proyectos/${p.slug}/`, creator: { '@id': NEGOCIO_ID }, ...(p.url ? { sameAs: p.url } : {}) }, migasLd(MIGAS)] });
  });

  /* ================= LEGALES ================= */
  /* Documento largo: índice lateral con anclas (fijo en escritorio, plegable en móvil)
     generado de los <h2> de cada <article class="card">. No cambia ningún texto. */
  const slug = (t) => t.replace(/<[^>]+>/g, '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^\d+\.\s*/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const conIndice = (cuerpo, L, numerar) => {
    const items = [];
    let c = cuerpo.replace(/<article class="card"( id="([^"]+)")?>(\s*)<h2>([\s\S]*?)<\/h2>/g, (m, _a, id, sp, h) => {
      const k = id || slug(h); items.push([k, h.replace(/^\d+\.\s*/, '')]);
      return `<article class="card" id="${k}">${sp}<h2>${h}</h2>`;
    });
    c = c.replace(/\s*<nav class="pills"[\s\S]*?<\/nav>/, '');
    const nav = `<nav class="doc-indice" aria-label="Contenido del documento"><details><summary>Contenido <span class="versal">${items.length} secciones</span></summary><ol>${items.map(([k, t]) => `<li><a href="#${k}">${t}</a></li>`).join('')}</ol></details></nav>`;
    c = c.replace(/(<\/section>\s*)(<article)/, `$1<div class="doc${numerar ? ' doc--num' : ''}">${nav}<div class="doc-cuerpo">$2`);
    c = c.replace(/<\/div>\s*$/, `<p class="doc-volver"><a class="btn btn--linea" href="${L.a('')}">Volver al inicio ${FLECHA}</a></p></div></div>
</div>`);
    return c;
  };

  /* Políticas cortas (19 oct 2026, orden de Ricardo: "más sencillas, no detalladas"): sin índice lateral, sin numeración, 3 a 5 bloques. */
  const legalSimple = (L, migasL, hero, bloques) => `
<div class="legal-main">
${migas(L, migasL).replace('migas wrap', 'migas')}
<section class="legal-hero">
${hero}
</section>
<div class="doc-cuerpo doc-solo">
${bloques}
<p class="doc-volver"><a class="btn btn--linea" href="${L.a('')}">Volver al inicio ${FLECHA}</a></p></div>
</div>`;

  {
    const salida = 'privacidad/index.html', L = crearLinks(salida);
    const MIGAS_LEGAL = [['Inicio', ''], ['Privacidad', 'privacidad/']];
    const cuerpo = legalSimple(L, MIGAS_LEGAL, `  <p class="kicker">Ley 1581 de 2012</p>
  <h1>Política de privacidad</h1>
  <p>Cómo cuidamos los datos que nos compartes. Vigente desde el 19 de octubre de 2026.</p>`, `<article class="card" id="responsable"><h2>Quién es el responsable</h2>
  <p>Ricardo José Marín Espitia, persona natural que opera como Ricardo Design, en Bucaramanga, Santander, Colombia. Atendemos de forma virtual. Correo: <a href="mailto:${esc(C.correo)}">${esc(C.correo)}</a>. WhatsApp: ${esc(C.whatsappVisible)}.</p></article>
<article class="card" id="datos"><h2>Qué datos recibimos</h2>
  <p>Los que nos das por WhatsApp, correo o formulario: nombre, teléfono, correo y tu negocio. Los datos de navegación, como tu dispositivo y las páginas que visitas, solo si aceptas las cookies.</p></article>
<article class="card" id="uso"><h2>Para qué los usamos</h2>
  <p>Para responderte, cotizarte y prestarte el servicio. Si aceptas las cookies, también para medir y mejorar el sitio y nuestros anuncios.</p></article>
<article class="card" id="derechos"><h2>Tus derechos</h2>
  <p>Puedes conocer, actualizar y corregir tus datos, pedir que los borremos y retirar tu autorización cuando quieras. Escríbenos al correo o por WhatsApp: respondemos las consultas en máximo 10 días hábiles y los reclamos en máximo 15. Si no quedas conforme, puedes acudir a la Superintendencia de Industria y Comercio (SIC).</p></article>
<article class="card" id="terceros"><h2>Herramientas de terceros</h2>
  <p>Usamos herramientas de Google, Meta y Microsoft, que pueden guardar datos fuera de Colombia. Más detalle en la <a href="${L.a('cookies/')}">política de cookies</a>.</p></article>`);
    out.push({ salida, legal: true, cuerpo, title: 'Política de tratamiento de datos | Ricardo Design', desc: 'Qué datos recibe Ricardo Design, para qué los usa y cómo ejercer tus derechos (Ley 1581 de 2012).' });
  }

  {
    const salida = 'cookies/index.html', L = crearLinks(salida);
    const MIGAS_LEGAL = [['Inicio', ''], ['Cookies', 'cookies/']];
    const fila = (c, p, d) => `<tr><td><code>${c}</code></td><td>${p}</td><td>${d}</td></tr>`;
    const cuerpo = legalSimple(L, MIGAS_LEGAL, `  <p class="kicker">Transparencia</p>
  <h1>Política de cookies</h1>
  <p>Las cookies son archivos pequeños que tu navegador guarda para recordar información. Las de medición y publicidad solo las usamos si las aceptas.</p>`, `<article class="card" id="que-usamos"><h2>Qué usamos</h2>
  <ul><li><strong>Necesarias:</strong> hacen que el sitio funcione y recuerdan tu decisión. Siempre activas.</li>
  <li><strong>Analítica:</strong> Google Analytics y Microsoft Clarity cuentan visitas y muestran cómo se usa el sitio.</li>
  <li><strong>Publicidad:</strong> Meta mide y mejora nuestros anuncios.</li></ul>
  <div class="tabla-scroll"><table class="tabla"><caption class="sr-only">Cookies y almacenamiento usados</caption>
  <thead><tr><th scope="col">Nombre</th><th scope="col">Para qué</th><th scope="col">Duración</th></tr></thead><tbody>
  ${fila('rd_consent', 'Recordar tu decisión (almacenamiento local)', '12 meses')}
  ${fila('rd_pausa', 'Recordar si pausaste las animaciones (almacenamiento local)', 'Hasta que la borres')}
  ${fila('_ga, _ga_*', 'Google Analytics: contar visitas', 'Hasta 2 años')}
  ${fila('_clck, _clsk', 'Clarity: mapas de calor y grabaciones anónimas', '1 año y 1 día')}
  ${fila('_fbp, _fbc', 'Meta: medir anuncios', '3 meses')}
  </tbody></table></div></article>
<article class="card" id="cambiar"><h2>Cambiar tu decisión</h2><p>Abre el panel cuando quieras, aquí o en «Configurar cookies», al final de cada página.</p>
  <p><button class="btn btn-sec btn-sm" type="button" data-config-cookies>Configurar cookies</button></p></article>
<article class="card" id="borrar"><h2>Borrarlas</h2><p>Desde la configuración de privacidad de tu navegador (Chrome, Safari, Firefox o Edge). Más sobre tus datos en la <a href="${L.a('privacidad/')}">política de privacidad</a>.</p></article>`);
    out.push({ salida, legal: true, cuerpo, title: 'Política de cookies | Ricardo Design', desc: 'Qué cookies usa ricardodesign.co, para qué sirven y cómo controlarlas.', jsonld: [migasLd(MIGAS_LEGAL)] });
  }

  {
    const salida = '404.html', L = crearLinks(salida);
    const cuerpo = `<section class="e404"><div class="wrap">
  <p class="num" aria-hidden="true">404</p>
  <h1 class="h-display">Esta página <em>no existe</em></h1>
  <p class="lead" style="margin:var(--e-4) 0 var(--e-6)">Puede que el enlace haya cambiado. Estos caminos sí funcionan:</p>
  <div class="relacionados">${S.servicios.map((s) => `<a class="rel" href="${L.a(s.ruta)}"><b>${esc(s.nombre)}</b><span>${esc(s.frase)}</span></a>`).join('')}<a class="rel" href="${L.a('')}"><b>Inicio</b><span>Volver a la página principal</span></a></div>
  <p class="doc-volver"><a class="btn btn--laton" href="${L.a('')}">Volver al inicio ${FLECHA}</a></p>
</div></section>`;
    out.push({ salida, noindex: true, cuerpo, canonical: '404.html', title: 'Página no encontrada | Ricardo Design', desc: '' });
  }

  return out;
}
