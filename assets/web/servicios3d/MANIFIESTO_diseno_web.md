# Servicios 3D · Diseño web (17 oct 2026)

Loop de 10 s, 24 fps (240 cuadros), 960x540 (16:9), fondo #F6F6F6 compuesto por ffmpeg sobre los cuadros RGBA de Blender (el último cuadro enlaza con el primero: cámara continua y la pantalla vuelve al editor en blanco).

| Archivo | Códec | Peso |
|---|---|---|
| diseno-web.mp4 | H.264 high, yuv420p, +faststart, sin audio | 365.464 B (357 KB) |
| diseno-web.webm | VP9, sin audio | 325.006 B (317 KB) |
| diseno-web-poster.avif | cuadro 128 (sitio armándose) | 36.435 B |
| diseno-web-poster.webp | cuadro 128 | 44.014 B |

## Qué se ve
Portátil gris espacial anodizado mate sobre fieltro oscuro y escritorio de roble (veta procedural), con taza de cerámica, planta en maceta de barro, lámpara negra, libreta kraft con lápiz y ratón. Las teclas (ABS mate con serigrafía) se hunden al teclear, sin manos. Pantalla en secuencia de imágenes (HTML/CSS capturado con Playwright, 240 cuadros): editor de código que se escribe con cursor, luego el sitio armándose bloque a bloque (el diseño se reacomoda al ampliar la ventana), y el proceso de compra: producto, agregar a la bolsa, pago, venta confirmada con confeti 3D suave. Una sola cámara con dolly/órbita leve, profundidad de campo; un solo acento (azul #2F6BFF). Sin marcas reales; textos de interfaz genéricos en español ("Casa Duna" es ficticia).

## Técnica
Cycles OptiX, 128 muestras con muestreo adaptativo y denoise OptiX, AgX Base Contrast, película transparente. Fuente: `_build/blender/servicios_v1/diseno_web.blend`, scripts `diseno_web_build.py`, `diseno_web_timeline.py`, `diseno_web_pantalla.html`, `diseno_web_capturar.mjs`, `diseno_web_codificar.sh`.

## Notas
- El fondo del video es #F6F6F6 (medido 245-246 tras la compresión yuv420p); sobre una tarjeta exactamente #F6F6F6 puede verse una diferencia de 1 nivel.
- Flojo: en planos generales el texto de la pantalla no se lee (sí en el plano medio); el mouse no se mueve; las teclas se hunden sin manos.
