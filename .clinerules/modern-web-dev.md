# Modern Web Development Guidelines (2025)

## Brief Overview
Comprehensive project rules focusing on modern web development practices, refactoring priorities, performance optimization, accessibility compliance, and design system implementation. Incorporates latest 2025 trends and technologies.

## Refactoring Priorities

### Current State Analysis
- Remove duplicate components (forms, navbars)
- Replace legacy SCSS with modern CSS utilities
- Update/remove outdated animations affecting UX
- Fix non-mobile-first layouts
- Make all UI components accessible (focus, ARIA, keyboard)

### Modernization Opportunities
- Implement dark mode with CSS variables
- Update animations using modern libraries (Framer Motion, GSAP)
- Create modular UI component library
- Introduce documented design system with Storybook
- Evaluate AI-driven features integration
- Transform into PWA with offline capabilities
- Enhance i18n support (RTL, automatic fallbacks)

## Performance & Accessibility

### Optimization
- Image optimization (compression, defined dimensions, lazy loading)
- Dynamic code splitting and JS/CSS bundle reduction
- Critical CSS inlining for above-the-fold content
- Font preloading for custom typography

### Accessibility
- Semantic HTML, ARIA roles, skip links
- Full keyboard navigation support
- Axe-core testing and fixes
- WCAG 2.1 AA compliance for all components
- Visible focus indicators
- Proper alt text for all images

### Core Web Vitals Targets
- LCP < 2.5s: Optimize images, fonts, initial load
- CLS < 0.1: Define image/video dimensions, avoid layout shifts
- INP < 200ms: Optimize interaction responsiveness
- Minimize blocking JS and monitor Web Vitals

## Design System

### Color Palette
- Primary colors (bright-sun, ebony-clay, persian-blue, picton-blue)
- Trend colors 2025 (beige-soft, green-dusty, pink-dusty, yellow-soft, blue-pale, gray-warm)
- Full dark/light mode support
- WCAG 2.1 AA compliant contrasts
- CSS custom properties for all colors

### Typography
- Distinctive font system
- Fluid sizing with clamp()
- Clear visual hierarchy
- Multi-device readability
- CSS custom properties for sizing/weights

### Modular Components
- Buttons with micro-animations
- Cards with hover effects
- Forms with real-time validation
- Accessible navigation
- All components documented in Storybook

## Architectural Improvements

### State Management
- Migrate to Pinia
- Separate business logic (composables)
- Atomic design structure

### Code Quality
- Remove dead code
- Consolidate duplicate functionality
- Optimize production build

### Documentation
- Storybook for all components
- Design tokens documentation
- Architectural decisions record

## Implementation Guidelines

### Design System Usage
- All components must use defined CSS tokens
- Follow Bento grid layout principles
- Implement semantic HTML and proper ARIA
- Support all breakpoints:
  - Mobile: 320px-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px-1439px
  - Large: 1440px+

### Performance
- Lazy loading for below-the-fold images
- Tree-shaking for minimized bundles
- Optimized asset delivery

### Accessibility
- Complete keyboard navigation
- Screen reader compatibility
- Color contrast compliance

## Structured Refactoring Plan

### High Priority
- Accessibility audit and fixes
- Performance optimization
- Component consolidation
- Mobile-first responsive design
- Web Vitals monitoring

### Medium Priority
- Design system implementation
- Pinia migration
- Dark mode implementation
- PWA transformation

### Low Priority
- Animation updates
- AI features integration
- Advanced localization

## Modern Design System 2025

### CSS Custom Properties Example
```css
:root {
  /* Palette principale */
  --bright-sun: #ffc940;
  --ebony-clay: #29353f;
  --persian-blue: #2048b4;
  --picton-blue: #48a9f8;

  /* Trend Colors 2025 */
  --beige-soft: #f5f3ea;
  --green-dusty: #b7c9a8;
  --pink-dusty: #e7bfc6;
  --yellow-soft: #fff6d6;
  --blue-pale: #dbeafe;
  --gray-warm: #ececec;

  /* Tipografia e spaziature */
  --font-family-base: 'Inter', system-ui, sans-serif;
  --font-size-base: clamp(1rem, 2vw, 1.125rem);
  --radius-lg: 1.25rem;
  --shadow-card: 0 4px 24px rgba(0,0,0,0.08);
}
```

### Glassmorphism Implementation
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Bento Grid Layout
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
```

## Landing Page Sections (2025 Mockup)

1. **Header**: Glassmorphism effect with responsive navigation
2. **Hero**: Fluid typography with animated CTA
3. **Features**: Bento grid with modular cards
4. **Stats**: Animated counters for impact
5. **Testimonials**: Accessible carousel
6. **CTA**: Multiple action options
7. **Footer**: Organized links and newsletter

> All new components and refactoring must adhere to this design system and use the defined CSS tokens.
