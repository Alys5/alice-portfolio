<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import useCursor from '@/composables/useCursor'
import { useTranslation } from '@/composables/useI18n'
import CustomCursor from '@/components/ui/CustomCursor.vue'
import ProfessionalNavbar from '@/components/layout/ProfessionalNavbar.vue'

// i18n
const { common, t } = useTranslation()

// Loading state
const isAppLoading = ref(true)
const isRouteLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const showError = ref(false)
const errorMessage = ref('')
const skipLinkRef = ref<HTMLAnchorElement | null>(null)

// Theme management
const { isDark, toggleTheme } = useTheme()
const themeClass = ref('dark-theme')

watch(isDark, (val) => {
  themeClass.value = val ? 'dark-theme' : 'light-theme'
  document.documentElement.classList.toggle('dark-theme', val)
  document.documentElement.classList.toggle('light-theme', !val)

  // Aggiorna meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
  if (meta) meta.content = val ? '#1a1d23' : '#ffffff'
})

// Cursor management
const { isVisible: cursorVisible } = useCursor()

// Router management con progress bar
const router = useRouter()
let routeTimeout: number | null = null

router.beforeEach((to, from, next) => {
  isRouteLoading.value = true
  next()
})

router.afterEach(() => {
  if (routeTimeout) clearTimeout(routeTimeout)
  routeTimeout = window.setTimeout(() => {
    isRouteLoading.value = false
  }, 600)
})

// Initial loading con animazione professionale
onMounted(() => {
  // Simula caricamento risorse
  Promise.all([
    // Simula caricamento font
    new Promise(resolve => setTimeout(resolve, 400)),
    // Simula caricamento immagini critiche
    new Promise(resolve => setTimeout(resolve, 600))
  ]).then(() => {
    setTimeout(() => {
      isAppLoading.value = false
      nextTick(() => {
        if (skipLinkRef.value) skipLinkRef.value.focus()
      })
    }, 800)
  })

  // Event listeners
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
})

function onKeydown(e: KeyboardEvent) {
  // Theme toggle shortcut
  if (e.ctrlKey && e.key.toLowerCase() === 'd') {
    e.preventDefault()
    toggleTheme()
    showToastMessage(isDark.value ? common.theme.darkMode() : common.theme.lightMode())
  }

  // Skip link visibility
  if (e.key === 'Tab' && skipLinkRef.value) {
    skipLinkRef.value.classList.add('skip-link--visible')
    setTimeout(() => skipLinkRef.value?.classList.remove('skip-link--visible'), 3000)
  }
}

