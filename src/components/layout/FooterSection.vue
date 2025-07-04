<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/composables/useI18n'

// i18n
const { footer, common, accessibility, formatEmail } = useTranslation()

const currentYear = ref(new Date().getFullYear())

const socialLinks = [
  { name: footer.social.linkedin(), url: 'https://linkedin.com/in/alicemandelli', icon: '🔗' },
  { name: footer.social.instagram(), url: 'https://instagram.com/alice.mandelli', icon: '📸' },
  { name: footer.social.github(), url: 'https://github.com/alicemandelli', icon: '💻' },
  { name: footer.social.behance(), url: 'https://behance.net/alicemandelli', icon: '🎨' }
]
</script>

<template>
  <footer class="footer-section">
    <div class="footer-content">
      <div class="footer-brand">
        <h3 class="brand-name">{{ common.brand.name() }}</h3>
        <p class="brand-tagline">{{ common.brand.tagline() }}</p>
      </div>

      <div class="footer-links">
        <h4 class="links-title">{{ footer.social.title() }}</h4>
        <ul class="social-links">
          <li v-for="link in socialLinks" :key="link.name">
            <a
              :href="link.url"
              :aria-label="accessibility.visit(link.name)"
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
        <h4 class="contact-title">{{ footer.contact.title() }}</h4>
        <p class="contact-email">{{ formatEmail('pages.footer.contact.email') }}</p>
        <p class="contact-location">{{ footer.contact.location() }}</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        © {{ currentYear }} {{ common.copyright.text() }}
      </p>
      <p class="made-with">
        {{ common.copyright.madeWith() }}
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
    color: var(--bright-sun);
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px var(--bright-sun);
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
      color: var(--bright-sun);
      transform: translateX(4px);
    }

    &:focus-visible {
      outline: 2px solid var(--bright-sun);
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
    color: var(--picton-blue);
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
