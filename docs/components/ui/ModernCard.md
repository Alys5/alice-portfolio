---
title: ModernCard
description: >-
  Card moderna con animazioni scroll-triggered, effetti magnetici, ripple e UFO
  elements
layout: doc
sidebar: auto
head:
  - - link
    - rel: stylesheet
      href: /styles/docs.css
sourceFile: components\ui\ModernCard.vue
---

# ModernCard

Card moderna con animazioni scroll-triggered, effetti magnetici, ripple e UFO elements

## Props

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `title` | `String` | - | Titolo della card |
| `size` | `String` | - | Dimensione della card (small, medium, large, xlarge) |
| `variant` | `String` | - | Variante stilistica (default, elevated, glass, brutalist) |
| `interactive` | `Boolean` | - | Abilita interazioni (click, hover, ripple) |
| `ariaLabel` | `String` | - | Label per accessibilità |
| `showUfoElements` | `Boolean` | - | Mostra elementi UFO fluttuanti |
| `customStyles` | `Object` | - | Stili personalizzati aggiuntivi |

## Events

| Event | Payload | Descrizione |
|-------|---------|-------------|
| `click` | - | Emesso al click della card (solo se interactive) |

## Slots

| Slot | Descrizione |
|------|-------------|
| `default` | Contenuto principale della card |

## Esempi

### Esempio 1



### Esempio 2



## Demo Interattiva

<ClientOnly>
<ExampleContainer component="ModernCard" />
</ClientOnly>

## Codice Sorgente

📁 [components\ui\ModernCard.vue](https://github.com/alicemandelli/portfolio/blob/main/src/components\ui\ModernCard.vue)

