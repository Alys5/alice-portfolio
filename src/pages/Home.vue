<template>
  <BentoGrid size="large" gap="lg" padding="lg">
    <!-- Area Hero (large) -->
    <div class="bento-item bento-hero" style="grid-area: hero" tabindex="0">
      <Suspense>
        <template #default>
          <HeroSection />
        </template>
        <template #fallback>
          <div class="skeleton-hero">
            <div class="skeleton-badge"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-typewriter"></div>
            <div class="skeleton-desc"></div>
            <div class="skeleton-cta"></div>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Area Portfolio (medium) -->
    <div class="bento-item bento-portfolio" style="grid-area: portfolio" tabindex="0">
      <Suspense>
        <template #default>
          <PortfolioSection />
        </template>
        <template #fallback>
          <div class="skeleton-portfolio">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Area About (medium) -->
    <div class="bento-item bento-about" style="grid-area: about" tabindex="0">
      <Suspense>
        <template #default>
          <AboutSection />
        </template>
        <template #fallback>
          <div class="skeleton-about">
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Area Skills (small) -->
    <div class="bento-item bento-skills" style="grid-area: skills" tabindex="0">
      <Suspense>
        <template #default>
          <SkillsSection />
        </template>
        <template #fallback>
          <div class="skeleton-skills">
            <div class="skeleton-skill"></div>
            <div class="skeleton-skill"></div>
            <div class="skeleton-skill"></div>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Area Services (small) -->
    <div class="bento-item bento-services" style="grid-area: services" tabindex="0">
      <Suspense>
        <template #default>
          <ServicesSection />
        </template>
        <template #fallback>
          <div class="skeleton-services">
            <div class="skeleton-service"></div>
            <div class="skeleton-service"></div>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Area Experience (small) -->
    <div class="bento-item bento-experience" style="grid-area: experience" tabindex="0">
      <Suspense>
        <template #default>
          <ExperienceSection />
        </template>
        <template #fallback>
          <div class="skeleton-experience">
            <div class="skeleton-timeline"></div>
            <div class="skeleton-timeline"></div>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Area Testimonials (small) -->
    <div class="bento-item bento-testimonials" style="grid-area: testimonials" tabindex="0">
      <Suspense>
        <template #default>
          <TestimonialsSection />
        </template>
        <template #fallback>
          <div class="skeleton-testimonials">
            <div class="skeleton-testimonial"></div>
          </div>
        </template>
      </Suspense>
    </div>
    <!-- Area Contact (small) -->
    <div class="bento-item bento-contact" style="grid-area: contact" tabindex="0">
      <Suspense>
        <template #default>
          <ContactSection />
        </template>
        <template #fallback>
          <div class="skeleton-contact">
            <div class="skeleton-form"></div>
          </div>
        </template>
      </Suspense>
    </div>
  </BentoGrid>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import BentoGrid from '@/components/layout/BentoGrid.vue'

// Lazy loading per tutti i componenti delle sezioni per ottimizzare Core Web Vitals
const HeroSection = defineAsyncComponent(() => import('@/components/sections/HeroSection.vue'))
const PortfolioSection = defineAsyncComponent(
  () => import('@/components/sections/PortfolioSection.vue'),
)
const AboutSection = defineAsyncComponent(() => import('@/components/sections/AboutSection.vue'))
const SkillsSection = defineAsyncComponent(() => import('@/components/sections/SkillsSection.vue'))
const ServicesSection = defineAsyncComponent(
  () => import('@/components/sections/ServicesSection.vue'),
)
const ExperienceSection = defineAsyncComponent(
  () => import('@/components/sections/ExperienceSection.vue'),
)
const TestimonialsSection = defineAsyncComponent(
  () => import('@/components/sections/TestimonialsSection.vue'),
)
const ContactSection = defineAsyncComponent(
  () => import('@/components/sections/ContactSection.vue'),
)

// Importo il composable per i meta tag SEO
import { useMeta } from '@/composables/useMeta'

defineOptions({ name: 'HomePage' })

// Imposto i meta tag per la homepage
const { setPageMeta } = useMeta()

