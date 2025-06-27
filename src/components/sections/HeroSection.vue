<template>
  <section class="hero-section" :class="{ 'is-visible': isVisible }">
    <div class="hero-background">
      <div class="hero-gradient" />
      <div class="hero-particles" />
    </div>

    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          <span class="title-line">Alice Mandelli</span>
          <span class="title-subtitle">UI/UX Designer</span>
        </h1>

        <p class="hero-description">
          Creo esperienze digitali moderne e accessibili,
          combinando design innovativo con tecnologie all'avanguardia.
        </p>

        <div class="hero-actions">
          <AnimatedButton
            @click="handleCtaClick"
            class="cta-button"
            aria-label="Scopri il mio portfolio"
          >
            Scopri il Portfolio
          </AnimatedButton>

          <a
            href="#contact"
            class="secondary-button"
            aria-label="Contattami"
          >
            Contattami
          </a>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-avatar">
          <div class="avatar-placeholder">
            <span class="avatar-initial">A</span>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-scroll-indicator">
      <div class="scroll-arrow" />
      <span class="scroll-text">Scorri per scoprire</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AnimatedButton from '@/components/ui/AnimatedButton.vue'

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})

const handleCtaClick = () => {
  // Scroll to next section
  const nextSection = document.querySelector('#main-content')
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;

  &.is-visible {
    .hero-title {
      opacity: 1;
      transform: none;
    }

    .hero-description {
      opacity: 1;
      transform: none;
    }

    .hero-actions {
      opacity: 1;
      transform: none;
    }

    .hero-visual {
      opacity: 1;
      transform: none;
    }
  }
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, vars.$persian-blue, vars.$picton-blue);
  opacity: 0.9;
}

.hero-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 80%, vars.$bright-sun-alpha 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, vars.$picton-blue-alpha 0%, transparent 50%);
  animation: particle-float 20s ease-in-out infinite;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4rem;
  align-items: center;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
}

.hero-text {
  .hero-title {
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .title-line {
      display: block;
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 800;
      color: vars.$bright-sun;
      text-shadow: 0 0 20px vars.$bright-sun;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .title-subtitle {
      display: block;
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 0.5rem;
    }
  }

  .hero-description {
    font-size: clamp(1.1rem, 2.5vw, 1.3rem);
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 600px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }
}

.cta-button {
  background: linear-gradient(135deg, vars.$bright-sun, vars.$persian-blue);
  color: vars.$ebony-clay;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 201, 64, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 201, 64, 0.4);
  }
}

.secondary-button {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
}

.hero-visual {
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s;

  @media (max-width: 768px) {
    transform: translateY(30px);
  }
}

.hero-avatar {
  .avatar-placeholder {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, vars.$bright-sun, vars.$picton-blue);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(255, 201, 64, 0.3);
    animation: avatar-float 6s ease-in-out infinite;

    @media (max-width: 768px) {
      width: 150px;
      height: 150px;
      margin: 0 auto;
    }
  }

  .avatar-initial {
    font-size: 4rem;
    font-weight: 800;
    color: vars.$ebony-clay;

    @media (max-width: 768px) {
      font-size: 3rem;
    }
  }
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;

  .scroll-arrow {
    width: 2px;
    height: 30px;
    background: vars.$bright-sun;
    border-radius: 1px;
    animation: scroll-bounce 2s ease-in-out infinite;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid vars.$bright-sun;
    }
  }

  .scroll-text {
    font-weight: 500;
  }
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes avatar-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-section {
    .hero-title,
    .hero-description,
    .hero-actions,
    .hero-visual {
      transition: none;
      opacity: 1;
      transform: none;
    }
  }

  .hero-particles,
  .avatar-placeholder,
  .scroll-arrow {
    animation: none;
  }
}
</style>
