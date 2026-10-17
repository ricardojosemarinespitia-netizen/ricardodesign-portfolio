# Ícono ENTREGABLES (diana) · 3D en Blender, negro mate (lenguaje del logo rd)

Modelo: 3 aros concéntricos (sección rectángulo redondeado 0,13 x 0,28 con bisel) + centro sólido, separados en profundidad (paralaje). Material goma negro mate (rugosidad 0,55-0,72, sin espejo ni clearcoat). Fondo transparente. Sombra de contacto suave y FIJA (igual en todos los cuadros) compuesta aparte.
Fuente: `_build/blender/garantia_v1/entregables.blend` (scripts `entregables_build.py`, `entregables_render.py`, `ent_assets.py`).

| Archivo | Tamaño px | Uso en pantalla | AVIF | WebP |
|---|---|---|---|---|
| entregables | 160x160 | 80 px (2x) | 3,4 KB | 3,7 KB |
| entregables-320 | 320x320 | 160 px (2x) | 6,8 KB | 8,3 KB |
| entregables-inclina | 800x800 (5x5 de 160) | puntero | 36,1 KB | 38,5 KB |
| entregables-gira | 960x640 (6x4 de 160) | giro continuo | 40,5 KB | 44,7 KB |

## Hoja de inclinación (entregables-inclina)
Rejilla 5x5, cuadro 160x160. Fila = pitch (arriba a abajo: -25, -12,5, 0, +12,5, +25 grados). Columna = yaw (izquierda a derecha: -25, -12,5, 0, +12,5, +25 grados). Cuadro central (fila 3, col 3) = reposo.

## Hoja de giro (entregables-gira)
Rejilla 6x4, cuadro 160x160, 24 cuadros, lectura por filas (izquierda a derecha, arriba a abajo). Cuadro i = yaw i x 15 grados alrededor del eje vertical (0 a 345). El cuadro 24 (345) enlaza con el 1 (0): loop perfecto. Velocidad sugerida: 1 vuelta cada 8 s (cada cuadro 333 ms, o interpolar con 24 pasos `steps(24)` sobre 8 s). Sombra fija.

## Notas
- Pieza con grosor (0,28) para que se vea bien de perfil al girar.
- Pesos con alfa verificado (0-255) en todos. La sombra va con calidad de alfa baja en WebP (para entrar en peso): se ve algo escalonada; AVIF es la fuente principal.
