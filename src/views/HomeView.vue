<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import FooterSection from '@/components/layout/FooterSection.vue'
import BlogPreviewSection from '@/components/sections/BlogPreviewSection.vue'
import LeadMagnetSection from '@/components/sections/LeadMagnetSection.vue'
import FluidAnimationsDemo from '@/components/ui/FluidAnimationsDemo.vue'

// Types
interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  privacy: boolean
}

interface LeadFormData {
  email: string
  firstName: string
  interests: string[]
}

// Template refs
const contactSection = ref<InstanceType<typeof ContactSection> | null>(null)
const sectionsContainer = ref<HTMLElement | null>(null)

// Intersection Observer per animazioni
const observedSections = ref<Set<HTMLElement>>(new Set())

// Event handlers
const handleServiceSelect = (serviceId: string) => {
  console.log('Service selected:', serviceId)
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'service_interest', {
      service_id: serviceId,
      event_category: 'engagement'
    })
  }
  scrollToContact()
}

const handleProjectSelect = (projectId: string) => {
  console.log('Project selected:', projectId)
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'project_view', {
      project_id: projectId,
      event_category: 'engagement'
    })
  }
}

const handleViewAllProjects = () => {
  console.log('View all projects clicked')
  // Implementare navigazione a pagina portfolio completa
  // router.push('/portfolio')
}

const handleDownloadCV = () => {
  console.log('Download CV clicked')
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'cv_download', {
      event_category: 'conversion'
    })
  }
  // Implementare download CV
  const link = document.createElement('a')
  link.href = '/assets/cv-alice-mandelli.pdf'
  link.download = 'CV-Alice-Mandelli-2025.pdf'
  link.click()
}

const handleContactSubmit = (formData: ContactFormData) => {
  console.log('Contact form submitted:', formData)
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'contact_form_submit', {
      event_category: 'conversion'
    })
  }
  // Implementare invio form contatto
}

const handleLeadMagnetSubmit = (formData: LeadFormData) => {
  console.log('Lead magnet form submitted:', formData)
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'lead_magnet_signup', {
      interests: formData.interests.join(','),
      event_category: 'conversion'
    })
  }
  // Implementare lead generation logic
}

const scrollToContact = () => {
  contactSection.value?.$el?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Intersection Observer setup
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in')
          observedSections.value.add(entry.target as HTMLElement)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  // Osserva tutte le sezioni
  const sections = document.querySelectorAll('section[data-animate]')
  sections.forEach((section) => {
    observer.observe(section)
  })

  // Cleanup
  return () => {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="home-view" ref="sectionsContainer">
    <!-- Hero Section con CTA professionale -->
    <section data-animate class="hero-wrapper">
      <HeroSection
        @contact-cta="scrollToContact"
        @view-work="() => scrollToSection('portfolio')"
        @download-cv="handleDownloadCV"
      />
    </section>

    <!-- About Section con design Bento -->
    <section data-animate id="about" class="section-wrapper">
      <AboutSection
        @contact-cta="scrollToContact"
      />
    </section>

    <!-- Services Section con cards glassmorphism -->
    <section data-animate id="services" class="section-wrapper">
      <ServicesSection
        @service-select="handleServiceSelect"
        @contact-cta="scrollToContact"
      />
    </section>

    <!-- Lead Magnet Section per conversioni -->
    <section data-animate class="section-wrapper lead-magnet-wrapper">
      <LeadMagnetSection
        @form-submit="handleLeadMagnetSubmit"
      />
    </section>

    <!-- Portfolio Section con grid moderna -->
    <section data-animate id="portfolio" class="section-wrapper">
      <PortfolioSection
        @project-select="handleProjectSelect"
        @view-all="handleViewAllProjects"
      />
    </section>

    <!-- Experience Section con timeline -->
    <section data-animate id="experience" class="section-wrapper">
      <ExperienceSection
        @download-cv="handleDownloadCV"
        @contact-cta="scrollToContact"
      />
    </section>

    <!-- Skills Section con visualizzazioni interattive -->
    <section data-animate id="skills" class="section-wrapper">
      <SkillsSection
        @contact-cta="scrollToContact"
      />
    </section>

    <!-- Fluid Animations Demo -->
    <section data-animate id="animations" class="section-wrapper animations-wrapper">
      <FluidAnimationsDemo />
    </section>

    <!-- Blog Preview per SEO e content marketing -->
    <section data-animate id="blog" class="section-wrapper">
      <BlogPreviewSection
        @contact-cta="scrollToContact"
      />
    </section>

    <!-- Testimonials Section con social proof -->
    <section data-animate id="testimonials" class="section-wrapper">
      <TestimonialsSection
        @contact-cta="scrollToContact"
      />
    </section>

    <!-- Contact Section ottimizzata per conversioni -->
    <section data-animate id="contact" class="section-wrapper contact-wrapper">
      <ContactSection
        ref="contactSection"
        @form-submit="handleContactSubmit"
      />
    </section>

    <!-- Footer professionale -->
    <FooterSection />
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--charcoal) 0%, var(--ebony-clay) 50%, var(--persian-blue) 100%);
  position: relative;
  overflow-x: hidden;
}

.section-wrapper {
  position: relative;

  // Animazioni staggered per le sezioni
  &:nth-child(odd) {
    animation-delay: 0.1s;
  }

  &:nth-child(even) {
    animation-delay: 0.2s;
  }

  // Separatori visivi sottili
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--glass-light), transparent);
  }
}

.hero-wrapper {
  // Gradient overlay per migliore contrasto
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(26, 29, 35, 0.8) 0%,
      rgba(41, 53, 63, 0.6) 50%,
      rgba(32, 72, 180, 0.4) 100%
    );
    z-index: 1;
  }

  :deep(.hero-content) {
    position: relative;
    z-index: 2;
  }
}

.lead-magnet-wrapper {
  // Styling specifico per lead magnet
  background: linear-gradient(90deg,
    var(--glass-ultra-light),
    var(--glass-light)
  );
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--glass-medium);
  border-bottom: 1px solid var(--glass-medium);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center,
      rgba(255, 201, 64, 0.05) 0%,
      transparent 70%
    );
  }
}

.contact-wrapper {
  // Styling per la sezione contatti
  background: linear-gradient(135deg,
    var(--ebony-clay) 0%,
    var(--charcoal) 100%
  );

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at bottom,
      rgba(72, 169, 248, 0.1) 0%,
      transparent 50%
    );
  }
}

.animations-wrapper {
  // Styling per la sezione animazioni
  background: linear-gradient(135deg,
    var(--ebony-clay) 0%,
    #1a202c 50%,
    var(--persian-blue) 100%
  );

  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 20%,
      rgba(255, 201, 64, 0.1) 0%,
      transparent 50%
    );
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 70% 80%,
      rgba(72, 169, 248, 0.1) 0%,
      transparent 50%
    );
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .section-wrapper {
    &::after {
      width: 80%;
    }
  }
}

// Smooth scrolling enhancement
@media (prefers-reduced-motion: no-preference) {
  .home-view {
    scroll-behavior: smooth;
  }
}

// Accessibilità per reduced motion
@media (prefers-reduced-motion: reduce) {
  .home-view {
    scroll-behavior: auto;
  }

  .section-wrapper {
    animation: none !important;
    animation-delay: 0s !important;
  }
}

// Performance: will-change per elementi animati
.section-wrapper[data-animate] {
  will-change: opacity, transform;

  &.animate-fade-in {
    will-change: auto;
  }
}
</style>
