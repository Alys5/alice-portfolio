# 🎨 Sistema Animazioni Fluide - Alice Mandelli Portfolio

## Quick Start

### 1. Import Componenti

```vue
<script setup lang="ts">
import { magneticHover, createRippleEffect } from '@/composables/useAnimations'
</script>
```

### 2. Aggiungi Classi CSS

```vue
<template>
  <div class="card animate-fluid-fade">
    <h3 class="kinetic-text animate-kinetic-text">Titolo</h3>
    <button class="magnetic-button animate-magnetic">Click me</button>
  </div>
</template>
```

### 3. Inizializza JavaScript

```vue
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const buttons = document.querySelectorAll('.magnetic-button')
  buttons.forEach((button) => magneticHover(button as HTMLElement))
})
</script>
```

## 🚀 Animazioni Disponibili

### Base Animations

- `.animate-fluid-fade` - Entrata fluida con blur
- `.animate-morphing-hover` - Cambio forma al hover
- `.animate-magnetic` - Movimento magnetico
- `.animate-ripple` - Effetto ondulazione
- `.animate-liquid-loading` - Loading liquido
- `.animate-kinetic-text` - Testo dinamico
- `.animate-gradient-shift` - Transizioni colore
- `.animate-floating` - Elementi fluttuanti

### Timing Classes

- `.animate-delay-100` - Ritardo 100ms
- `.animate-delay-200` - Ritardo 200ms
- `.animate-delay-300` - Ritardo 300ms
- `.animate-delay-500` - Ritardo 500ms
- `.animate-delay-700` - Ritardo 700ms

## 🎯 Micro-Interazioni

### Ripple Effect

```javascript
const handleClick = (event: MouseEvent) => {
  createRippleEffect(event, {
    color: 'rgba(255, 201, 64, 0.4)',
    duration: 800,
    scale: 3,
  })
}
```

### Magnetic Hover

```javascript
magneticHover(element, 0.15) // Forza personalizzabile
```

### Performance Monitoring

```javascript
const { fps, frameTime } = useAnimationPerformance()
```

## ♿ Accessibilità

### Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast

```scss
@media (prefers-contrast: high) {
  .card {
    border-width: 2px;
  }
}
```

## 📱 Responsive

### Mobile Optimizations

```scss
@media (max-width: 768px) {
  .animate-fluid-fade {
    animation-duration: 0.4s; // Ridotta per mobile
  }
}
```

## 🎨 Palette Colori

### Variabili CSS

```scss
--bright-sun: #ffc940; // Giallo brillante
--ebony-clay: #29353f; // Grigio scuro
--persian-blue: #2048b4; // Blu profondo
--picton-blue: #48a9f8; // Blu chiaro
```

## 📊 Performance

### Best Practices

- ✅ Hardware acceleration con `transform3d`
- ✅ `will-change` per elementi animati
- ✅ Frame budget sotto 16ms
- ✅ Lazy loading animazioni
- ✅ Cleanup event listeners

### Monitoring

```javascript
// FPS Counter in tempo reale
const { fps, frameTime } = useAnimationPerformance()
console.log(`FPS: ${fps}, Frame Time: ${frameTime.toFixed(2)}ms`)
```

## 🔧 Configurazione

### Variabili SCSS

```scss
// Timing
$animation-duration-fast: 0.2s;
$animation-duration-normal: 0.4s;
$animation-duration-slow: 0.8s;

// Easing
$ease-out-quart: cubic-bezier(0.25, 0.46, 0.45, 0.94);
$ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## 📁 Struttura File

```text
src/
├── composables/
│   └── useAnimations.ts          # Composable principale
├── styles/
│   ├── animations.scss           # Animazioni CSS
│   ├── variables.scss            # Variabili colore
│   └── main.scss                 # Stili globali
├── components/
│   └── ui/
│       └── FluidAnimationsDemo.vue  # Demo component
└── examples/
    └── AnimationsExample.vue     # Esempi pratici
```

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit animations
```

### Performance Tests

```bash
npm run test:performance
```

## 📚 Documentazione Completa

Per documentazione dettagliata, vedi:

- [docs/ANIMATIONS.md](docs/ANIMATIONS.md) - Documentazione completa
- [src/examples/AnimationsExample.vue](src/examples/AnimationsExample.vue) - Esempi pratici

## 🚀 Roadmap

### Prossime Features

- [ ] Web Animations API
- [ ] Spring Physics
- [ ] Gesture Support
- [ ] 3D Transforms
- [ ] AI-Driven Animations

## 🤝 Contribuire

1. Fork il repository
2. Crea feature branch (`git checkout -b feature/amazing-animation`)
3. Commit changes (`git commit -m 'Add amazing animation'`)
4. Push al branch (`git push origin feature/amazing-animation`)
5. Apri Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi [LICENSE](LICENSE) per dettagli.

---

## Creato con ❤️ per Alice Mandelli Portfolio

### UI Developer & Designer con specializzazione AI
