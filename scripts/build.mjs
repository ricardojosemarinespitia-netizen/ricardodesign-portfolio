#!/usr/bin/env node
/* ============================================================================
   build.mjs — Generador estático de ricardodesign.co (Node ≥ 18, sin dependencias)

   Uso:   node scripts/build.mjs                    → genera el sitio
          node scripts/build.mjs --incluir-por-validar  → publica también los
                                                       paquetes con estado "por_validar"
          node scripts/build.mjs --produccion       → falla si una página
                                                       indexable contiene "{{"

   Lee data/servicios.json y data/proyectos.json y escribe TODAS las páginas
   HTML, sitemap.xml y robots.txt. El HTML generado se versiona: GitHub Pages
   sólo sirve archivos estáticos. Todas las rutas internas son RELATIVAS y
   apuntan a ".../index.html" para que el sitio funcione con doble clic
   (file://) y también en el servidor.
   Es idempotente: dos ejecuciones seguidas producen los mismos archivos.
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { paginas } from './paginas.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARGS = new Set(process.argv.slice(2));
const OPC = { porValidar: ARGS.has('--incluir-por-validar'), produccion: ARGS.has('--produccion') };
const SITIO = 'https://ricardodesign.co';
const LASTMOD = '2026-09-30'; // fecha fija → build idempotente. Actualízala al publicar.

const leer = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const S = leer('data/servicios.json');
const P = leer('data/proyectos.json');

/* ---------- Validación (mensajes claros) ---------- */
const errores = [];
const IDS = ['web', 'mantenimiento', 'ads', 'contenido'];
const slugs = new Set();
if (P.version !== 1 || !Array.isArray(P.proyectos)) errores.push('proyectos.json: falta "version":1 o el arreglo "proyectos".');
(P.proyectos || []).forEach((p, i) => {
  const at = `proyectos[${i}]${p.slug ? ' (' + p.slug + ')' : ''}`;
  for (const k of ['slug', 'cliente', 'rubro', 'titulo', 'resumen']) if (!p[k] || typeof p[k] !== 'string') errores.push(`${at}: falta el campo "${k}".`);
  if (typeof p.publicado !== 'boolean') errores.push(`${at}: "publicado" debe ser true o false.`);
  if (p.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) errores.push(`${at}: slug inválido (minúsculas, sin tildes, guiones).`);
  if (slugs.has(p.slug)) errores.push(`${at}: slug repetido.`); slugs.add(p.slug);
  if (!Array.isArray(p.servicios) || !p.servicios.length || p.servicios.some((s) => !IDS.includes(s))) errores.push(`${at}: "servicios" debe ser una lista con valores de ${IDS.join(', ')}.`);
  if (!p.imagen || !p.imagen.desktop || !p.imagen.alt) errores.push(`${at}: "imagen.desktop" e "imagen.alt" son obligatorios.`);
  (p.metricas || []).forEach((m, j) => { for (const k of ['label', 'valor', 'periodo', 'fuente']) if (!m[k]) errores.push(`${at}.metricas[${j}]: falta "${k}".`); });
});
for (const id of IDS) if (!S.servicios.find((s) => s.id === id)) errores.push(`servicios.json: falta el servicio "${id}".`);
if (errores.length) { console.error('✖ Datos inválidos:\n  - ' + errores.join('\n  - ')); process.exit(1); }

/* ---------- Utilidades ---------- */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const C = S.contacto;
const wa = (t) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;
const svc = (id) => S.servicios.find((s) => s.id === id);
const visibles = (s) => (s.paquetes || []).filter((p) => p.estado === 'vigente' || OPC.porValidar);
const proyectos = P.proyectos.filter((p) => p.publicado).sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99) || String(b.fecha || '').localeCompare(String(a.fecha || '')));
// Indexable si tiene reto o al menos 3 puntos reales de solución (evita contenido pobre).
const casoIndexable = (p) => !!(p.caso && ((p.caso.reto && p.caso.reto.trim()) || (p.caso.solucion || []).length >= 3));
const metricasOk = (p) => (p.metricas || []).filter((m) => m.autorizado === true && m.periodo && m.fuente);
const testimonios = proyectos.map((p) => p.testimonio).filter((t) => t && t.autorizado === true && t.cita);
const ETQ = { web: 'Web', mantenimiento: 'Mantenimiento', ads: 'Meta Ads', contenido: 'Contenido' };

