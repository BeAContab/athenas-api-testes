---
name: Athenas Dashboard
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  code:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 240px
  topbar-height: 56px
  container-max: 1440px
  gutter: 24px
  stack-gap: 16px
  row-padding: 12px
---

## Brand & Style
The design system is engineered for high-performance administrative environments where data density and clarity are paramount. It adopts a **Modern Minimalist** aesthetic, heavily influenced by developer-centric tools. The personality is disciplined, technical, and unobtrusive, ensuring that the interface recedes to let the data lead.

The visual language utilizes a "less is more" approach: high information density is achieved not through clutter, but through precise alignment, generous use of whitespace within components, and a rigorous hierarchy of information. The emotional response should be one of control, efficiency, and reliability.

## Colors
The palette is rooted in a neutral grayscale spectrum to maintain professional rigor.
- **Primary:** A deep Slate (#0F172A) used for core interactions and high-contrast elements. In dark mode, this flips to a pure white or very light gray.
- **Accent:** A subtle Indigo (#6366F1) reserved for focus states, active navigation markers, and primary progress indicators.
- **Surface:** Uses a layered approach. Base backgrounds are white (#FFFFFF) in light mode and near-black (#020617) in dark mode. Sub-surfaces (sidebar, cards) use a slightly offset gray to create depth.
- **Status:** Semantic colors (Green, Red, Gray) are used for badges with low-saturation backgrounds and high-saturation text to ensure legibility without vibrating against the neutral UI.

## Typography
This design system utilizes **Geist** for its technical precision and optimal legibility at small sizes. 
- **Scale:** The type scale is compact to support data-heavy tables and dashboards.
- **Weight:** Use `SemiBold` (600) for section headers and `Medium` (500) for UI labels to maintain visibility at small scales.
- **Monospace:** `JetBrains Mono` is used selectively for ID strings, currency values, and numerical data in tables to ensure vertical alignment of digits.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid** model:
- **Sidebar:** A fixed 240px vertical navigation bar on the left. On mobile, this transitions to a hidden drawer.
- **Topbar:** A fixed 56px header containing breadcrumbs, the "Prototype/Real" toggle, and user profile actions.
- **Main Content:** A fluid area with a max-width of 1440px, centered on ultra-wide screens.
- **Grid:** A 12-column grid is used for dashboard widgets. Spacing is based on a 4px baseline grid, with 16px (base) and 24px (large) being the standard increments for margins and padding.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.
- **Borders:** Every card, input, and section is defined by a 1px border. In light mode, use `Slate-200`; in dark mode, use `Slate-800`.
- **Surfaces:** The background uses `Slate-50`, while primary cards and the sidebar use `White`. This subtle contrast creates hierarchy without visual noise.
- **Shadows:** Use a single "Low-Profile" shadow for floating elements like dropdowns and modals: `0px 1px 2px 0px rgba(0, 0, 0, 0.05)`.

## Shapes
The shape language is controlled and geometric.
- **Components:** Buttons, inputs, and cards use a standard **8px (rounded-md)** radius.
- **Badges:** Small status indicators use a **6px** radius or a full pill shape depending on context.
- **Selection states:** Hover states and active navigation items use a **6px** radius for a nested look within the larger container.

## Components
- **Buttons:** 
  - *Primary:* Solid Slate-900 (White text). 
  - *Secondary:* Outlined with 1px Slate-200.
  - *Ghost:* No border/background, Slate-600 text; used for low-priority actions.
- **Inputs:** 1px Slate-200 border, 12px horizontal padding. On focus, the border changes to Indigo-500 with a 2px soft Indigo ring.
- **Tables:** Optimized for density. 12px vertical padding on rows. Header row has a subtle Slate-50 background. Use "Geist Mono" for numeric columns.
- **Badges:**
  - *Open:* Gray background, Slate-700 text.
  - *Settled:* Light green background, Green-800 text.
  - *Cancelled:* Light red background, Red-800 text.
- **Toggle (Prototype/Real):** A segmented control (switch-like) in the topbar. "Prototype" uses a subtle amber accent when active to warn of non-live data.
- **Sidebar Nav:** Vertical list of icons + text. Active state indicated by a subtle background fill and an Indigo vertical line on the left edge.