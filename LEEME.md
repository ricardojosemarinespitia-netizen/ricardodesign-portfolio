# Ricardo Design — sitio nuevo (rediseño 2026)

Versión nueva del sitio, generada a partir de `PLAN_DISENO_FINAL.md` y `AUDITORIA.md`.
Los archivos originales (`../index.html`, `../politicas.html`, `../tokens.css`) **no se modificaron**.
Nada se publicó ni se subió a internet.

## Cómo verlo

Doble clic en `index.html`. Todas las rutas son relativas y apuntan a `.../index.html`,
así que funciona sin servidor. Necesita internet sólo para las fuentes (Google Fonts)
y las fotos de los dos proyectos (se cargan desde felipevergel.com y alejandravergel.com).

> Si algún navegador no aplicara estilos o scripts al abrir con doble clic, la causa
> sería la línea `Content-Security-Policy` del `<head>` (algunos navegadores tratan
> `file://` de forma especial). En el servidor real funciona igual que en local.

## Estructura

```
index.html                     Home (generada)
diseno-web/index.html          Servicio: diseño web
mantenimiento-web/index.html   Servicio: mantenimiento
publicidad-digital/index.html  Servicio: Meta Ads (6 fases, medición, paquetes)
contenido-redes-sociales/      Servicio nuevo: contenido para redes
proyectos/index.html           Portafolio con filtros
proyectos/{slug}/index.html    Página de caso (una por proyecto)
politicas.html                 Cláusulas (misma URL de siempre; + #contenido y #medicion)
privacidad/index.html          Política de datos (Ley 1581) — BORRADOR, noindex
cookies/index.html             Política de cookies
404.html                       Error con enlaces útiles
sitemap.xml · robots.txt       Generados por el build
_headers                       Cabeceras de seguridad (sólo Netlify/Cloudflare; GitHub Pages lo ignora)
tokens.css                     Tokens originales + bloque 6 de ampliación (nada cambiado)
assets/css/app.css             Estilos de todo el sitio
assets/js/app.js               Interacciones (menú, pestañas, filtros, formularios a WhatsApp, cookies)
assets/js/config-medicion.js   Medición DESACTIVADA (sin IDs)
data/servicios.json            Servicios, precios, paquetes, contacto (fuente única)
data/proyectos.json            Proyectos del portafolio (fuente única)
data/proyectos.schema.json     Esquema de validación
scripts/build.mjs              Generador (Node ≥ 18, sin dependencias)
scripts/paginas.mjs            Textos y plantillas de cada página
```

**No edites los `.html` a mano**: edita `data/*.json` o `scripts/paginas.mjs` y ejecuta
`node scripts/build.mjs`. El build valida los datos, regenera todas las páginas y el
sitemap, y es idempotente.

Opciones: `--incluir-por-validar` (publica los paquetes sin precio aprobado) y
`--produccion` (falla si una página indexable tiene `{{...}}`).

## Cómo añadir un proyecto

1. Abre `data/proyectos.json`, copia un bloque completo y pégalo dentro de `"proyectos"`.
2. Cambia: `slug` (minúsculas, sin tildes, con guiones, único), `cliente`, `rubro`,
   `titulo`, `resumen`, `url`, `servicios` (de: `web`, `mantenimiento`, `ads`, `contenido`),
   `orden` y `destacado` (en la home salen máximo 3 destacados).
3. Imágenes: lo ideal es guardarlas en `assets/img/proyectos/{slug}/` en AVIF, WebP y JPG
   a 480, 800 y 1200 px (`portada-dt-800.avif`, etc.) y poner en `imagen.desktop` la ruta
   **sin extensión** y relativa a la raíz del sitio: `assets/img/proyectos/{slug}/portada-dt`
   (el build la ajusta a cada página). Para convertir: `npx @squoosh/cli --avif auto --webp auto foto.jpg` o
   squoosh.app en el navegador. Si pones una URL o ruta con extensión, se usa tal cual.
   Escribe un `alt` que describa la imagen.
4. `caso.solucion`: lista de lo que hiciste. La página del caso se indexa (y entra al sitemap)
   si tiene `caso.reto` o al menos 3 puntos de solución; si no, queda `noindex`.
   Si las imágenes vienen de otro dominio, añádelo a `img-src` en la constante `CSP` de
   `scripts/build.mjs` y en `_headers` (hoy: felipevergel.com, alejandravergel.com,
   vegasdelverde.co, armandomartinez.co, accesoriosencobre.co).
5. `metricas`: sólo se muestran si tienen `periodo`, `fuente` y `"autorizado": true`
   (permiso escrito del cliente). `testimonio`: `null` o `{cita, autor, cargo, autorizado:true}`.
   Con 2 o más testimonios autorizados aparece la sección Testimonios en la home.
6. Ejecuta `node scripts/build.mjs`, revisa localmente y sube los cambios.
7. Para ocultar un proyecto sin borrarlo: `"publicado": false`.

