# Manifiesto · mantenimiento (servicios 3D)

- Escena: portátil gris aluminio con pantalla animada (tickets de cambios: titular, foto y sección movida; error 404 corregido; medidor de velocidad 62 a 98; lista de verificación) rodeado de engranajes, llave inglesa, escudo con check, reloj "24-48 h" y nube de respaldo. Acento único verde #3E9B76.
- Duración: 8,0 s (192 cuadros) a 24 fps, 960x540, loop (corte de cámara + cortina de recarga en la pantalla en el empalme).
- Fondo: sólido #F6F6F6 (render con alfa sobre #F6F6F6; sombra suave sobre el escritorio).
- Render: Cycles OptiX, 128 samples + denoise OptiX, adaptive sampling, estándar (sin filmic).
- Archivos y pesos:
  - mantenimiento.mp4 · H.264 yuv420p +faststart, CRF 27, bt709 · 345.730 B
  - mantenimiento.webm · VP9 CRF 41 · 326.951 B
  - mantenimiento-poster.avif · 960x540 · 27.231 B
  - mantenimiento-poster.webp · 960x540 · 36.064 B (cuadro 150, pantalla con 98 y checks)
- Fuentes: _build/blender/servicios_v1/mantenimiento.blend, mantenimiento_escena.py, mantenimiento_pantalla.html + mantenimiento_frames.mjs, reloj_cara.png.
- Notas: textos de UI genéricos ("Tu Marca", "tuweb.co"). El tono del #F6F6F6 tras el códec puede variar 1-3 niveles según el reproductor: verificar el empalme con la tarjeta en el navegador. El centro del loop funciona con `loop muted playsinline`.