/* Contexto que reciben las plantillas de página */
const ctx = { S, P, C, OPC, esc, wa, svc, visibles, proyectos, casoIndexable, metricasOk, testimonios, ETQ, SITIO };

/* ---------- Enlaces relativos ---------- */
function crearLinks(salida) {
  const prof = salida === '404.html' ? -1 : salida.split('/').length - 1;
  const r = prof < 0 ? '/' : '../'.repeat(prof);
  const esHome = salida === 'index.html';
  // a('diseno-web/') → '../diseno-web/index.html' ; a('') → index.html ; a('#x') en home
  const a = (ruta) => {
    if (/^(https?:|mailto:|tel:)/.test(ruta)) return ruta;
    const [p, h] = ruta.split('#');
    const hash = h ? '#' + h : '';
    if (p === '' && esHome) return hash || 'index.html';
    let dest = p === '' ? 'index.html' : p.endsWith('/') ? p + 'index.html' : p;
    if (prof < 0) dest = dest.replace(/index\.html$/, '');
    return r + dest + hash;
  };
  return { r, a, esHome, prof };
}

/* ---------- Iconos ---------- */
const ICO_WA = '<svg class="ico" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.5c1.7.9 3.6 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.9.9.9-4.7-.2-.4c-1-1.6-1.5-3.4-1.5-5.1 0-5.4 4.5-9.8 10-9.8s10 4.4 10 9.8-4.4 9.8-9.9 9.8zm5.5-7.3c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2s-.8 1-.9 1.2c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>';
ctx.ICO_WA = ICO_WA;
const EXT = '<span class="sr-only"> (se abre en otra pestaña)</span>';
ctx.EXT = EXT;

/* ---------- Cabecera y pie comunes ---------- */
function cabecera(L, actual, mainId = 'contenido') {
  const cur = (k) => (actual === k ? ' aria-current="page"' : '');
  const items = S.servicios.map((s) => `<li><a href="${L.a(s.ruta)}"${cur(s.id)}><b>${esc(s.nombre)}${s.nuevo ? ' · nuevo' : ''}</b><small>${esc(s.frase)}</small></a></li>`).join('');
  const LUPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
  return `<a class="skip" href="#${mainId}">Saltar al contenido</a>
<header class="cab">
  <div class="wrap cab-in">
    <a class="marca" href="${L.a('')}" aria-label="Ricardo Design, ir al inicio"><span class="marca-mono" aria-hidden="true">rd</span><span class="marca-txt">Ricardo Design</span></a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav-lista">
        <li><button class="nav-btn" type="button" aria-expanded="false" aria-controls="desp-servicios">Servicios <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
          <ul class="desp" id="desp-servicios" hidden>${items}</ul></li>
        <li><a class="nav-a" href="${L.a('proyectos/')}"${cur('proyectos')}>Proyectos</a></li>
        <li><a class="nav-a" href="${L.a('#como-trabajamos')}">Cómo trabajamos</a></li>
        <li><a class="nav-a" href="${L.a('#preguntas')}">Preguntas</a></li>
      </ul>
    </nav>
    <div class="cab-acc">
      <a class="btn btn-pri btn-sm cab-cotizar" href="${wa(C.whatsappGeneral)}" target="_blank" rel="noopener noreferrer" data-ubicacion="nav">Cotizar${EXT}</a>
      <button class="btn-redondo btn-buscar" type="button" aria-expanded="false" aria-controls="buscador" aria-label="Buscar en el sitio">${LUPA}</button>
      <button class="btn-redondo btn-menu" type="button" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir menú"><i aria-hidden="true"></i></button>
    </div>
  </div>
</header>
<div class="menu-movil" id="menu-movil" role="dialog" aria-modal="true" aria-labelledby="menu-t" hidden>
  <div class="menu-fondo" data-cerrar-menu></div>
  <div class="menu-panel">
    <div class="menu-top"><p class="menu-t" id="menu-t">Menú</p><button class="btn-redondo menu-x" type="button" data-cerrar-menu aria-label="Cerrar menú"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <nav aria-label="Menú principal">
      <h2>Servicios</h2>
      ${S.servicios.map((s) => `<a href="${L.a(s.ruta)}"${cur(s.id)}>${esc(s.nombre)}</a>`).join('\n      ')}
      <h2>Estudio</h2>
      <a href="${L.a('proyectos/')}"${cur('proyectos')}>Proyectos</a>
      <a href="${L.a('#como-trabajamos')}">Cómo trabajamos</a>
      <a href="${L.a('#preguntas')}">Preguntas</a>
      <a href="${L.a('politicas.html')}"${cur('politicas')}>Políticas</a>
      <a href="${L.a('#contacto')}">Contacto</a>
      <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp ${esc(C.whatsappVisible)}${EXT}</a>
    </nav>
    <a class="btn btn-pri menu-cta" href="${wa(C.whatsappGeneral)}" target="_blank" rel="noopener noreferrer" data-ubicacion="menu">Cotizar mi proyecto${EXT}</a>
  </div>
</div>
<div class="buscador" id="buscador" role="dialog" aria-modal="true" aria-labelledby="buscador-t" hidden>
  <div class="menu-fondo" data-cerrar-buscador></div>
  <div class="buscador-panel">
    <div class="menu-top"><p class="menu-t" id="buscador-t">Buscar en el sitio</p><button class="btn-redondo" type="button" data-cerrar-buscador aria-label="Cerrar búsqueda"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <label class="sr-only" for="buscador-q">Qué buscas</label>
    <div class="buscador-campo">${LUPA}<input id="buscador-q" type="search" autocomplete="off" placeholder="Ej.: Meta Ads, precios, tienda…" aria-controls="buscador-res" aria-describedby="buscador-estado"></div>
    <p class="buscador-sug" data-sugerencias>Populares: <button type="button">Meta Ads</button> <button type="button">Diseño web</button> <button type="button">Mantenimiento</button> <button type="button">Proyectos</button> <button type="button">Precios</button></p>
    <p class="sr-only" id="buscador-estado" aria-live="polite"></p>
    <ul class="buscador-res" id="buscador-res"></ul>
  </div>
</div>`;
}