## Decisiones tomadas

- Identidad intacta: paleta, Cormorant Garamond + Readex Pro, easings y tokens. Sólo se
  añadieron tokens (hex sueltos migrados) en el bloque 6 de `tokens.css`. Cuerpo a peso 400.
- Hero: un solo `<h1>` real; "webs que venden" queda como gesto decorativo (`aria-hidden`).
- Sin WebGL, canvas ni pins. Aurora reducida a 3 brumas sólo en escritorio. Todo el
  movimiento respeta `prefers-reduced-motion` y hay botón "Pausar animaciones".
- Interacciones: luz que sigue al cursor en tarjetas, "Arma tu plan" (arma mensaje de
  WhatsApp), pestañas de 4 simulaciones rotuladas "Simulación", fases de Meta Ads con barra
  de progreso, diagrama de medición, vista previa de formatos de contenido, filtros de
  proyectos (con `?servicio=`), FAQ con `<details>`, mini-brief → WhatsApp (funciona sin JS).
- Retirado (auditoría): "en vivo", "No es un video", demo de seguridad, 98/100, 95 %,
  +100 % ventas, 99,98 % uptime, 24/7, "nivel bancario", "+15 formas de pago",
  "talla mundial", KPIs inventados, "Excel" (→ "hoja de cálculo").
- Precios visibles: sólo los vigentes de políticas ($65.000/h, $250.000/mes, $90.000,
  $290.000, 15 %). Web = "Cotización a la medida en 24 h"; Contenido = "Cotiza por WhatsApp".
- Filtros de proyectos visibles siempre (el plan pedía > 6 proyectos; el dueño pidió filtros).
- Logo: monograma tipográfico "rd" en CSS (los PNG del logo no están en esta carpeta).
- Medición (GTM/GA4/Pixel/Clarity) preparada pero apagada; sin banner hasta tener IDs.

## Pendientes para el dueño (preguntas concretas)

**Bloqueantes antes de publicar**
1. **Correo (D1):** el sitio usa `ricardodesingwebs@gmail.com` ("desing"). ¿Ese buzón existe y
   recibe correo, o es `ricardodesignwebs@gmail.com`? ¿Quieres `hola@ricardodesign.co`?
   Se cambia en un solo lugar: `data/servicios.json → contacto.correo`.
2. **Privacidad (D9):** nombre completo o razón social, C.C. o NIT, dirección y fecha de
   vigencia para `/privacidad/` (hoy con `{{...}}` y `noindex`). Recomendada revisión de abogado.
3. **Archivos del repo actual:** al publicar, copiar junto a este sitio `favicon.ico`,
   `favicon-32x32.png`, `favicon-512.png`, `apple-touch-icon.png` (ya existen en producción).

**Precios y paquetes [POR VALIDAR]** (no se muestran cifras inventadas)
4. D2: ¿precio "desde" para una página web?
5. D3/D5: precios y composición de Contenido (Básico 8 piezas, Crecimiento 12-16, Pro 20+),
   permanencia, número de revisiones (el texto dice "hasta 2 rondas") y si se entregan editables.
   ¿Existe el combo Contenido + Ads y a qué precio?
6. D4: precio del Estudio de público (sugerido $150.000-$250.000) y de la Configuración de
   medición (sugerido $250.000-$450.000). ¿El informe mensual + reunión de 30 min entra en el
   plan de $290.000? (la página lo describe en la fase 6).
7. D6: inversión mínima diaria recomendada en Meta (hoy se omite la cifra).
8. D17: rangos del presupuesto del mini-brief (< $500.000 / $500.000-$1.500.000 / > $1.500.000).

**Contenido**
9. D10: medios de pago exactos que integras (el sitio dice "Pagos en línea con Wompi";
   las simulaciones muestran Tarjeta/PSE/Nequi como ejemplo).
