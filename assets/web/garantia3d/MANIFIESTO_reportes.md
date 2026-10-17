# Reportes (documento) 3D · manifiesto

Modelo: hoja vertical con esquina superior derecha doblada y 3 líneas de texto (la última más corta), trazo monolínea con sección rectángulo redondeado y bisel, negro mate (goma, rugosidad 0,55-0,72), líneas elevadas sobre la hoja. Fondo transparente con sombra de contacto suave. Fuente: `_build/blender/garantia_v1/reportes.blend` (scripts `reportes_lib.py`, `reportes_render.py`, `reportes_empaquetar.py`).

| Archivo | Tamaño px | Uso | AVIF | WebP |
|---|---|---|---|---|
| reportes | 160x160 | 80 px en pantalla (2x) | 1,9 KB | 5,9 KB |
| reportes-320 | 320x320 | 160 px en pantalla (2x) | 3,4 KB | 9,7 KB |
| reportes-inclina | 800x800 (25 cuadros de 160) | inclinación con el puntero | 38,6 KB | 52,7 KB (pasa 40 KB) |
| reportes-gira | 960x640 (24 cuadros de 160) | giro propio continuo | 32,2 KB | 44,2 KB |

Todos con alfa (verificado 0-255).

## Hoja de inclinación
Rejilla 5x5, fila = pitch, columna = yaw, ambos -25, -12,5, 0, +12,5, +25 grados (cuadro central = reposo). Pivote en el centro del ícono.

## Hoja de giro
Rejilla 6x4, orden de lectura (izquierda a derecha, arriba a abajo): cuadro k (0-23) = yaw 15*k grados alrededor del eje vertical. El cuadro 24 sería el 0 (loop perfecto). Sombra fija (plano detrás, no gira). Velocidad sugerida: 1 vuelta cada 8 s = 3 s/9 cuadros, es decir 333 ms por cuadro (3 cuadros por segundo; con `steps(24)` en 8 s).
El documento se hizo más grueso (fondo del trazo 0,20) para que de perfil se lea con volumen.

## Lo flojo
La sombra suave comprimida en WebP alfa muestra bandas leves; AVIF es el principal. La hoja de inclinación en WebP supera 40 KB (52,7 KB); en AVIF cumple.