function pie(L) {
  return `<footer class="pie">
  <div class="wrap">
    <div class="pie-grid">
      <div>
        <span class="marca-txt">Ricardo Design</span>
        <p>Páginas web, publicidad en Meta y contenido para redes que venden. ${esc(C.cobertura)}.</p>
        <div class="pie-contacto">
          <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp ${esc(C.whatsappVisible)}${EXT}</a><br>
          <a href="mailto:${esc(C.correo)}">${esc(C.correo)}</a>
        </div>
      </div>
      <nav aria-label="Servicios"><h2 class="ft-h">Servicios</h2><ul>
        ${S.servicios.map((s) => `<li><a href="${L.a(s.ruta)}">${esc(s.nombre)}</a></li>`).join('')}
      </ul></nav>
      <nav aria-label="Estudio"><h2 class="ft-h">Estudio</h2><ul>
        <li><a href="${L.a('proyectos/')}">Proyectos</a></li>
        <li><a href="${L.a('#como-trabajamos')}">Cómo trabajamos</a></li>
        <li><a href="${L.a('#preguntas')}">Preguntas</a></li>
        <li><a href="${L.a('#contacto')}">Contacto</a></li>
      </ul></nav>
      <nav aria-label="Legal"><h2 class="ft-h">Legal</h2><ul>
        <li><a href="${L.a('politicas.html')}">Cláusulas y políticas</a></li>
        <li><a href="${L.a('privacidad/')}">Privacidad</a></li>
        <li><a href="${L.a('cookies/')}">Cookies</a></li>
        <li><button class="ft-btn" type="button" data-config-cookies data-href="${L.a('cookies/')}">Configurar cookies</button></li>
      </ul></nav>
    </div>
    <div class="pie-base"><span>© 2026 Ricardo Design</span><span>Hecho en Bucaramanga, Santander</span></div>
  </div>
</footer>
<a class="wa-float" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp (se abre en otra pestaña)" data-ubicacion="flotante">${ICO_WA.replace('class="ico" ', '')}</a>
<div class="cookies" id="cookies" role="dialog" aria-labelledby="cookies-t" hidden>
  <h2 id="cookies-t">Tu privacidad</h2>
  <p>Usamos cookies propias necesarias para que el sitio funcione y, si lo autorizas, cookies de analítica (Google Analytics, Microsoft Clarity) y de publicidad (Meta) para medir visitas y mejorar nuestros anuncios. Puedes cambiar tu decisión cuando quieras en "Configurar cookies". <a href="${L.a('cookies/')}">Más información</a>.</p>
  <div class="cookies-cfg" hidden>
    <label><input type="checkbox" checked disabled> Necesarias (siempre activas)</label>
    <label><input type="checkbox" name="c-analitica"> Analítica</label>
    <label><input type="checkbox" name="c-publicidad"> Publicidad</label>
    <button class="btn btn-sec btn-sm" type="button" data-c="guardar">Guardar preferencias</button>
  </div>
  <div class="acciones">
    <button class="btn btn-sec btn-sm" type="button" data-c="todas">Aceptar todas</button>
    <button class="btn btn-sec btn-sm" type="button" data-c="rechazar">Rechazar</button>
    <button class="btn btn-sec btn-sm" type="button" data-c="config">Configurar</button>
  </div>
</div>`;
}


