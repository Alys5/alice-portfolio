<script setup lang="ts">
// import { useHead } from '@vueuse/head' // Decommenta se hai @vueuse/head installato
import { ref, onMounted } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import BentoGrid from '@/components/sections/BentoGrid.vue'
import AnimatedSection from '@/components/sections/AnimatedSection.vue'
import FooterSection from '@/components/layout/FooterSection.vue'

// Page state
const isLoaded = ref(false)

// Demo data per BentoGrid
const bentoItems = [
  { id: 1, area: 'area1', accent: 'bright-sun' as const, title: 'UI/UX Design', desc: 'Esperienze utente moderne e accessibili.' },
  { id: 2, area: 'area2', accent: 'persian-blue' as const, title: 'Motion Design', desc: 'Animazioni fluide e micro-interazioni.' },
  { id: 3, area: 'area3', accent: 'picton-blue' as const, title: 'Web Development', desc: 'Siti performanti e responsive.' },
  { id: 4, area: 'area4', accent: 'ebony-clay' as const, title: 'Consulting', desc: 'Consulenza su trend e strategie digitali.' },
]

onMounted(() => {
  isLoaded.value = true
})
</script>

<template>
  <main id="main-content" class="home-view">
    <HeroSection />
    <BentoGrid :items="bentoItems" :columns="{ mobile: 1, tablet: 2, desktop: 4 }" gap="2rem" />
    <AnimatedSection animation="fadeIn" :threshold="0.15">
      <div class="content-placeholder">
        <h2>Sezione Animata</h2>
        <p>Contenuto della sezione animata</p>
      </div>
    </AnimatedSection>
    <FooterSection />
  </main>
</template>

<style lang="scss" scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, vars.$persian-blue, vars.$picton-blue);
  color: vars.$ebony-clay;
  overflow-x: hidden;
}

.content-placeholder {
  padding: 2rem;
  text-align: center;

  h2 {
    color: vars.$bright-sun;
    margin-bottom: 1rem;
  }
}
</style>
