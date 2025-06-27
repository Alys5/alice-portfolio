<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())

const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/alicemandelli', icon: '🔗' },
  { name: 'Instagram', url: 'https://instagram.com/alice.mandelli', icon: '📸' },
  { name: 'GitHub', url: 'https://github.com/alicemandelli', icon: '💻' },
  { name: 'Behance', url: 'https://behance.net/alicemandelli', icon: '🎨' }
]
</script>

<template>
  <footer class="footer-section">
    <div class="footer-content">
      <div class="footer-brand">
        <h3 class="brand-name">Alice Mandelli</h3>
        <p class="brand-tagline">UI/UX Designer & Web Developer</p>
      </div>

      <div class="footer-links">
        <h4 class="links-title">Social</h4>
        <ul class="social-links">
          <li v-for="link in socialLinks" :key="link.name">
            <a
              :href="link.url"
              :aria-label="`Visita ${link.name}`"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              <span class="social-icon">{{ link.icon }}</span>
              <span class="social-name">{{ link.name }}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="footer-contact">
        <h4 class="contact-title">Contatti</h4>
        <p class="contact-email">hello@alicemandelli.dev</p>
        <p class="contact-location">Milano, Italia</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        © {{ currentYear }} Alice Mandelli. Tutti i diritti riservati.
      </p>
      <p class="made-with">
        Made with ❤️ using Vue 3 & TypeScript
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-brand {
  .brand-name {
    font-size: 1.8rem;
    font-weight: 800;
    color: vars.$bright-sun;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px vars.$bright-sun;
  }

  .brand-tagline {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    margin: 0;
  }
}

.footer-links {
  .links-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1rem;
  }

  .social-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: vars.$bright-sun;
      transform: translateX(4px);
    }

    &:focus-visible {
      outline: 2px solid vars.$bright-sun;
      outline-offset: 2px;
    }
  }

  .social-icon {
    font-size: 1.2rem;
  }

  .social-name {
    font-weight: 500;
  }
}

.footer-contact {
  .contact-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1rem;
  }

  .contact-email,
  .contact-location {
    color: rgba(255, 255, 255, 0.8);
    margin: 0.5rem 0;
    font-size: 1rem;
  }

  .contact-email {
    color: vars.$picton-blue;
    font-weight: 500;
  }
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;

  .copyright,
  .made-with {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin: 0.25rem 0;
  }

  .made-with {
    font-style: italic;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .footer-section {
    padding: 2rem 0 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .social-link {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>
