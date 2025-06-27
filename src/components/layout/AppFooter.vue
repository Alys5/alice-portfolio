<template>
  <!-- Footer principale:
  - Mini-bio, logo, link social/email/website
  - Tutti i testi localizzati via i18n
  - Accessibilità: aria-label su link
  - Responsive e colori accessibili -->
  <footer class="app-footer" role="contentinfo" :aria-label="$t('footer.bio')">
    <div class="footer-content">
      <div class="footer-bio">
        <span class="logo">AM</span>
        <span>{{ $t('footer.bio') }}</span>
      </div>
      <div class="footer-links">
        <!-- Link social e contatti -->
        <a
          href="https://linkedin.com/in/alys5"
          target="_blank"
          rel="noopener"
          :aria-label="$t('footer.linkedin')"
          >{{ $t('footer.linkedin') }}</a
        >
        <a href="mailto:mandellialice5@gmail.com" :aria-label="$t('footer.email')">{{
          $t('footer.email')
        }}</a>
        <a
          href="https://alys5.eu"
          target="_blank"
          rel="noopener"
          :aria-label="$t('footer.website')"
          >{{ $t('footer.website') }}</a
        >
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2025 Alice Mandelli. {{ $t('footer.copyright') }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Nessuna logica JS necessaria: tutto statico e localizzato via i18n
</script>

<!--
  Stili organizzati per:
  - .app-footer: wrapper principale
  - .footer-content: layout flex bio + link
  - .footer-bio: logo + mini-bio
  - .footer-links: link social/email/website
  - .footer-bottom: copyright
  - Responsive e colori accessibili
-->

<style scoped>
.app-footer {
  background: var(--color-secondary);
  color: var(--color-text);
  padding: var(--space-lg) 0 var(--space-md) 0;
  font-family: var(--font-primary);
}
.footer-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}
.footer-bio {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: 1rem;
}
.footer-bio .logo {
  font-weight: 700;
  font-size: 1.3rem;
  background: var(--color-primary);
  color: var(--color-secondary);
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-links {
  display: flex;
  gap: var(--space-md);
}
.footer-links a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: var(--color-primary);
}
.footer-bottom {
  text-align: center;
  margin-top: var(--space-md);
  font-size: 0.95rem;
  color: var(--color-light-gray);
}
</style>
