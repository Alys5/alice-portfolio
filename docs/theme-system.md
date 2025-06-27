# Sistema di Tema - Alice Portfolio

## Panoramica

Il sistema di tema implementato nel portfolio di Alice è ispirato al design pattern di Kevin Powell, con transizioni fluide e animazioni SVG eleganti. Supporta tre modalità: **Light**, **Dark** e **Auto** (che segue le preferenze del sistema).

## Caratteristiche

### 🎨 **Temi Supportati**

- **Light Theme**: Colori chiari e luminosi
- **Dark Theme**: Colori scuri e rilassanti per gli occhi
- **Auto Theme**: Segue automaticamente le preferenze del sistema operativo

### ✨ **Animazioni Fluide**

- Transizioni CSS di 300ms con easing `cubic-bezier(0.16, 1, 0.3, 1)`
- Animazioni SVG per le icone sole/luna
- Effetti di rotazione e morphing durante il cambio tema

### ♿ **Accessibilità**

- Supporto completo per `prefers-reduced-motion`
- Contrasto WCAG AA compliant
- Focus management ottimizzato
- Screen reader friendly

### 📱 **Responsive Design**

- Funziona perfettamente su mobile e desktop
- Tooltip informativi per il tema automatico
- Integrazione seamless con la navbar

## Componenti

### ThemeToggle.vue

Il componente principale per il cambio tema, posizionato nella navbar.

```vue
<template>
  <ThemeToggle :show-tooltip-on-hover="true" class="navbar__theme-toggle" />
</template>
```

**Props:**

- `showTooltipOnHover` (boolean): Mostra tooltip per tema automatico

**Eventi:**

- `click`: Cambia il tema (light → dark → auto → light)

### useTheme.ts

Composable per gestire lo stato del tema e le transizioni.

```typescript
const {
  currentTheme, // Tema corrente
  isDark, // Se il tema è scuro
  isTransitioning, // Se è in corso una transizione
  toggleTheme, // Funzione per cambiare tema
  setTheme, // Funzione per impostare un tema specifico
  getThemeIcon, // Ottiene l'icona corrente
  getThemeText, // Ottiene il testo descrittivo
  getThemeAriaLabel, // Ottiene l'aria-label per accessibilità
} = useTheme()
```

## Implementazione Tecnica

### Transizioni CSS

Le transizioni sono applicate globalmente durante il cambio tema:

```scss
.theme-transitioning *,
.theme-transitioning *::before,
.theme-transitioning *::after {
  transition:
    background-color 0.3s var(--ease-out-expo),
    border-color 0.3s var(--ease-out-expo),
    color 0.3s var(--ease-out-expo),
    box-shadow 0.3s var(--ease-out-expo),
    opacity 0.3s var(--ease-out-expo),
    transform 0.3s var(--ease-out-expo) !important;
}
```

### Animazioni SVG

Le icone sole e luna hanno animazioni specifiche:

```scss
// Rotazione dei raggi del sole
@keyframes sunRaysSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}

// Disegno del percorso della luna
@keyframes moonPathDraw {
  0% {
    stroke-dashoffset: 40;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
```

### Variabili CSS

Il sistema utilizza variabili CSS per una gestione centralizzata dei colori:

```scss
:root {
  // Light theme colors
  --color-bg-primary: #ffffff;
  --color-text-primary: #0f172a;
  --color-border-primary: #e2e8f0;
}

[data-theme='dark'] {
  // Dark theme colors
  --color-bg-primary: #0f172a;
  --color-text-primary: #f8fafc;
  --color-border-primary: #334155;
}
```

## Persistenza

Il tema selezionato viene salvato nel `localStorage` con la chiave `alice-theme` e viene ripristinato al caricamento della pagina.

## Preferenze del Sistema

Il sistema rileva automaticamente le preferenze del tema del sistema operativo tramite `prefers-color-scheme` e si aggiorna in tempo reale quando l'utente cambia le impostazioni del sistema.

## Performance

- Transizioni hardware-accelerated con `transform` e `opacity`
- Debouncing per evitare transizioni multiple
- Cleanup automatico degli event listener
- Ottimizzazioni per `prefers-reduced-motion`

## Browser Support

- ✅ Chrome 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Edge 88+

## Test

Per testare il sistema di tema:

1. **Cambio Manuale**: Clicca sul ThemeToggle nella navbar
2. **Tema Automatico**: Cambia le impostazioni del sistema operativo
3. **Accessibilità**: Testa con screen reader e `prefers-reduced-motion`
4. **Performance**: Verifica le transizioni su dispositivi low-end

## Personalizzazione

### Aggiungere Nuovi Temi

1. Definisci le variabili CSS nel `variables.scss`
2. Aggiungi la logica nel `useTheme.ts`
3. Aggiorna il componente `ThemeToggle.vue`

### Modificare le Animazioni

Le animazioni possono essere personalizzate modificando:

- Durata delle transizioni in `variables.scss`
- Keyframes in `ThemeToggle.vue`
- Easing functions

## Troubleshooting

### Transizioni Non Funzionano

- Verifica che la classe `theme-transitioning` sia applicata
- Controlla che le variabili CSS siano definite correttamente
- Assicurati che `prefers-reduced-motion` non sia attivo

### Tema Non Persiste

- Verifica che `localStorage` sia disponibile
- Controlla la chiave `alice-theme` nel browser dev tools
- Assicurati che il composable sia montato correttamente

### Icone Non Si Animano

- Verifica che le classi CSS siano applicate correttamente
- Controlla che le animazioni non siano disabilitate
- Assicurati che il browser supporti le animazioni CSS

## Riferimenti

- [Kevin Powell - Theme Toggle](https://codepen.io/kevinpowell/pen/QwbYwXv)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