10. D11: ¿Google Sheets o Excel? (dice "hoja de cálculo").
11. D15: texto y foto para "Quién está detrás" (hoy: "Soy Ricardo, diseñador y desarrollador
    web en Bucaramanga…", sin foto). Enlaces oficiales de Instagram/Facebook/Google Business.
12. D8: 3 proyectos añadidos (Vegas del Verde, Armando Martínez Garnica, Accesorios en Cobre;
    servicios solo "web", textos tomados de sus sitios públicos: confirmar con el dueño
    si hubo Ads u otros servicios). Destacados en home: Felipe Vergel, Alejandra Vergel y
    Vegas del Verde. Más proyectos, reto de cada caso (para indexar sus páginas), métricas con
    autorización escrita y testimonios reales. Capturas propias para dejar de cargar las
    fotos desde los dominios de los clientes.
13. D16: ¿atiendes sitios con CMS/WordPress? Se cambió "plugins, temas y CMS" por
    "dependencias y servicios conectados" (también en politicas.html).
14. Imagen para compartir (OG) 1200×630: hoy se usa `favicon-512.png`.

**Legal (sin publicar; propuestas en comentarios HTML de politicas.html)**
15. D12: régimen de IVA ("Precios incluyen IVA" se mantiene).
16. D13: cláusulas a revisar con abogado: "dominio inhabilitado", "aprobación tácita",
    "sujeto a cambios sin previo aviso". Nuevas secciones #contenido y #medicion: validar.

**Técnico**
17. D7: IDs de GTM (GA4, Pixel y Clarity van dentro de GTM). Para activar: completar
    privacidad, poner el ID en `assets/js/config-medicion.js`, y ampliar la CSP del `<head>`
    (constante `CSP` en `scripts/build.mjs`) y de `_headers` con los dominios comentados ahí.
18. D14: migrar a Cloudflare Pages/Netlify para que `_headers` aplique (clickjacking, HSTS).
19. Autoalojar fuentes en woff2 (hoy Google Fonts) y medir Lighthouse real tras publicar.
20. Verificación realizada aquí: HTML bien formado, 1 `<h1>` por página, sin saltos de
    encabezados, 0 enlaces/anclas internos rotos, JS sin errores de sintaxis ni de consola,
    sin desborde horizontal a 375 px. En esta máquina no hay Node: el build se probó con
    JavaScriptCore; conviene ejecutarlo una vez con `node scripts/build.mjs`.

## Identidad visual "Cielo vivo" (oct-2026, reemplaza las anteriores)

Fondos siempre claros: blanco, celeste #EEF7FF, lavanda #F3F0FF, hielo #E0F2FE. Texto azul marino #0F1B4C.
Color: azul vivo #2563EB / #1D4ED8, celeste #38BDF8 (decorativo), violeta #7C3AED / #6D28D9.
Naranja/amarillo (#FF8A00, #FFC531) SÓLO en botones principales, CTAs y precios (precio como texto #C2410C).
Fuentes: Sora (títulos, wordmark) + Inter (texto). Ratios: texto 16.39 blanco · 14.28 hielo; tenue ≥5.11;
azul #1D4ED8 ≥5.84; violeta #6D28D9 ≥6.19; precio 5.18 (blanco) / 4.51 (hielo); texto marino sobre botón
naranja 6.94; blanco sobre bloque azul→violeta ≥6.70; WhatsApp blanco sobre #15803D 5.02.

**Intro del nombre (home):** se muestra sólo en la primera visita de cada sesión del navegador
(`sessionStorage` clave `rd_intro`, con try/catch: si falla, se muestra). Dura ~1,5 s + 0,6 s de salida,
se salta con clic, tecla, rueda o toque, y no aparece con `prefers-reduced-motion` ni con
"Pausar animaciones". El h1 está visible y en el DOM desde el inicio (la capa es decorativa, aria-hidden).
Colores vivos decorativos: cian #00C2FF, azul eléctrico #2F5BFF, violeta #8B2CF5, magenta #D21FD8;
bloques con texto blanco usan #1D4ED8 → #7E22CE → #A21CAF (blanco ≥ 6.32).

**Splash (reemplaza la intro de letras):** sólo en el home, primera visita de la sesión
(`sessionStorage` `rd_splash`). Forzar: abrir `index.html?splash=1`. Lo decide `assets/js/splash.js`
(cargado sin defer en el `<head>` del home para evitar parpadeo); sin JS, con reduced-motion o con
"Pausar animaciones" no aparece. Dura ~2,5 s y se salta con clic/tecla/toque/rueda.
**Header:** logo | (Cotizar en ≥640 px) lupa + hamburguesa en todas las páginas; enlaces de escritorio sólo ≥1200 px.
**Búsqueda:** índice estático generado por el build en `data/busqueda.json` y `assets/js/busqueda-indice.js`
(este último es el que usa la página, así funciona también con doble clic/file://).

**Mosaico de proyectos:** cada tarjeta muestra imagen, "Proyecto real", cliente·rubro, título y el campo
nuevo `frase` (≤ 12 palabras). **[POR VALIDAR con el dueño] las 5 frases** fueron condensadas por nosotros
del resumen existente. El detalle (resumen, solución, chips, etiquetas, "Ver en vivo") se abre en una
ventana emergente leída de un `<template>` por proyecto; sin JS, "Ver caso" lleva a la página del caso.
Campo `acento` (vidrio, joyeria, bosque, sepia, cobre, azul) → tokens `--ac-*` en tokens.css.

**Servicios — conmutador temporal "Cuadrícula | Carrusel":** se eligió por defecto cuadrícula; se puede forzar
con `?servicios=carrusel` o `?servicios=cuadricula` (se recuerda en localStorage `rd_svc_vista`). Cuando el
dueño elija, borrar el bloque `.svc-vistas` en `scripts/paginas.mjs` y dejar fijo `data-svc-vista`.
"Ver qué incluye" abre la ventana emergente con todas las viñetas y la nota de precio.
