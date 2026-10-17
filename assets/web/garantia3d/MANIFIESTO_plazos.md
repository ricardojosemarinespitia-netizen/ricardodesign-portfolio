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

## Giro limpio de 72 cuadros (plazos-gira72) — reemplaza a plazos-gira en la web
- Archivos: `plazos-gira72.avif` (78.382 bytes, q55) y `plazos-gira72.webp` (136.812 bytes, q72). Hoja 1728×864, rejilla 12 columnas × 6 filas, cuadros de 144×144 (bajé de 160 a 144 para entrar en peso sin tocar el alfa).
- Orden: lectura izquierda a derecha, arriba a abajo; cuadro i (0..71) = yaw 5°·i alrededor del eje vertical. El cuadro 72 (360°) es el 0: loop perfecto. Velocidad sugerida 1 vuelta cada 8 s (111 ms por cuadro, steps(72)).
- Sin sombra horneada ni plano: solo el objeto sobre alfa transparente (RGB puesto en 0 donde alfa < 3, sin halos ni cuadrados). La sombra la pone la web con CSS.
- Pivote: eje vertical por el centro del aro (x=0, y=0); verificado: el centro vertical del objeto queda en 239,5 px de 480 en los 72 cuadros y el aro no se desplaza. Las agujas, al estar delante, se desplazan lateralmente al girar (es paralaje real).
- Render: Cycles OptiX, 128 muestras con denoise, 480 px reducidos a 144 (Lanczos), cámara ortográfica, negro mate con luces de borde reforzadas. Script `_build/blender/garantia_v1/plazos_g72.py`.
- Lo flojo: el WebP queda cerca del tope (137 KB de 140); la textura de goma se ve con grano fino.
