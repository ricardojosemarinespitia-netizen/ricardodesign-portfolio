# 🎨 PROMPT PARA FABLE - DISEÑO COMPLETO RICARDODESIGN.COM
## INTERFAZ TIPO SPACESHIP + LIQUID GLASS + ANIMACIONES AGRESIVAS

---

## CONTEXTO
Estoy creando un portafolio web premium para un emprendimiento de **creación, mantenimiento y publicidad de páginas web**. El sitio será mi escaparate comercial y debe reflejar profesionalismo, lujo, modernidad y MUCHO movimiento visual.

**Dueño:** Ricardo Marín  
**Ubicación:** Bucaramanga, Colombia  
**Clientes de referencia:** Felipe Vergel (arte en vidrio) y Alejandra Vergel (joyería artesanal)  
**Email:** ricardodesingwebs@gmail.com  
**WhatsApp:** 3027981468  

**REFERENCIA VISUAL:** spaceship.com/es - interfaz moderna con scroll visual agresivo, animaciones en cada sección, elementos que se revelan/transforman al scroll.

---

## 🎯 OBJETIVO PRINCIPAL
Diseñar una **página web one-page ULTRA VISUAL** con:
- ✨ Liquid Glass en toda la página (glassmorphism premium)
- 🎬 ANIMACIONES AGRESIVAS en scroll (parallax extremo, rotate, scale, blur animations)
- 📜 Scroll visual tipo Spaceship - cada sección full-width que se revela/transforma
- 🎨 Paleta luxury: Negro #0f0f0f + Oro #d4a574
- 🔤 Tipografía: Playfair Display (títulos) + Inter (body)
- 📱 100% responsivo
- 🚀 Performance optimizado, sin jank

**TONO VISUAL:** Moderno, sofisticado, con MUCHO movimiento. Cuando el usuario scroll, todo debe moverse, brillar, aparecer, transformarse.

---

## 🎬 FILOSOFÍA DE ANIMACIONES
**"Todo se mueve"** - Pero elegantemente:
- ✅ Scroll parallax (múltiples capas a diferentes velocidades)
- ✅ Elementos que rotan/escalan al scroll
- ✅ Fondos que cambian/se animan
- ✅ Textos que aparecen con animaciones secuenciales
- ✅ Cards que se apilan/desapilan
- ✅ Hover effects en TODO (botones, cards, links)
- ✅ Micro-animaciones (pulse, glow, float)
- ✅ Scroll-triggered blur/unblur
- ✅ Elementos que "siguen" el scroll

---

## 📐 ESTRUCTURA DE LA PÁGINA (Full-Width Sections)