/* Splash del home: capa decorativa (aria-hidden). Sólo se muestra si
   assets/js/splash.js añadió html.splash antes de pintar. Sin JS no aparece. */
const SPLASH = `<div class="splash-capa" aria-hidden="true"><div class="splash-in">
  <svg class="splash-logo" viewBox="0 0 120 120"><defs><linearGradient id="spg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00C2FF"/><stop offset=".5" stop-color="#2F5BFF"/><stop offset="1" stop-color="#8B2CF5"/></linearGradient></defs>
    <circle class="sp-aro" cx="60" cy="60" r="54" fill="none" stroke="url(#spg)" stroke-width="5" stroke-linecap="round"/>
    <circle class="sp-fondo" cx="60" cy="60" r="46" fill="url(#spg)"/>
    <text x="60" y="74" text-anchor="middle" font-family="Sora, sans-serif" font-size="42" font-weight="700" fill="#fff">rd</text></svg>
  <p class="splash-nombre"><span>Ricardo</span> <span>Design</span></p>
  <p class="splash-salto">Toca o pulsa una tecla para entrar</p>
</div></div>
`;

/* ---------- Documento ---------- */
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://felipevergel.com https://alejandravergel.com https://vegasdelverde.co https://armandomartinez.co https://accesoriosencobre.co; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://wa.me; upgrade-insecure-requests";
/* Ampliación para cuando se active la medición (NO activar sin IDs reales):
   script-src  + https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms https://*.clarity.ms
   img-src     + https://www.googletagmanager.com https://*.google-analytics.com https://www.facebook.com https://*.clarity.ms
   connect-src + https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net https://*.clarity.ms */

function documento(pg, L) {
  const url = SITIO + '/' + (pg.canonical ?? pg.salida.replace(/index\.html$/, ''));
  const ld = (pg.jsonld || []).map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  const robots = pg.noindex ? '<meta name="robots" content="noindex, follow">\n' : '';
  return `<!DOCTYPE html>
<html lang="es-CO">
<head>
<meta charset="utf-8">
<!-- Generado por scripts/build.mjs — no edites este archivo a mano: edita data/*.json o scripts/paginas.mjs y vuelve a ejecutar el build. -->
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(pg.title)}</title>
${pg.desc ? `<meta name="description" content="${esc(pg.desc)}">\n` : ''}${robots}<link rel="canonical" href="${url}">
<meta name="theme-color" content="#EEF7FF">
<link rel="icon" href="${L.r}favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${L.r}favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="${L.r}apple-touch-icon.png">
<meta property="og:title" content="${esc(pg.ogTitle || pg.title)}">
${pg.desc ? `<meta property="og:description" content="${esc(pg.desc)}">\n` : ''}<meta property="og:type" content="${pg.ogType || 'website'}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITIO}/favicon-512.png">
<meta property="og:image:alt" content="Logotipo de Ricardo Design">
<meta property="og:locale" content="es_CO">
<meta property="og:site_name" content="Ricardo Design">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;800&amp;family=Sora:wght@500;600;700&amp;family=Inter:wght@400;500;600;700&amp;display=swap">
<link rel="stylesheet" href="${L.r === '/' ? '/' : L.r}tokens.css">
<link rel="stylesheet" href="${L.r === '/' ? '/' : L.r}assets/css/app.css">
${pg.salida === 'index.html' ? '<script src="assets/js/splash.js"></script>\n' : ''}<script src="${L.r === '/' ? '/' : L.r}assets/js/config-medicion.js" defer></script>
<script src="${L.r === '/' ? '/' : L.r}assets/js/busqueda-indice.js" defer></script>
<script src="${L.r === '/' ? '/' : L.r}assets/js/app.js" defer></script>
${ld}
</head>
<body${pg.legal ? ' class="legal"' : ''} data-wa="${C.whatsapp}" data-raiz="${L.r === '/' ? '/' : L.r}"${pg.servicio ? ` data-servicio="${pg.servicio}"` : ''}>
${pg.salida === 'index.html' ? SPLASH : ''}${pg.legal ? '' : '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>\n'}${cabecera(L, pg.actual, pg.mainId || 'contenido')}
<main id="${pg.mainId || 'contenido'}">
${pg.cuerpo}
</main>
${pie(L)}
</body>
</html>
`;
}