function onResize() {
  // Aggiorna CSS custom properties per responsive
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function showToastMessage(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

// Performance: preload critical resources
const preloadCriticalResources = () => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
  link.as = 'style'
  document.head.appendChild(link)
}

onMounted(preloadCriticalResources)
</script>

<template>
  <div id="app" :class="themeClass" class="app-root">
    <!-- Skip Navigation -->
    <a
      href="#main-content"
      class="skip-link"
      ref="skipLinkRef"
      @click="skipLinkRef?.blur()"
    >
      {{ common.navigation.skipToContent() }}
    </a>

    <!-- Professional Loading Screen -->
    <Transition name="loading-fade">
      <div
        v-if="isAppLoading"
        class="app-loading"
        role="status"
        :aria-label="common.brand.loadingPortfolio()"
      >
        <div class="loading-content">
          <div class="brand-logo animate-scale-in">
            <div class="logo-circle">
              <span class="logo-text">AM</span>
            </div>
          </div>

          <div class="loading-text animate-fade-in animate-delay-300">
            <h2 class="text-gradient-primary">{{ common.brand.name() }}</h2>
            <p class="loading-subtitle">{{ t('accessibility.portfolio') }}</p>
          </div>

          <div class="loading-progress animate-fade-in animate-delay-500">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Custom Cursor -->
    <CustomCursor v-if="cursorVisible" />

    <!-- Professional Navbar -->
    <ProfessionalNavbar />

    <!-- Toast Notifications -->
    <Transition name="toast-slide">
      <div
        v-if="showToast"
        class="toast-notification"
        role="status"
        aria-live="polite"
      >
        <div class="toast-content">
          <span class="toast-message">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>

    <!-- Error Boundary -->
    <Transition name="error-slide">
      <div
        v-if="showError"
        class="error-notification"
        role="alert"
      >
        <div class="error-content">
          <span class="error-message">{{ errorMessage }}</span>
        </div>
      </div>
    </Transition>

    <!-- Route Progress Bar -->
    <Transition name="progress-fade">
      <div v-if="isRouteLoading" class="route-progress">
        <div class="progress-line"></div>
      </div>
    </Transition>

    <!-- Main App Content -->
    <main
      id="main-content"
      class="app-main"
      :class="{ 'loading': isRouteLoading }"
    >
      <RouterView v-slot="{ Component, route }">
        <div class="page-wrapper">
          <Suspense>
            <template #default>
              <component
                :is="Component"
                :key="route.fullPath"
                class="page-content"
              />
            </template>
            <template #fallback>
              <div class="page-skeleton" aria-busy="true">
                <div class="skeleton-content">
                  <div class="skeleton-header"></div>
                  <div class="skeleton-text"></div>
                  <div class="skeleton-text short"></div>
                </div>
              </div>
            </template>
          </Suspense>
        </div>
      </RouterView>
    </main>

    <!-- Accessibility Live Region -->
    <div
      id="live-region"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.app-root {
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  background: linear-gradient(135deg, var(--charcoal) 0%, var(--ebony-clay) 50%, var(--persian-blue) 100%);
  position: relative;
  overflow-x: hidden;
  isolation: isolate;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: var(--space-4);
  background: var(--bright-sun);
  color: var(--charcoal);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: var(--font-size-sm);
  text-decoration: none;
  z-index: 9999;
  transition: left var(--duration-normal) var(--easing-standard);
  box-shadow: var(--shadow-lg);

  &:focus,
  &.skip-link--visible {
    left: var(--space-4);
  }
}

.app-loading {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, var(--charcoal), var(--ebony-clay));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;

  .loading-content {
    text-align: center;
    max-width: 400px;
    padding: var(--space-8);
  }

  .brand-logo {
    margin-bottom: var(--space-8);

    .logo-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--bright-sun), var(--emerald));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: var(--shadow-glow);

      .logo-text {
        font-size: 2rem;
        font-weight: 800;
        color: var(--charcoal);
      }
    }
  }

  .loading-text {
    margin-bottom: var(--space-6);

    h2 {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--space-2);
    }

    .loading-subtitle {
      color: var(--slate-gray);
      font-size: var(--font-size-base);
    }
  }

  .loading-progress {
    .progress-bar {
      width: 200px;
      height: 3px;
      background: var(--glass-light);
      border-radius: 9999px;
      overflow: hidden;
      margin: 0 auto;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--bright-sun), var(--emerald));
        border-radius: inherit;
        animation: progressFill 2s ease-in-out infinite;
      }
    }
  }
}

@keyframes progressFill {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.toast-notification {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  background: var(--glass-medium);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-light);
  border-radius: 0.75rem;
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-lg);
  z-index: 9997;

  .toast-content {
    .toast-message {
      color: var(--bright-sun);
      font-weight: 500;
      font-size: var(--font-size-sm);
    }
  }
}

.error-notification {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  background: rgba(239, 68, 68, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-lg);
  z-index: 9997;

  .error-content {
    .error-message {
      color: white;
      font-weight: 500;
      font-size: var(--font-size-sm);
    }
  }
}

.route-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9996;

  .progress-line {
    height: 100%;
    background: linear-gradient(90deg, var(--bright-sun), var(--emerald));
    animation: routeProgress 0.8s ease-out infinite;
  }
}

@keyframes routeProgress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.app-main {
  position: relative;
  z-index: 1;

  &.loading {
    pointer-events: none;
  }
}

.page-content {
  min-height: calc(100vh - 80px); // Altezza navbar
}

.page-wrapper {
  width: 100%;
  min-height: 100%;
}

.page-skeleton {
  padding: var(--space-20) var(--space-6);
  max-width: 1280px;
  margin: 0 auto;

  .skeleton-content {
    .skeleton-header,
    .skeleton-text {
      background: var(--glass-light);
      border-radius: 0.5rem;
      animation: skeletonPulse 2s ease-in-out infinite;
    }

    .skeleton-header {
      height: 3rem;
      margin-bottom: var(--space-6);
      width: 60%;
    }

    .skeleton-text {
      height: 1rem;
      margin-bottom: var(--space-3);

      &.short {
        width: 40%;
      }
    }
  }
}

@keyframes skeletonPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Transitions
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.5s var(--easing-standard);
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s var(--easing-standard);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s var(--easing-standard);
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.2s var(--easing-standard);
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.4s var(--easing-standard);
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .app-loading,
  .toast-notification,
  .error-notification,
  .route-progress,
  .page-skeleton {
    animation: none;
    transition: none;
  }

  .progress-fill,
  .progress-line {
    animation: none;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .skip-link {
    border: 2px solid var(--charcoal);
  }

  .toast-notification,
  .error-notification {
    border-width: 2px;
  }
}
</style>

