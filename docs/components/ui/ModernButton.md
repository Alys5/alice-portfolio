---
title: ModernButton
description: >-
  Pulsante moderno con varianti, effetti magnetici, ripple e supporto per
  link/router
layout: doc
sidebar: auto
head:
  - - link
    - rel: stylesheet
      href: /styles/docs.css
sourceFile: components\ui\ModernButton.vue
---

# ModernButton

Pulsante moderno con varianti, effetti magnetici, ripple e supporto per link/router

## Props

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `variant` | `String` | - | Variante del pulsante (primary, secondary, ghost, danger, outline) |
| `size` | `String` | - | Dimensione del pulsante (sm, md, lg, large) |
| `loading` | `Boolean` | - | Stato di caricamento con spinner |
| `disabled` | `Boolean` | - | Stato disabilitato |
| `fullWidth` | `Boolean` | - | Larghezza completa |
| `rounded` | `Boolean` | - | Bordi arrotondati |
| `icon` | `String` | - | Icona da mostrare |
| `iconPosition` | `String` | - | Posizione icona (left, right) |
| `ripple` | `Boolean` | - | Abilita effetto ripple |
| `magnetic` | `Boolean` | - | Abilita effetto magnetico |
| `href` | `String` | - | URL per link esterno |
| `to` | `String|Object` | - | Route per Vue Router |
| `target` | `String` | - | Target per link esterno |
| `ariaLabel` | `String` | - | Label per accessibilità |
| `ariaDescribedBy` | `String` | - | ID elemento descrittivo |

## Events

| Event | Payload | Descrizione |
|-------|---------|-------------|
| `click` | - | Emesso al click del pulsante |
| `focus` | - | Emesso al focus del pulsante |
| `blur` | - | Emesso al blur del pulsante |

## Slots

| Slot | Descrizione |
|------|-------------|
| `default` | Contenuto testuale del pulsante |
| `icon` | Icona personalizzata |

## Esempi

### Esempio 1



### Esempio 2



## Demo Interattiva

<ClientOnly>
<ExampleContainer component="ModernButton" />
</ClientOnly>

## Codice Sorgente

📁 [components\ui\ModernButton.vue](https://github.com/alicemandelli/portfolio/blob/main/src/components\ui\ModernButton.vue)

