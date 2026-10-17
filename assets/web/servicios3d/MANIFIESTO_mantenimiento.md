# Manifiesto · mantenimiento (servicios 3D) · v2 realista

- Escena: portátil en aluminio anodizado gris espacio (micro-rugosidad, bordes biselados) con teclado ABS negro mate y serigrafía legible, sobre fieltro y escritorio de madera clara con veta. Pantalla animada (tickets de cambios: titular, foto y sección movida; error 404 corregido; medidor 62 a 98; lista de verificación). Alrededor: engranajes de latón / acero pavonado / bronce, llave inglesa de acero forjado con empuñadura de goma, escudo esmaltado con borde bruñido y check verde, reloj con carcasa de aluminio y esfera impresa "24-48 h", nube de respaldo en vidrio esmerilado, taza de cerámica y planta. Acento único verde #3E9B76.
- Duración 8,0 s (192 cuadros), 24 fps, 960x540. Bucle cerrado: la cámara orbita en una trayectoria periódica (sin corte) y la pantalla se disuelve al estado inicial en el último segundo.
- Fondo #F6F6F6 sólido (mundo de render para rayos de cámara; el escritorio se funde al fondo con la distancia).
- Render: Cycles OptiX, 128 samples + denoise OptiX, adaptive sampling, profundidad de campo suave, luz cálida (key) + fría (relleno) + contraluz.
- Archivos y pesos:
  - mantenimiento.mp4: H.264 yuv420p +faststart, bt709, CRF 32,5: 367961 B
  - mantenimiento.webm: VP9 CRF 49: 328098 B
  - mantenimiento-poster.avif: 39432 B
  - mantenimiento-poster.webp: 40414 B (cuadro 160, medidor en 98)
- Caché: mismos nombres que v1; usar ?v=2 en el src de video y póster.
- Fuentes: _build/blender/servicios_v1/mantenimiento.blend (v1 conservada como mantenimiento_v1.blend), mantenimiento_escena.py, mantenimiento_pantalla.html, mantenimiento_frames.mjs, mant_teclado_tex.py, reloj_cara.png.
- Notas: el tono #F6F6F6 tras el códec varía 1-3 niveles según el reproductor: verificar el empalme con la tarjeta en el navegador. El mp4/webm van cerca del tope de peso: el grano de la madera y la profundidad de campo cuestan bits.
