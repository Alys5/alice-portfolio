<template>
  <section class="resume-section" aria-labelledby="resume-title">
    <h2 id="resume-title" class="sr-only">Curriculum</h2>
    <div
      v-for="section in orderedSections"
      :key="section.key"
      :class="['resume-block', 'fade-up', { 'is-visible': visibleSections[section.key] }]"
      :ref="(el) => setSectionRef(section.key, el as Element)"
      tabindex="-1"
      :aria-labelledby="`resume-${section.key}-title`"
    >
      <component :is="getSectionComponent(section.key)" :section="section.data" />
    </div>
    <div aria-live="polite" aria-atomic="true" class="sr-only">{{ announcement }}</div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import resume from '@/data/resume.json'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

// Componenti per ogni sezione
const IntroSection = {
  props: ['section'],
  template: `
    <header class="resume-intro">
      <h3 id="resume-intro-title">{{ section.nome }}</h3>
      <p class="resume-title">{{ section.ruolo }}</p>
      <p class="resume-location">{{ section.località }}</p>
      <p class="resume-summary">{{ section.profilo }}</p>
    </header>
  `,
}
const EsperienzeSection = {
  props: ['section'],
  template: `
    <section>
      <h3 id="resume-esperienze-title">Esperienze</h3>
      <ul class="resume-list">
        <li v-for="(exp, i) in section" :key="i">
          <strong>{{ exp.ruolo }}</strong> – {{ exp.azienda }}<br />
          <span class="resume-period">{{ exp.periodo }}</span>
          <p>{{ exp.descrizione }}</p>
        </li>
      </ul>
    </section>
  `,
}
const IstruzioneSection = {
  props: ['section'],
  template: `
    <section>
      <h3 id="resume-istruzione-title">Istruzione</h3>
      <ul class="resume-list">
        <li v-for="(edu, i) in section" :key="i">
          <strong>{{ edu.titolo }}</strong> – {{ edu.istituto }} ({{ edu.anno }})
        </li>
      </ul>
    </section>
  `,
}
const CompetenzeSection = {
  props: ['section'],
  template: `
    <section>
      <h3 id="resume-competenze-title">Competenze</h3>
      <ul class="resume-skills">
        <li v-for="(skill, i) in section" :key="i">{{ skill }}</li>
      </ul>
    </section>
  `,
}
const CertificazioniSection = {
  props: ['section'],
  template: `
    <section>
      <h3 id="resume-certificazioni-title">Certificazioni</h3>
      <ul class="resume-list">
        <li v-for="(cert, i) in section" :key="i">
          <strong>{{ cert.titolo }}</strong>
          <template v-if="cert.istituto"> – {{ cert.istituto }}</template>
          <template v-if="cert.anno"> ({{ cert.anno }})</template>
          <template v-if="cert.descrizione"><br />{{ cert.descrizione }}</template>
        </li>
      </ul>
    </section>
  `,
}

const sectionComponents = {
  Intro: IntroSection,
  Esperienze: EsperienzeSection,
  Istruzione: IstruzioneSection,
  Competenze: CompetenzeSection,
  Certificazioni: CertificazioniSection,
}

function getSectionComponent(key: string) {
  return (
    sectionComponents[key as keyof typeof sectionComponents] || {
      props: ['section'],
      template: '<div />',
    }
  )
}

// Ordine delle sezioni come in resume.json
const orderedSections = [
  { key: 'Intro', data: resume.Intro },
  { key: 'Esperienze', data: resume.Esperienze },
  { key: 'Istruzione', data: resume.Istruzione },
  { key: 'Competenze', data: resume.Competenze },
  { key: 'Certificazioni', data: resume.Certificazioni },
].filter((s) => s.data)

// Visibilità per fade-up
const visibleSections = reactive<Record<string, boolean>>({})
const sectionRefs = ref<Record<string, Element | null>>({})
const announcement = ref('')

function setSectionRef(key: string, el: Element | null) {
  sectionRefs.value[key] = el
}

onMounted(() => {
  nextTick(() => {
    Object.entries(sectionRefs.value).forEach(([key, el]) => {
      if (el) {
        const { observe } = useIntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              visibleSections[key] = true
              announcement.value = `Sezione ${key} visibile`
            }
          },
          { threshold: 0.2 },
        )
        observe(el)
      }
    })
  })
})
</script>

<style scoped>
.resume-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl, 2.5rem);
  margin: 0 auto;
  max-width: 800px;
  padding: var(--space-lg, 2rem);
}
.resume-block {
  background: var(--neutral-100);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
  outline: none;
  transition: box-shadow 0.3s var(--ease-out-expo);
}
.resume-block:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
.fade-up {
  opacity: 0;
  transform: translateY(2rem);
  transition:
    opacity 0.6s var(--ease-out-expo),
    transform 0.6s var(--ease-out-expo);
}
.fade-up.is-visible {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .fade-up,
  .fade-up.is-visible {
    transition: none !important;
    transform: none !important;
  }
}
.resume-intro {
  text-align: center;
  margin-bottom: var(--space-md);
}
.resume-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--brand-color);
}
.resume-location {
  color: var(--color-text-secondary);
  font-size: 1.05em;
  margin-bottom: 0.5rem;
}
.resume-summary {
  color: var(--color-text-primary);
  margin-top: 0.5rem;
}
.resume-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.resume-list li {
  margin-bottom: 1.25rem;
}
.resume-period {
  font-size: 0.95em;
  color: var(--color-text-secondary);
}
.resume-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
.resume-skills li {
  background: var(--neutral-200);
  border-radius: var(--radius-sm);
  padding: 0.5em 1em;
  font-size: 1em;
}
</style>
