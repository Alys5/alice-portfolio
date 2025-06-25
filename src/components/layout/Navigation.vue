<template>
  <!-- Navigation principale con link alle sezioni principali -->
  <nav class="main-nav">
    <ul>
      <li>
        <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
      </li>
      <li>
        <RouterLink to="/portfolio">{{ $t('nav.portfolio') }}</RouterLink>
      </li>
      <li>
        <RouterLink to="/about">{{ $t('nav.about') }}</RouterLink>
      </li>
      <li>
        <RouterLink to="/contact">{{ $t('nav.contact') }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
// Importa RouterLink per navigazione SPA
import { RouterLink } from 'vue-router'
// Nessuna logica aggiuntiva: solo link statici localizzati
</script>

<script lang="ts">
export default {
  name: 'MainNavigation',
}
</script>

<!--
  Stili organizzati per:
  - .main-nav: wrapper nav
  - ul/li: lista orizzontale
  - a.router-link-active: evidenziazione link attivo
  - Responsive e accessibilità
-->

<style scoped>
.main-nav ul {
  display: flex;
  gap: var(--space-lg);
  list-style: none;
  margin: 0;
  padding: 0;
}
.main-nav a {
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
  font-family: var(--font-primary);
  transition: color 0.2s;
}
.main-nav a.router-link-active {
  color: var(--color-accent-1);
}
</style>