### **1. HEADER/NAVEGACIÓN**
**Comportamiento Spaceship-like:**
- Logo: "Ricardo Design" en oro (#d4a574), animado en scroll
- Navegación sticky con glass effect
- Background: Glass card rgba(255,255,255,0.05) + blur 12px
- Border: 1px solid rgba(255,255,255,0.15)
- **Animación:** 
  - Al scroll down → Header se empequeñece/se hace más oscuro
  - Al scroll up → Header vuelve a tamaño normal
  - Links tienen hover glow effect (#d4a574)

---

### **2. HERO (Sección Full-Width - 100vh)**
**Efecto:** Como hero de Spaceship - impactante, con mucho movimiento

**Elementos:**
- **Fondo animado:** Gradiente oscuro con blobs/shapes que rotan lentamente
  - Colors: #0f0f0f → #1a1a1a con salpicados de oro (#d4a574) 20% opacity
  - Shapes flotan, rotan, cambian tamaño en loop infinito
  
- **Título:** "Tu marca merece una web profesional"
  - Font: Playfair Display Bold 800, 3.5rem
  - Color: #ffffff
  - **Animaciones:**
    - Fade-in al cargar (0 → 1 en 800ms)
    - Slight parallax con mouse movement
    - Letter-spacing animado (1px → 2px) al hover
    - Glow effect subtle (#d4a574)

- **Subtítulo:** "Creamos y mantenemos sitios web que conviertan visitantes en clientes. Diseño minimalista, rendimiento premium, resultados reales."
  - Font: Inter 400, 1.2rem
  - Color: #a8a8a8
  - **Animación:**
    - Aparece con delay 200ms
    - Slide-up: translateY(40px) → 0
    - Opacity 0 → 1

- **CTAs (Botones):**
  - Botón 1: "Ver Portfolio" (Fondo #1a1a1a, border oro)
  - Botón 2: "Consulta Gratis" (Fondo #25d366 WhatsApp)
  - **Animaciones:**
    - Aparecen en stagger (200ms de diferencia)
    - Hover: scale(1.08) + glow + box-shadow doble
    - Click: pulse animation
    - Buttons flotean ligeramente (animation: float 3s ease-in-out infinite)

- **Scroll Indicator:**
  - Flecha que baja/sube suavemente
  - Desaparece al scroll

---

### **3. SERVICIOS (Full-Width Section)**
**Efecto:** Sección que se revela al scroll (como Spaceship)

**Layout:**
- Título: "Servicios" (Playfair Display 2.5rem, bold)
  - **Animación:** Aparece al scroll-into-view con scale + fade (0.8 → 1)
  - Underline oro que "dibuja" en línea (width 0 → 100%)

- **Grid 3 Columnas** (responsive 1 en móvil)
- Cada card con glass effect + animaciones secuenciales

**CARD 1: Creación Web 🎨**
```
Contenido:
- Ícono: 🎨 (animado - gira en hover)
- Título: "Creación Web" (Inter Bold, oro)
- Descripción: "Diseño responsivo, moderno y orientado a conversiones. Cada proyecto es único y adaptado a tu marca."

Glass Card:
- Background: rgba(255, 255, 255, 0.08)
- Blur: 16px
- Border: 1px solid rgba(255, 255, 255, 0.15)
- Border-radius: 12px
- Padding: 2rem

Animaciones:
- Aparece al scroll con delay (card 1: 0ms, card 2: 100ms, card 3: 200ms)
- Fade-in + slide-up simultáneo
- Hover: 
  * scale(1.05)
  * Blur aumenta a 20px
  * Glow effect oro
  * Ícono rota 360°
  * Background más opaco (0.12)
- Border cambia color al hover (más visible)
```

**CARD 2: Mantenimiento ⚙️**
```
- Ícono: ⚙️ (animado - gira infinito en hover)
- Título: "Mantenimiento"
- Descripción: "Actualizaciones, seguridad, rendimiento. Tu web siempre funcionando al 100% sin preocupaciones."
- Mismas animaciones que Card 1 pero con delay 100ms
```

**CARD 3: Publicidad Digital 📢**
```
- Ícono: 📢 (animado - pulsa en hover)
- Título: "Publicidad Digital"
- Descripción: "Campañas en Meta Ads y Google Ads. Tráfico calificado que convierte en ventas reales."
- Mismas animaciones pero con delay 200ms
```

---

### **4. PORTFOLIO (Full-Width Section - Card Stacking)**
**Efecto:** Tipo Spaceship - sección que se "desvela" al scroll

**Título:** "Proyectos" (Playfair Display 2.5rem)
- Animación: Underline oro que se dibuja (animation: drawLine 800ms ease)

**Layout: 2 Columnas** (responsive 1 en móvil)
- Scroll-triggered: Cuando entres en viewport, las cards se revelan

**PROYECTO 1: Felipe Vergel**
```
Glass Card Container:
- Background: rgba(245, 245, 245, 0.08)
- Blur: 14px
- Border: 1px solid rgba(255, 255, 255, 0.12)
- Border-radius: 12px

Contenido:
- Imagen/Ícono: 🎨 (fondo gradiente oro/terracota)
  * Animación: Parallax vertical (muévete diferente al scroll)
  * Hover: Scale(1.1) + rotate(2deg)

- Nombre: "Felipe Vergel" (Playfair Display 1.5rem, bold)
  * Animación: Fade-in con delay

- Descripción: "E-commerce de arte en vidrio. Diseño elegante, colecciones exclusivas, sistema de suscripción VIP."
  * Font: Inter 0.9rem, #a8a8a8
  * Animación: Slide-up al scroll-into-view

- CTA: "Ver sitio →" (link a https://felipevergel.com)
  * Color: #d4a574
  * Animación: Hover → underline animado + glow

Card Animations:
- Aparece al scroll con: opacity 0 → 1 + translateY(40px) → 0
- Hover: 
  * scale(1.03)
  * Blur aumenta
  * Box-shadow más pronunciada
  * Ícono rotación 360°
  * Más luminoso
```

**PROYECTO 2: Alejandra Vergel**
```
- Ícono: ✨ (fondo gradiente oro)
- Nombre: "Alejandra Vergel"
- Descripción: "Joyería artesanal de autor. Catálogo de productos con filtros, carrito inteligente e integración WhatsApp."
- Link: https://alejandravergel.com
- Mismas animaciones pero con delay 150ms
```

**Efecto Stacking:**
- Al scroll, las cards se revelan una tras otra
- Parallax en las imágenes (diferente velocidad)
- Números de proyecto (01, 02) que aparecen/desaparecen al scroll

---

### **5. CTA ADS (Full-Width Section - High Impact)**
**Efecto:** Sección que demanda atención - tipo Spaceship landing

**Background:**
- Gradiente: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)
- Overlay glass: rgba(255, 255, 255, 0.04) con blur 10px
- Animated blobs/shapes de fondo (rotación lenta)
- Parallax extremo en fondo

**Contenido Centrado:**
- Título: "¿Necesitas una web como estas?" (Playfair Display Bold, 2.2rem, #ffffff)
  - Animación: Scale + glow al scroll-into-view
  
- Subtítulo: "Somos especialistas en crear webs que no solo se ven bien, sino que generan resultados."
  - Font: Inter 1.1rem, opacity 0.9
  - Animación: Fade-in con delay

**CTAs Duales:**
- Botón 1: "Ver más detalles" 
  - Background: #d4a574 (oro)
  - Text: #0f0f0f (negro)
  - Animación: Hover scale(1.1) + shadow glow
  
- Botón 2: "Hablar con nosotros" (WhatsApp)
  - Background: #25d366 (verde)
  - Text: #ffffff
  - Link: https://wa.me/3027981468?text=Hola%20Me%20interesa%20conocer%20tus%20servicios%20de%20creación%20de%20webs
  - Animación: Hover scale(1.1) + pulse + glow

**Animaciones de la sección:**
- Al scroll-into-view: Fondo se anima más rápido
- Buttons aparecen con stagger animation
- Text tiene parallax sutil
- Glow effects se activan

---

### **6. FOOTER**
**Background:** #0f0f0f (negro puro)
- Glass overlay sutil: rgba(255, 255, 255, 0.02)

**Contenido:**
- 📱 WhatsApp: <a href="https://wa.me/3027981468">3027981468</a>
- 📧 Email: ricardodesingwebs@gmail.com
- Copyright: "© 2026 Ricardo Design. Diseño minimalista. Resultados reales."

**Tipografía:** Inter 400, 0.9rem, color #aaa
**Enlaces:** Color oro (#d4a574), hover underline

---

## ✨ LISTA COMPLETA DE ANIMACIONES

### **On Load:**
- Hero fade-in staggered (título → subtítulo → botones)
- Blobs de fondo comienzan a rotar
- Scroll indicator aparece con pulse

### **On Scroll (Continuous):**
1. **Parallax extremo:**
   - Fondos se mueven lentamente (different speeds)
   - Imágenes portfolio diferentes velocidades
   
2. **Fade-in on scroll-into-view:**
   - Títulos: scale(0.8) + opacity 0 → scale(1) + opacity 1
   - Cards de servicios: slideUp + fadeIn con delays
   - Portfolio: slideUp + fadeIn staggered
   
3. **Floating animations:**
   - Buttons flotan ligeramente (float 3s ease-in-out infinite)
   - Elementos decorativos "flota" al scroll
   
4. **Rotating elements:**
   - Iconos rotan 360° on hover
   - Shapes de fondo rotan lentamente
   
5. **Glowing effects:**
   - Glow oro en hover de elementos
   - Buttons tienen glow al hover
   - Titles tienen glow sutil al scroll-into-view
   
6. **Blur animations:**
   - Blur aumenta/disminuye al hover en cards
   - Blur extremo en algunos backgrounds al scroll
   
7. **Underline drawing:**
   - Títulos: width 0 → 100% (línea se dibuja)
   - Links: underline animado on hover
   
8. **Scale & Transform:**
   - Cards scale(1.03) on hover
   - Images rotate(2deg) on hover
   - Buttons scale(1.08) on hover
   
9. **Stagger animations:**
   - Cards aparecen con delays (0ms, 100ms, 200ms)
   - Portfolio cards: (0ms, 150ms)
   - Buttons: (0ms, 200ms)

### **On Hover:**
- Cards: scale + enhanced blur + glow
- Buttons: scale + pulse + shadow
- Links: color oro + underline animated
- Icons: rotate 360° + scale
- Everything: Subtle glow effect oro

---

## 🎨 PALETA DE COLORES (Exactos)

```css
/* Colores principales */
--color-bg-dark: #0f0f0f;                    /* Fondo principal */
--color-bg-section: #1a1a1a;                 /* Secciones */
--color-text-primary: #ffffff;               /* Texto principal */
--color-text-secondary: #a8a8a8;             /* Texto secundario */
--color-accent-gold: #d4a574;                /* Oro (IMPORTANTE) */
--color-glass-light: rgba(255, 255, 255, 0.08);
--color-glass-border: rgba(255, 255, 255, 0.15);
--color-glass-hover: rgba(255, 255, 255, 0.12);
--color-cta-whatsapp: #25d366;               /* WhatsApp green */
--color-glow-gold: rgba(212, 165, 116, 0.3); /* Glow oro */
```

---

## 🔤 TIPOGRAFÍA (Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600&display=swap');

/* Display (Títulos) */
--font-display: 'Playfair Display', serif;
--font-display-weight: 700;
--font-display-weight-bold: 800;
--font-display-tracking: 1px;

/* Body */
--font-body: 'Inter', sans-serif;
--font-body-weight: 400;
--font-body-weight-medium: 500;
--font-body-weight-semibold: 600;
--font-body-tracking: -0.3px;
```

**Tamaños:**
- H1 (Hero): 3.5rem
- H2 (Secciones): 2.5rem
- H3 (Subtítulos): 1.5rem
- Body: 1rem
- Small: 0.9rem

---

## 📱 RESPONSIVE (Mobile First)

```css
/* Mobile: 320px - 640px */
- 1 columna en grids
- Font sizes reducidos 20%
- Full-width sections con padding menos
- Header compacto

/* Tablet: 641px - 1024px */
- 2 columnas cuando sea apropiado
- Font sizes 90%
- Padding más generoso

/* Desktop: 1025px+ */
- 3 columnas servicios
- 2 columnas portfolio
- Font sizes normales
- Todas animaciones activas
```

---

## 🚀 OPTIMIZACIONES TÉCNICAS

- ✅ CSS puro (sin Tailwind, sin Bootstrap)
- ✅ JavaScript vanilla (IntersectionObserver para scroll triggers)
- ✅ Google Fonts optimizadas
- ✅ Parallax con transform/translateZ (GPU accelerated)
- ✅ Animaciones con @keyframes
- ✅ will-change estratégico (solo en elementos animados)
- ✅ Lazy loading para potenciales imágenes
- ✅ Performance score 90+
- ✅ Mobile-first approach
- ✅ Semantic HTML5
- ✅ Sin dependencias externas (CERO librerías)

---

## 📊 ESTRUCTURA DE ARCHIVOS

```
ricardodesign-portfolio/
├── index.html              # Todo en uno (HTML + CSS + JS inline)
├── css/                    # Opcional (separado si prefieres)
│   ├── styles.css
│   └── animations.css
├── js/                     # Opcional (separado si prefieres)
│   └── main.js
├── README.md
└── .gitignore
```

**RECOMENDACIÓN:** Entrega todo en `index.html` con `<style>` e `<script>` internos (más fácil para copy-paste).

---

## 🔗 DATOS FUNCIONALES

- **Dominio:** ricardodesign.com
- **Email:** ricardodesingwebs@gmail.com
- **WhatsApp:** 3027981468
- **WhatsApp Link:** https://wa.me/3027981468?text=Hola%20Me%20interesa%20conocer%20tus%20servicios%20de%20creación%20de%20webs
- **Portfolio 1:** https://felipevergel.com
- **Portfolio 2:** https://alejandravergel.com
- **GitHub Repo:** https://github.com/ricardojosemarinespitia-netizen/ricardodesign-portfolio

---

## 🎯 CHECKLIST FINAL PARA FABLE

- ✅ Interfaz tipo Spaceship (full-width, scroll visual agresivo)
- ✅ Liquid Glass en TODA la página (glassmorphism premium)
- ✅ BASTANTES animaciones (parallax, fade, scale, rotate, glow, blur, float, pulse)
- ✅ Paleta exacta: #0f0f0f + #d4a574 + #ffffff
- ✅ Tipografía exacta: Playfair Display + Inter
- ✅ Google Fonts incluidos en HTML
- ✅ Links funcionales (WhatsApp 3027981468, Felipe, Alejandra, email)
- ✅ Responsive perfecto (mobile/tablet/desktop)
- ✅ Sin dependencias externas
- ✅ IntersectionObserver para scroll triggers
- ✅ Animaciones suaves, sin jank
- ✅ Copy-paste ready (código completo en una respuesta)
- ✅ Performance optimizado

---

## 💡 VISIÓN FINAL

Cuando alguien entra a ricardodesign.com desde un anuncio de Meta Ads debe sentir:

✨ **"Wow, este tipo es PROFESIONAL y sus webs se ven INCREÍBLES"**
✨ **"Tiene clientes de lujo (Felipe, Alejandra)"**
✨ **"Los efectos visuales son modernos y atrapan"**
✨ **"Quiero que ME haga una web así"**
✨ **"Debo contactarlo AHORA"**

---

## 🚀 PETICIÓN FINAL A FABLE

**¿PUEDES CREAR TODO ESTO?**

Necesito el código **COMPLETO Y FUNCIONAL** en HTML + CSS + JavaScript que pueda copiar y pegar directamente en GitHub y verlo en vivo.

**Referencia:** spaceship.com/es - pero con Liquid Glass, colores oro/negro y tus animaciones suaves premium.

=================================================================================
```

Ahora voy a actualizar en GitHub:
