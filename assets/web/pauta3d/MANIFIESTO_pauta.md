# Pauta 3D · sección "PAUTA EN META Y GOOGLE" (18 oct 2026)

Loop de 9 s, 24 fps (216 cuadros), 960x540 (16:9), fondo #F6F6F6 compuesto con ffmpeg sobre cuadros RGBA de Blender (mismo patrón y luz que servicios3d). Se eligió 16:9 a 960x540 para usar la misma caja, topes de peso y códigos que las 4 escenas de Servicios.

| Archivo | Códec | Peso |
|---|---|---|
| pauta.mp4 | H.264 High, yuv420p, +faststart, sin audio, 2 pasadas 320k | 363.385 B |
| pauta.webm | VP9, sin audio, 2 pasadas 290k | 298.368 B |
| pauta-poster.avif | cuadro 130 (AV1 crf 22) | 9.656 B |
| pauta-poster.webp | cuadro 130 (q90) | 21.536 B |
| pauta-fotogramas-clave.webp | hoja de 6 cuadros (1, 40, 80, 120, 160, 200) | referencia, no publicar |

## Escena
Una cámara continua en órbita suave sobre un estudio gris: portátil de aluminio cepillado con un buscador genérico ("pastelería cerca", primer resultado "Anuncio · Tu marca" que se resalta con borde azul tenue y botón "Escribir"), celular grafito flotante con feed en bucle (anuncio "Enviar mensaje", video corto, mapa "Cómo llegar"), tarjeta de mapa en papel sobre vidrio esmerilado con pin de laca negra y anillos de alcance azul tenue. Hilos finos de vidrio con cuentas de luz viajan desde las pantallas y las fichas hasta el pin (el cliente). Cinco fichas de aluminio con íconos abstractos (lupa, play, chat, nota, pin) flotan alrededor. Sin logos de marcas, sin cifras, sin precios ni promesas.

Loop: toda animación usa frecuencias enteras de 216 cuadros (cámara, flotación) o 72 (anillos, cuentas, pin); el buscador se funde a vacío al final y el feed avanza exactamente una tira. Diferencia media cuadro 216→1: 1,83 (igual que entre cuadros 1→2: 1,69).

## Integración (la hace otro agente; no se tocó la web)
- Escritorio: a la derecha del listado Meta / Google / TikTok, en columna de ~50-55 % del ancho, `aspect-ratio: 16/9`, alineado verticalmente con el bloque de texto, sin agregar altura a la sección.
- Móvil: debajo del título y encima del listado, ancho completo, 16:9 (≈200 px de alto en 360 px), o debajo del listado si se quiere no empujar el texto.
- `<video autoplay muted loop playsinline preload="none" poster="pauta-poster.webp">` con webm primero y mp4 de respaldo; cargar con IntersectionObserver; en `prefers-reduced-motion` y WebView de Instagram/Facebook mostrar solo el póster (avif con webp de respaldo dentro de `<picture>`). Fondo de la sección #F6F6F6 para empalmar.

## Fuente
`FINAL/_build/blender/pauta_v1/`: `pauta.blend`, `pauta_build.py` (escena), `gen_tex.py` (pantallas, mapa, íconos con Figtree), `pauta_codificar.sh`, cuadros en `render/f_0001..0216.png`. Render Cycles OptiX 128 muestras, umbral 0,02, denoise OptiX albedo+normal, seed fijo, clamp indirecto 4, Standard exposición -0,55.
