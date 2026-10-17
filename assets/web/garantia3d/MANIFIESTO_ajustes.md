# Ajustes (controles) · ícono 3D de la Garantía

Tres sliders con perilla en aro (izquierda-derecha-centro: arriba a la derecha, centro a la izquierda, abajo al centro-derecha). Negro mate (goma), trazo de sección rectángulo redondeado con bisel, remates redondeados. Perillas por delante de las barras. Fondo transparente (alfa) con sombra de contacto suave. Fuente: `_build/blender/garantia_v1/ajustes.blend` (scripts `ajustes_*.py`).

| Archivo | Tamaño px | Uso | AVIF | WebP |
|---|---|---|---|---|
| ajustes | 160x160 | 80 px en pantalla (2x) | 1,9 KB | 3,1 KB |
| ajustes-320 | 320x320 | 160 px en pantalla (2x) | 3,3 KB | 6,8 KB |
| ajustes-inclina | 800x800 (5x5 cuadros de 160) | inclinación con el puntero | 33,1 KB | 37,4 KB |
| ajustes-gira | 960x640 (6x4 cuadros de 160) | giro propio, una vuelta | 27,4 KB | 31,5 KB |

## Hoja de inclinación (ajustes-inclina)
25 cuadros, fila = pitch, columna = yaw, ambos -25, -12,5, 0, +12,5, +25 grados (cuadro central = frontal). Pitch y yaw son rotaciones de Blender (X y Z) del grupo; si en la web el sentido sale invertido, invierte el índice.

## Hoja de giro (ajustes-gira)
24 cuadros, una vuelta completa alrededor del eje vertical, yaw = 0, 15, 30 ... 345 grados. Orden: lectura normal, 6 columnas por 4 filas (cuadro k = fila k div 6, columna k mod 6). Loop perfecto: el cuadro 24 (345 grados) enlaza con el 1 (0 grados). Sombra fija bajo el ícono. Velocidad sugerida: una vuelta cada 8 s (333 ms por cuadro). Es una pieza con grosor (trazo 0,13 de ancho por 0,20 de fondo; perillas 0,15 por delante), así que de perfil se lee como volumen.

## Notas
- Alfa verificado (0..255). La sombra se desvanece en el 12 % exterior de cada cuadro para que no se vea el corte.
- En WebP la sombra pierde suavidad (alfa cuantizado para entrar en peso); AVIF es la fuente buena: úsalo primero en `<picture>`.
- Render: Cycles OptiX, 96 muestras con denoise a 320 px, reducido a 160 con Lanczos.
