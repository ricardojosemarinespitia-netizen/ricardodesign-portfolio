# Propuesta de identidad · ricardodesign.co · 2026-10-09

**Estado: propuesta para que Ricardo escoja. No se aplicó nada al sitio.**
Origen: hallazgo 7 de `AUDITORIA_2026-10-09.md` (identidad 4/10, anti-slop 3/10, tipografía 4/10:
Inter en todo, violeta/índigo con degradado, `background-clip:text` en 5 lugares, glass en la nav,
eyebrow en pill, itálica sobre una sola palabra del H1).

## Lo que no cambia en ninguna dirección

- WhatsApp sigue siendo el canal espinal, con mensaje prellenado por servicio (A.8, LA-01).
- Contenido real: los 5 casos (Felipe, Alejandra, Armando, Rafael, Vegas) con capturas propias.
- Dupla serif expresiva + sans quieta (A.2), escala clamp() (A.3), base 4px (A.4), curva de
  autor `cubic-bezier(.2,.7,.3,1)` (A.5), reduced-motion a .01ms (A.7).
- Se retiran en las tres: Inter/Sora/Unbounded, el degradado azul→violeta, el texto con
  `background-clip:text`, el glass por defecto de la nav y el eyebrow en pill.
- **Pendiente del oro (MEJORAS §7.1):** cada dirección dice qué hace con él.

Ratios WCAG calculados con la fórmula de luminancia relativa (sRGB), no estimados.

---

## Dirección A · "Plano de obra"

**Tesis:** Ricardo diseña sitios como se diseña una obra: con planos, cotas y entregas por etapa
(el estudio también trabaja en Revit/BIM; es un material propio, no prestado).
**Metáfora:** el sitio es un juego de planos. Cada servicio es una lámina con cajetín real
(cliente, alcance, plazo, precio desde), las cotas miden cosas verdaderas ("10 días hábiles",
"15 días de garantía") y el proceso es una secuencia de entregas que sí tiene orden.

| Rol | Nombre | Hex | Ratio |
|---|---|---|---|
| Superficie | papel milimetrado | `#E8ECE6` | — |
| Texto | grafito | `#22262A` | 12.75:1 sobre papel |
| Texto secundario | grafito 2H | `#5B6168` | 5.24:1 |
| Acento (enlaces, cotas) | lápiz azul de dibujo | `#2F5E9E` | 5.46:1 |
| Alerta / marca de revisión | bermellón de corrección | `#B33A22` | 4.96:1 (solo ≥ 18px o íconos) |

**Dupla:** Source Serif 4 (óptica display, peso 600 en titulares) + IBM Plex Sans; IBM Plex Mono
solo para cotas y cajetines.
**Firma de movimiento:** al entrar cada lámina, la línea de cota se traza (`stroke-dashoffset`,
600ms, curva de autor) y luego aparece la cifra. Una sola vez por sección.
**Oro:** desaparece. El "premium" lo da la precisión del dibujo, no un metal.

```css
:root{
  --papel:#E8ECE6; --grafito:#22262A; --grafito-2h:#5B6168;
  --lapiz-azul:#2F5E9E; --bermellon:#B33A22;
  --fuente-display:"Source Serif 4",Georgia,serif;
  --fuente:"IBM Plex Sans",system-ui,sans-serif;
  --fuente-cota:"IBM Plex Mono",ui-monospace,monospace;
  --radio-base:2px; --linea-cota:1px solid var(--lapiz-azul);
}
```

**Riesgos:**
- Puede leerse como estudio de arquitectura y no de web/publicidad: el H1 tiene que decir el
  servicio sin ambigüedad.
- Hairlines + radio 2px + rejilla tiran hacia el default "broadsheet" de IA; lo salva que las
  cotas midan datos reales y que haya color de los casos en las capturas.
- Las cotas son de alto mantenimiento: si un plazo cambia en `servicios.json`, la cota debe leerlo
  de ahí, no estar escrita a mano.

---

## Dirección B · "Muestrario del taller"

**Tesis:** el estudio no tiene un material propio; trabaja con el de sus clientes (vidrio, cobre,
filigrana, pergamino, bosque). Su identidad es saber traducir cada uno.
**Metáfora:** un muestrario de taller. La base es neutra y callada; cada caso trae su muestra de
color sacada de los `tokens.css` reales de ese cliente, y al abrirlo **tiñe la página** con su
acento.

| Rol | Nombre | Hex | Ratio |
|---|---|---|---|
| Superficie | piedra de Barichara (medir contra foto real antes de fijarla) | `#ECE7DD` | — |
| Texto | carbón de fragua | `#1E2230` | 12.84:1 |
| Texto secundario | ceniza | `#56606E` | 5.17:1 |
| Acento por defecto | latón de banco | `#7A4A26` | 6.01:1 |
| Inverso | carbón / blanco | `#1E2230` / `#FFFFFF` | 15.83:1 |
| Muestras | las de cada cliente | terracota Felipe, rosa Alejandra, lacre Armando, cobre Rafael, verde Vegas | se verifica cada una al aplicarla |