setPageMeta({
  title: 'Alice Mandelli - UI Developer & AI Strategist | Portfolio 2025',
  description:
    'UI Developer e AI Strategist specializzata in esperienze digitali intuitive e intelligenti. Portfolio con progetti Volkswagen, ŠKODA e design innovativo.',
  keywords:
    'UI Developer, UI Designer, AI Strategist, UX Designer, Frontend Developer, Vue.js, Design Systems, Artificial Intelligence, User Experience, Interface Design, Alice Mandelli',
  ogTitle: 'Alice Mandelli - UI Developer & AI Strategist',
  ogDescription:
    'Trasformo idee in esperienze digitali con focus su UI/UX e soluzioni AI. Specializzata in design di interfacce, sviluppo frontend e strategie AI.',
  twitterTitle: 'Alice Mandelli - UI Developer & AI Strategist',
  twitterDescription:
    'Trasformo idee in esperienze digitali con focus su UI/UX e soluzioni AI. Specializzata in design di interfacce, sviluppo frontend e strategie AI.',
})
</script>

<style scoped lang="scss">
// Layout Bento Grid con aree semantiche e breakpoint
.bento-grid {
  grid-template-areas:
    'hero hero hero hero hero hero portfolio portfolio about about skills skills'
    'hero hero hero hero hero hero portfolio portfolio about about services services'
    'hero hero hero hero hero hero portfolio portfolio about about experience experience'
    'hero hero hero hero hero hero portfolio portfolio about about testimonials testimonials'
    'hero hero hero hero hero hero portfolio portfolio about about contact contact'
    'hero hero hero hero hero hero portfolio portfolio about about contact contact'
    'hero hero hero hero hero hero portfolio portfolio about about contact contact'
    'hero hero hero hero hero hero portfolio portfolio about about contact contact';

  @media (max-width: 1024px) {
    grid-template-areas:
      'hero hero hero hero portfolio portfolio about about'
      'hero hero hero hero portfolio portfolio about about'
      'skills skills services services experience experience testimonials testimonials'
      'contact contact contact contact contact contact contact contact';
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(4, 120px);
  }

  @media (max-width: 768px) {
    grid-template-areas:
      'hero'
      'portfolio'
      'about'
      'skills'
      'services'
      'experience'
      'testimonials'
      'contact';
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}

// Ogni item occupa la propria area
.bento-hero {
  grid-area: hero;
}
.bento-portfolio {
  grid-area: portfolio;
}
.bento-about {
  grid-area: about;
}
.bento-skills {
  grid-area: skills;
}
.bento-services {
  grid-area: services;
}
.bento-experience {
  grid-area: experience;
}
.bento-testimonials {
  grid-area: testimonials;
}
.bento-contact {
  grid-area: contact;
}

// Focus visibile per accessibilità
.bento-item:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--border-radius-lg);
}

// Skeleton loading per migliorare perceived performance
.skeleton-hero,
.skeleton-portfolio,
.skeleton-about,
.skeleton-skills,
.skeleton-services,
.skeleton-experience,
.skeleton-testimonials,
.skeleton-contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.skeleton-badge {
  width: 120px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 16px;
}

.skeleton-title {
  width: 80%;
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
}

.skeleton-typewriter {
  width: 60%;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
}

.skeleton-desc {
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
}

.skeleton-cta {
  width: 160px;
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 24px;
}

.skeleton-card {
  width: 100%;
  height: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--space-md);
}

.skeleton-text {
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-sm);
}

.skeleton-skill {
  width: 100%;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-sm);
}

.skeleton-service {
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-sm);
}

.skeleton-timeline {
  width: 100%;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-sm);
}

.skeleton-testimonial {
  width: 100%;
  height: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
}

.skeleton-form {
  width: 100%;
  height: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-sm);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Reduced motion per accessibilità
@media (prefers-reduced-motion: reduce) {
  .skeleton-badge,
  .skeleton-title,
  .skeleton-typewriter,
  .skeleton-desc,
  .skeleton-cta,
  .skeleton-card,
  .skeleton-text,
  .skeleton-skill,
  .skeleton-service,
  .skeleton-timeline,
  .skeleton-testimonial,
  .skeleton-form {
    animation: none;
    background: #f0f0f0;
  }
}
</style>
