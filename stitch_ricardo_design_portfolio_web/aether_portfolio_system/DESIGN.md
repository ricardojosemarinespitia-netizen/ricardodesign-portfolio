---
name: Aether Portfolio System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d4c4b7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9c8e82'
  outline-variant: '#50453b'
  surface-tint: '#efbd8a'
  primary: '#f2c08d'
  on-primary: '#472a03'
  primary-container: '#d4a574'
  on-primary-container: '#5b3a13'
  inverse-primary: '#7c572d'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c9c9c9'
  on-tertiary: '#2f3131'
  tertiary-container: '#adaeae'
  on-tertiary-container: '#404242'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbc'
  primary-fixed-dim: '#efbd8a'
  on-primary-fixed: '#2c1700'
  on-primary-fixed-variant: '#614018'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 96px
    fontWeight: '800'
    lineHeight: 100%
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 110%
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 110%
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 120%
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 160%
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 150%
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 100%
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  section-gap: 160px
  container-padding: 5vw
  stack-overlap: -40px
  gutter: 24px
---

## Brand & Style

The design system is engineered to evoke the high-fidelity atmosphere of a luxury spacecraft. It targets a high-end clientele that values precision, technical mastery, and editorial sophistication. The aesthetic merges **Glassmorphism** with **Minimalism**, utilizing vast dark voids to emphasize "floating" interface modules.

The emotional response should be one of "Technical Elegance"—where the raw power of a spaceship's cockpit meets the refined layout of a prestige fashion magazine. Expect aggressive transitions, stacking layers, and light-based depth that simulates digital instrumentation projected onto glass.

## Colors

The palette is anchored in a monochromatic "Deep Space" environment to maximize contrast and focus.

- **Primary (Liquid Gold):** Used exclusively for high-impact accents, interactive states, and sophisticated underlines. It represents the "premium" heat within the cold void.
- **Background (Deep Space Black):** A pure, near-black foundation that allows glass layers to pop.
- **Glass / Surface:** Semi-transparent layers with a heavy 16px backdrop blur to simulate spacecraft instrumentation panels.
- **Text:** High-contrast Pure White for maximum legibility against dark backgrounds.

## Typography

This system employs a high-contrast typographic pairing. **Playfair Display** provides an editorial, authoritative voice for headlines, suggesting a legacy of craft. **Inter** provides the "avionics" feel—clean, neutral, and highly legible for technical descriptions and navigational elements.

Large display type should utilize tighter letter spacing to create a sense of cohesive gravity. Labels should always be in uppercase with increased tracking to mimic technical readouts.

## Layout & Spacing

The layout philosophy is **Full-Width Fluid**. Content is organized into massive, vertically stacking sections that fill the viewport. 

- **Stacking Cards:** Portfolio items should use a "sticky stack" behavior where cards slide over one another during scroll, creating physical depth.
- **Safe Zones:** Use a 12-column grid for internal card layouts, but allow hero imagery and background glass panels to bleed to the edges of the screen.
- **Negative Space:** Use aggressive vertical margins (160px+) to allow the brand to "breathe" like the vacuum of space.

## Elevation & Depth

Depth is not communicated through traditional shadows, but through **light and transparency**.

1.  **Backdrop Blurs:** Every surface above the background must use `backdrop-filter: blur(16px)` combined with the Glass color.
2.  **Inner Glows:** Instead of drop shadows, use a 1px subtle white or gold inner border (stroke) to define the edge of glass panels.
3.  **Parallax Layers:** Floating elements (geometric shapes or technical specs) should move at 0.5x scroll speed to create a 3D environment.
4.  **Aura Glows:** High-level sections may feature a faint, localized radial gradient of Liquid Gold (#d4a574) at 5% opacity behind the glass panels to simulate an engine or star glow.

## Shapes

The design system uses **Soft (0.25rem)** roundedness to maintain a precise, engineered feel. Avoid fully rounded "bubble" shapes. Rectilinear forms with subtle rounding suggest milled metal and glass panels. Buttons and tags should feel like physical toggles found in a cockpit—sharp enough to feel professional, but slightly softened for modern digital comfort.

## Components

### Buttons
Primary buttons are transparent with a 1px Liquid Gold border. On hover, the button fills with a Gold-to-Transparent gradient and triggers a slight "glow" expansion. Text remains white or turns black if the fill is solid.

### Stacking Cards
Cards occupy 90% of the viewport height. They feature a 1px semi-transparent white border and the standard glass blur. As the user scrolls, the card should slightly scale down (e.g., 0.95x) as the next card stacks on top.

### Drawing Underlines
Headlines or "Call to Action" links use a custom animation where a Liquid Gold line "draws" from left to right on hover or when the element enters the viewport.

### Input Fields
Minimalist bottom-border only. When focused, the border color transitions to Liquid Gold and a faint glow radiates from the line.

### Chips / Labels
Small, rectangular containers with the `label-caps` typography. Background is the standard Glass color with no border.