**Dupla:** Spectral (300 en titulares grandes, 500 en nombres de caso) + Public Sans.
**Firma de movimiento:** View Transition al entrar a un caso: `--acento` cambia al del cliente y
la muestra crece desde su miniatura hasta el encabezado (480ms, curva de autor).
**Oro:** se convierte en "latón de banco", la herramienta del taller; deja de ser lujo genérico y
pasa a ser el color de la mano que trabaja.

```css
:root{
  --piedra:#ECE7DD; --carbon:#1E2230; --ceniza:#56606E; --laton:#7A4A26;
  --acento:var(--laton); /* cada caso lo reemplaza: [data-caso="felipe"]{--acento:var(--muestra-felipe)} */
  --fuente-display:"Spectral",Georgia,serif;
  --fuente:"Public Sans",system-ui,sans-serif;
  --radio-base:4px;
}
```

**Riesgos:**
- La superficie queda cerca del default "crema + serif" que la casa prohíbe como punto de partida;
  solo vale si se mide contra una foto real de piedra de Barichara y se documenta.
- Cinco acentos de cliente pueden volver ruidosa la portada: en el índice solo se ven como
  muestras pequeñas; el teñido completo ocurre dentro del caso.
- Depende de que los clientes acepten que su paleta aparezca en el sitio del estudio.

---

## Dirección C · "El mensaje primero" (convencional con un quiebre)

**Tesis:** casi todo lo que vende el estudio empieza y termina en un mensaje de WhatsApp.
**Metáfora:** el hilo de la conversación. El quiebre es un solo componente: el H1 es el mensaje
que el visitante va a enviar, con fichas editables (servicio, tipo de negocio, ciudad) y vista
previa; el botón dice "Abrir WhatsApp con este mensaje". El resto del sitio es sobrio y rápido.
Conserva el marino y el naranja de hoy, así la migración es la más barata.

| Rol | Nombre | Hex | Ratio |
|---|---|---|---|
| Superficie | pantalla | `#F5F6F8` | — |
| Texto | noche de Bucaramanga (el marino actual) | `#14182B` | 16.25:1 |
| Texto secundario | pizarra | `#5A6072` | 5.80:1 |
| CTA (fondo) | naranja actual, aclarado | `#FF9A3D` con texto `#14182B` | 8.32:1 |
| Acento sobre claro | ámbar oscuro | `#B45309` | 4.64:1 (solo ≥ 18px) |
| Superficie inversa | noche / pantalla | `#14182B` / `#F5F6F8` | 16.25:1 |

**Dupla:** Newsreader (titulares, 500; itálica solo en citas de clientes) + Atkinson Hyperlegible
(cuerpo e interfaz; la legibilidad es argumento de venta para un público que llega desde el celular).
**Firma de movimiento:** al cambiar una ficha, la vista previa del mensaje se reescribe palabra a
palabra (opacity + translateY por palabra, 220ms, curva de autor). Nada más se mueve en el hero.
**Oro:** desaparece; el ámbar hace de acento cálido sin pretender ser metal.

```css
:root{
  --pantalla:#F5F6F8; --noche:#14182B; --pizarra:#5A6072;
  --cta:#FF9A3D; --cta-texto:var(--noche); --ambar:#B45309;
  --fuente-display:"Newsreader",Georgia,serif;
  --fuente:"Atkinson Hyperlegible",system-ui,sans-serif;
  --radio-base:4px;
}
```

**Riesgos:**
- Es la menos memorable de las tres; si la vista previa del mensaje no queda impecable, el sitio
  vuelve a parecer una landing genérica.
- No debe imitar la interfaz ni el verde de WhatsApp (marca de terceros): el hilo usa la gramática
  propia del estudio.
- Pasa la prueba del logo solo por el copy: los textos de las fichas tienen que hablar de los
  negocios reales de Santander.

---

## Comparación rápida

| | A · Plano de obra | B · Muestrario del taller | C · El mensaje primero |
|---|---|---|---|
| Clasificación | expresivo | expresivo | convencional con un quiebre |
| Prueba del logo | fuerte | fuerte | media |
| Costo de migración | alto (nuevas láminas y cotas) | medio-alto (View Transitions + muestras) | bajo (conserva colores, cambia tipografía y hero) |
| Riesgo principal | parecer estudio de arquitectura | caer en el default crema | quedar genérico |

## Qué necesito de ti para seguir

1. Escoge una dirección (o una mezcla explícita, p. ej. "C con las muestras de B").
2. Si es B: una foto real de piedra de Barichara (o la referencia que quieras) para medir la superficie.
3. Visto bueno de los clientes si su paleta va a aparecer en el sitio (B).

Con eso preparo el plan completo (wireframe ASCII con el quiebre de ritmo, tokens finales, escala
tipográfica y expectativas comprobables) antes de tocar código.
