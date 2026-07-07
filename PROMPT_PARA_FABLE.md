# 🎨 PROMPT PARA FABLE - DISEÑO COMPLETO RICARDODESIGN.COM

## CONTEXTO
Estoy creando un portafolio web premium para un emprendimiento de **creación, mantenimiento y publicidad de páginas web**. El sitio será mi escaparate comercial y debe reflejar profesionalismo, lujo y modernidad.

**Dueño:** Ricardo Marín  
**Ubicación:** Bucaramanga, Colombia  
**Clientes de referencia:** Felipe Vergel (arte en vidrio) y Alejandra Vergel (joyería artesanal)  
**Email:** ricardojosemarinespitia@gmail.com  
**WhatsApp:** +57 322 850 5472  

---

## 🎯 OBJETIVO
Diseñar una **página web one-page premium** con:
- ✨ Efecto Liquid Glass (Glassmorphism) en toda la página
- 📜 Scroll visual con animaciones parallax, reveal y stacking
- 🎨 Paleta luxury: Negro (#0f0f0f) + Oro (#d4a574)
- 🔤 Tipografía: Playfair Display (títulos) + Inter (body)
- 📱 100% responsivo (mobile/tablet/desktop)
- 🚀 Performance optimizado, sin dependencias externas
- 🎬 Animaciones suaves sin jank

---

## 📐 ESTRUCTURA DE LA PÁGINA

### **1. HEADER/NAVEGACIÓN**
- Logo: "Ricardo Design" en oro (#d4a574)
- Navegación sticky: Servicios, Portfolio, Contacto
- Fondo: Glass card semi-transparente (rgba(255,255,255,0.05))
- Blur: 12px
- Borde: 1px solid rgba(255,255,255,0.15)

---

### **2. HERO (Sección Bienvenida)**
- **Fondo:** Gradiente oscuro animado o blob shapes blurradas
- **Título:** "Tu marca merece una web profesional"
  - Font: Playfair Display, Bold 700, 3rem
  - Color: #ffffff
  - Efecto: Fade-in al cargar
  
- **Subtítulo:** "Creamos y mantenemos sitios web que conviertan visitantes en clientes. Diseño minimalista, rendimiento premium, resultados reales."
  - Font: Inter, 400, 1.2rem
  - Color: #a8a8a8
  
- **CTAs:**
  - Botón 1: "Ver Portfolio" → Scroll a sección Portfolio
  - Botón 2: "Consulta Gratis" → WhatsApp link
  - Ambos con efecto glass y hover animations

- **Animación:** Scroll reveal con parallax en fondo

---

### **3. SERVICIOS (3 Cards en Grid)**
- Título: "Servicios" (Playfair Display, 2.5rem, bold)
- Layout: 3 columnas (responsive a 1 en móvil)
- Cada card con:
  - **Glassmorphism card:**
    - Background: rgba(255,255,255,0.08)
    - Blur: 16px
    - Border: 1px solid rgba(255,255,255,0.15)
    - Padding: 2rem
    - Border-radius: 12px
  
  - **Ícono:** Emoji grande (🎨, ⚙️, 📢)
  - **Título:** "Creación Web" / "Mantenimiento" / "Publicidad Digital"
    - Font: Inter Bold 600, 1.3rem
    - Color: #d4a574 (oro)
  
  - **Descripción:** 
    - Font: Inter 400, 0.95rem
    - Color: #a8a8a8
  
  - **Animación:** Appear al scroll + hover lift effect (translateY -5px)

**Servicios específicos:**
1. **🎨 Creación Web**
   - "Diseño responsivo, moderno y orientado a conversiones. Cada proyecto es único y adaptado a tu marca."

2. **⚙️ Mantenimiento**
   - "Actualizaciones, seguridad, rendimiento. Tu web siempre funcionando al 100% sin preocupaciones."

3. **📢 Publicidad Digital**
   - "Campañas en Meta Ads y Google Ads. Tráfico calificado que convierte en ventas reales."

---

### **4. PORTFOLIO (2 Proyectos - Card Stacking)**
- Título: "Proyectos" (Playfair Display, 2.5rem, bold)
- **Patrón:** Card stacking - al scroll, cards se revelan con animación
- **Layout:** 2 columnas (responsive a 1 en móvil)

#### **PROYECTO 1: Felipe Vergel**
- **Ícono:** 🎨 (fondo con gradiente oro/terracota)
- **Nombre:** Felipe Vergel
- **Descripción:** "E-commerce de arte en vidrio. Diseño elegante, colecciones exclusivas, sistema de suscripción VIP."
- **CTA:** "Ver sitio →" (link a https://felipevergel.com)
- **Card Glass:** rgba(245, 245, 245, 0.08) con blur 14px

#### **PROYECTO 2: Alejandra Vergel**
- **Ícono:** ✨ (fondo con gradiente oro/terracota)
- **Nombre:** Alejandra Vergel
- **Descripción:** "Joyería artesanal de autor. Catálogo de productos con filtros, carrito inteligente e integración WhatsApp."
- **CTA:** "Ver sitio →" (link a https://alejandravergel.com)
- **Card Glass:** rgba(245, 245, 245, 0.08) con blur 14px

**Animaciones:**
- Fade-in + scale (1 → 1.05) al entrar en viewport
- Hover: Más blur, más luminoso
- Box-shadow suave

---

### **5. CTA ADS (Sección de Llamada a Acción)**
- **Fondo:** Gradiente oscuro (linear-gradient 135deg, #1a1a1a → #2a2a2a)
- **Efecto:** Glass overlay semi-transparente
- **Texto:**
  - Título: "¿Necesitas una web como estas?" (Playfair Display Bold, 2rem, #ffffff)
  - Subtítulo: "Somos especialistas en crear webs que no solo se ven bien, sino que generan resultados." (Inter 400, 1.1rem, opacity 0.9)

- **CTAs Duales:**
  - Botón 1: "Ver más detalles" (Fondo oro #d4a574, texto negro)
  - Botón 2: "Hablar con nosotros" (WhatsApp verde #25d366)
  - Ambos con hover scale effect

---

### **6. FOOTER**
- **Fondo:** #0f0f0f (negro puro)
- **Contenido:**
  - 📱 WhatsApp: +57 322 850 5472 (link activo)
  - 📧 Email: ricardojosemarinespitia@gmail.com
  - Copyright: "© 2026 Ricardo Design. Diseño minimalista. Resultados reales."

- **Tipografía:** Inter 400, 0.9rem, color #aaa
- **Enlaces:** Color oro (#d4a574)

---

## 🎨 PALETA DE COLORES

```css
/* Colores principales */
--color-bg-dark: #0f0f0f;           /* Fondo principal */
--color-bg-section: #1a1a1a;        /* Fondo secciones */
--color-text-primary: #ffffff;      /* Texto principal */
--color-text-secondary: #a8a8a8;    /* Texto secundario */
--color-accent-gold: #d4a574;       /* Oro/Accent */
--color-glass-light: rgba(255, 255, 255, 0.08);
--color-glass-border: rgba(255, 255, 255, 0.15);
--color-cta-whatsapp: #25d366;      /* WhatsApp green */
```

---

## 🔤 TIPOGRAFÍA

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600&display=swap');

/* Playfair Display - Títulos */
--font-display: 'Playfair Display', serif;
--font-display-weight: 700;
--font-display-weight-bold: 800;
--font-display-tracking: 1px;

/* Inter - Body */
--font-body: 'Inter', sans-serif;
--font-body-weight-regular: 400;
--font-body-weight-medium: 500;
--font-body-weight-semibold: 600;
--font-body-tracking: -0.3px;
```

**Jerarquía de tamaños:**
- H1 (Hero): 3rem (48px)
- H2 (Secciones): 2.5rem (40px)
- H3 (Cards): 1.3rem (21px)
- Body: 1rem (16px)
- Small: 0.9rem (14px)

---

## ✨ EFECTOS Y ANIMACIONES

### **Glassmorphism (Base)**
```css
backdrop-filter: blur(12-16px);
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 12px;
```

### **Scroll Animations**
1. **Fade-in:** opacity 0 → 1 al entrar en viewport
2. **Slide-up:** translateY(40px) → 0 al scroll
3. **Scale-up:** scale(0.95) → 1 on hover
4. **Parallax:** Background layers a diferentes velocidades
5. **Reveal:** Elements se revelan secuencialmente al scroll
6. **Stacking:** Cards se apilan/desapilan al scroll

### **Hover Effects**
- Cards: lift + enhanced blur
- Buttons: scale(1.05) + glow
- Links: color #d4a574 underline

### **Performance**
- Usar `will-change` estratégicamente
- Animaciones en 60fps
- NO animar blur (costoso) - solo on hover si es necesario
- Usar transform + opacity (GPU accelerated)

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px+

/* Grid responsive */
Servicios: 1 col (mobile) → 3 cols (desktop)
Portfolio: 1 col (mobile) → 2 cols (desktop)
```

---

## 🚀 OPTIMIZACIONES

- ✅ CSS puro (sin frameworks)
- ✅ JavaScript vanilla (animaciones scroll con IntersectionObserver)
- ✅ Google Fonts (optimizar carga)
- ✅ Images: SVG cuando sea posible, JPG comprimido
- ✅ Lazy loading para imágenes
- ✅ Mobile-first design
- ✅ Semantic HTML5
- ✅ Performance score 90+

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
ricardodesign-portfolio/
├── index.html              # HTML principal
├── css/
│   ├── styles.css          # Estilos glassmorphism
│   └── animations.css      # Animaciones scroll
├── js/
│   └── main.js             # Interacciones y scroll
├── README.md
└── .gitignore
```

---

## 🔗 LINKS Y DATOS

- **Dominio:** ricardodesign.com
- **Portfolio 1:** https://felipevergel.com
- **Portfolio 2:** https://alejandravergel.com
- **WhatsApp:** https://wa.me/573228505472
- **Email:** ricardojosemarinespitia@gmail.com
- **GitHub:** https://github.com/ricardojosemarinespitia-netizen/ricardodesign-portfolio

---

## ⚡ INSTRUCCIONES FINALES PARA FABLE

1. **Crea el código HTML/CSS/JS completo** en una sola respuesta
2. **Todo debe ser copy-paste ready** - sin dependencias externas
3. **Glassmorphism en TODAS las secciones** - pero con balance (no todo vidrio)
4. **Scroll fluido** - IntersectionObserver para animaciones
5. **Mobile-first** - perfecto en celular primero
6. **Incluye Google Fonts en HTML**
7. **Colores exactos:** #0f0f0f, #d4a574, #ffffff, #a8a8a8
8. **Tipografía exacta:** Playfair Display + Inter
9. **Links funcionales:** WhatsApp, Felipe, Alejandra
10. **Pruébalo mentalmente:** ¿Se ve bien en móvil? ¿Desktop? ¿Las animaciones son smooth?

---

## 🎯 OBJETIVO FINAL

Un portafolio que grite: **"Soy profesional, premium, moderno y sé lo que hago."**

Cuando alguien entra a ricardodesign.com desde un anuncio de Meta Ads debe pensar:
✅ "Este tipo hace webs profesionales"
✅ "Tiene clientes reales y de calidad"
✅ "El efecto visual es increíble"
✅ "Quiero hablarle"

---

**¡A FABLE le encanta esto! Dale un prompt así y tendrás un diseño increíble.**