/* ---------- Generación ---------- */
const lista = paginas(ctx, crearLinks);
const escritos = [];
for (const pg of lista) {
  const L = crearLinks(pg.salida);
  const htmlDoc = documento(pg, L);
  if (OPC.produccion && !pg.noindex && htmlDoc.includes('{{')) { console.error(`✖ ${pg.salida} es indexable y contiene "{{". Completa los datos o márcala noindex.`); process.exit(1); }
  const destino = path.join(ROOT, pg.salida);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, htmlDoc);
  escritos.push(pg);
}


/* Índice de búsqueda estático (data/busqueda.json + assets/js/busqueda-indice.js
   para que funcione también con file://, donde fetch() falla). */
const sinTags = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const indice = [];
for (const pg of escritos) {
  if (pg.noindex && !pg.salida.startsWith('proyectos/')) continue;
  if (pg.salida === '404.html') continue;
  const url = pg.salida;
  indice.push({ t: pg.title.replace(/\s*\|\s*Ricardo Design$/, ''), d: pg.desc || '', u: url, g: 'Página' });
  const re = /<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g; let m;
  while ((m = re.exec(pg.cuerpo))) {
    indice.push({ t: sinTags(m[2]), d: indice[indice.length - 1].t === sinTags(m[2]) ? '' : pg.title.replace(/\s*\|\s*Ricardo Design$/, ''), u: url + '#' + m[1], g: 'Sección' });
  }
  const rq = /<summary>([\s\S]*?)<\/summary>/g;
  while ((m = rq.exec(pg.cuerpo))) indice.push({ t: sinTags(m[1]), d: 'Pregunta frecuente · ' + pg.title.replace(/\s*\|\s*Ricardo Design$/, ''), u: url, g: 'Pregunta' });
}
for (const p of proyectos) indice.push({ t: `${p.titulo} para ${p.cliente}`, d: `${p.rubro} · ${p.resumen}`, u: `proyectos/${p.slug}/index.html`, g: 'Proyecto' });
const vistos = new Set(); const indiceU = indice.filter((x) => { const k = x.t + '|' + x.u; if (vistos.has(k) || !x.t) return false; vistos.add(k); return true; });
fs.writeFileSync(path.join(ROOT, 'data/busqueda.json'), JSON.stringify(indiceU, null, 1) + '\n');
fs.writeFileSync(path.join(ROOT, 'assets/js/busqueda-indice.js'), '/* Generado por scripts/build.mjs — no editar. */\nwindow.RD_BUSQUEDA = ' + JSON.stringify(indiceU) + ';\n');

/* Borrar páginas de casos huérfanas (proyecto despublicado o renombrado) */
const dirProy = path.join(ROOT, 'proyectos');
if (fs.existsSync(dirProy)) {
  const vivos = new Set(proyectos.map((p) => p.slug));
  for (const d of fs.readdirSync(dirProy, { withFileTypes: true })) {
    if (d.isDirectory() && !vivos.has(d.name)) {
      const f = path.join(dirProy, d.name, 'index.html');
      if (fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('Generado por scripts/build.mjs')) { fs.rmSync(f); try { fs.rmdirSync(path.join(dirProy, d.name)); } catch {} console.log(`  · eliminado caso huérfano: proyectos/${d.name}/`); }
    }
  }
}

/* sitemap.xml: sólo páginas indexables */
const urls = escritos.filter((p) => !p.noindex && p.salida !== '404.html').map((p) => `  <url><loc>${SITIO}/${p.salida.replace(/index\.html$/, '')}</loc><lastmod>${LASTMOD}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /_original/\nDisallow: /scripts/\nDisallow: /data/\n\nSitemap: ${SITIO}/sitemap.xml\n`);

console.log(`✔ ${escritos.length} páginas generadas · ${urls.length} URLs en sitemap.xml${OPC.porValidar ? ' · (incluye paquetes POR VALIDAR)' : ''}`);
