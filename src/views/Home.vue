<template>
  <!-- Home page: include tutte le sezioni principali -->
  <HeroSection />
  <AboutSection />
  <SkillsSection />
  <ServicesSection />
  <PortfolioSection />
  <ExperienceSection />
  <TestimonialsSection />
  <ContactSection />
</template>

<script setup lang="ts">
// Importa tutte le sezioni principali
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<script lang="ts">
export default {
  name: 'HomeView', // Nome view per router e debug
}
</script>
