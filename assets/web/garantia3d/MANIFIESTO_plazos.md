# PLAZOS (reloj) · ícono 3D de la Garantía

Modelo: aro + horario + minutero + eje, cada pieza una losa de contorno redondeado con bisel suave (sección rectángulo redondeado, fondo 0,18), negro mate (goma del logo rd: rugosidad ~0,55-0,72, sin coat). Agujas y eje por delante del aro. Hora fija 4:00 (horario a -30°). Fondo transparente con sombra de contacto (caja de luz arriba-izquierda, sombra hacia abajo-derecha) sobre papel gris. Fuente: `_build/blender/garantia_v1/plazos.blend` (scripts `plazos_*.py`).

| Archivo | Píxeles | Peso (bytes) |
|---|---|---|
| plazos.avif / .webp | 160×160 (80 px en pantalla) | 2.544 / 5.650 |
| plazos-320.avif / .webp | 320×320 (160 px en pantalla) | 4.621 / 10.742 |
| plazos-inclina.avif / .webp | 800×800, 5×5 cuadros de 160 | 38.257 / 39.182 |
| plazos-gira.avif / .webp | 960×640, 6×4 cuadros de 160 | 41.844 / 45.774 |

Todo con alfa (verificado: alfa 0-255).

## Hoja de inclinación (plazos-inclina)
Fila = pitch, columna = yaw. Valores por índice 0..4: -25, -12.5, 0, +12.5, +25 grados. Cuadro (fila 2, columna 2) = reposo. Yaw positivo (columnas a la derecha): el lado derecho del reloj se aleja de la cámara. Pitch positivo (filas hacia abajo): el borde superior se acerca a la cámara. El papel (sombra) se retira según la inclinación para que el aro no lo atraviese.

## Hoja de giro (plazos-gira)
24 cuadros, orden de lectura (izquierda a derecha, arriba a abajo), cuadro i = yaw i×15° alrededor del eje vertical, 0..345°. El cuadro 24 (360°) es el cuadro 1: loop perfecto. Sombra con papel fijo. Velocidad sugerida: 1 vuelta cada 8 s = 333 ms por cuadro (steps(24)). Se ve de perfil en los cuadros 7 y 19 (el grosor es 0,18 para que no desaparezca).

## Lo flojo
- WebP de las dos hojas: para entrar en el peso, la sombra del WebP de la hoja de inclinación queda con pocos niveles de alfa (bandas planas, algo más marcada que en AVIF). Servir AVIF primero; WebP es solo respaldo.
- plazos-gira.webp pesa 45.774 (tope pedido 46.080).
- Por detrás el reloj se ve en espejo (es un objeto real, no una cara dibujada).
