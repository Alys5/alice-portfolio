<template>
  <!-- Home page: include la HeroSection e altre sezioni -->
  <HeroSection />
  <!-- Altri contenuti della home qui -->
</template>

<script setup lang="ts">
// Importa la HeroSection (sezione principale della home)
import HeroSection from '@/components/sections/HeroSection.vue'
</script>

<script lang="ts">
export default {
  name: 'HomeView', // Nome view per router e debug
}
</script>
