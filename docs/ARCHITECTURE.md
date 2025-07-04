# Architettura - Alice Mandelli Portfolio

## Panoramica

Il portfolio di Alice Mandelli è costruito con un'architettura moderna basata su Vue 3, seguendo i principi di componentizzazione, reattività e performance ottimizzata.

## Stack Tecnologico

### Frontend Framework

- **Vue 3** - Framework progressivo con Composition API
- **TypeScript** - Type safety e migliore DX
- **Vite** - Build tool moderno e veloce

### Styling & Design

- **SCSS** - Preprocessor CSS avanzato
- **CSS Variables** - Design system dinamico
- **GSAP** - Animazioni performanti
- **VueUse Motion** - Micro-animazioni

### Routing & State

- **Vue Router 4** - Navigazione SPA
- **Pinia** - State management moderno
- **Vue i18n** - Internazionalizzazione

### Build & Deploy

- **Vite** - Development server e build
- **Vercel** - Hosting e CI/CD
- **PWA** - Progressive Web App

## Architettura Componenti

### Struttura Gerarchica

```
App.vue
├── NavigationBar.vue
├── RouterView
│   ├── HomeView.vue
│   │   ├── HeroSection.vue
│   │   ├── AboutSection.vue
│   │   ├── SkillsSection.vue
│   │   ├── PortfolioSection.vue
│   │   ├── ContactSection.vue
│   │   └── FooterSection.vue
│   └── MaintenanceView.vue
└── CustomCursor.vue
```

### Pattern Architetturali

#### 1. Composition API

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAnimations } from '@/composables/useAnimations'

// Reactive state
const isLoading = ref(false)
const data = ref([])

// Computed properties
const filteredData = computed(() => data.value.filter((item) => item.active))

// Composables
const { t } = useI18n()
const { animateIn } = useAnimations()

// Lifecycle
onMounted(() => {
  animateIn()
})
</script>
```

#### 2. Props & Emits

```vue
<!-- Parent Component -->
<ChildComponent :data="parentData" @update="handleUpdate" />

<!-- Child Component -->
<script setup lang="ts">
interface Props {
  data: Array<any>
}

interface Emits {
  (e: 'update', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('update', newValue)
}
</script>
```

#### 3. Composables Pattern

```typescript
// useAnimations.ts
export function useAnimations() {
  const animateIn = () => {
    // Animation logic
  }

  const animateOut = () => {
    // Animation logic
  }

  return {
    animateIn,
    animateOut,
  }
}
```

## Design System

### Palette Colori

```scss
// variables.scss
$bright-sun: #ffc940; // Giallo brillante
$ebony-clay: #29353f; // Grigio scuro
$persian-blue: #2048b4; // Blu profondo
$picton-blue: #48a9f8; // Blu chiaro
```

### Typography

```scss
// Typography scale
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-lg: 1.125rem; // 18px
$font-size-xl: 1.25rem; // 20px
$font-size-2xl: 1.5rem; // 24px
```

### Spacing

```scss
// Spacing scale
$spacing-xs: 0.25rem; // 4px
$spacing-sm: 0.5rem; // 8px
$spacing-md: 1rem; // 16px
$spacing-lg: 1.5rem; // 24px
$spacing-xl: 2rem; // 32px
```

## Performance Architecture

### Code Splitting

```typescript
// Lazy loading routes
const HomeView = () => import('@/views/HomeView.vue')
const MaintenanceView = () => import('@/views/MaintenanceView.vue')

// Lazy loading components
const HeavyComponent = defineAsyncComponent(() => import('@/components/HeavyComponent.vue'))
```

### Image Optimization

```vue
<template>
  <img :src="optimizedImage" :alt="alt" loading="lazy" decoding="async" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const optimizedImage = computed(() => {
  return new URL(`../assets/${props.src}`, import.meta.url).href
})
</script>
```

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          animations: ['gsap', '@vueuse/motion'],
        },
      },
    },
  },
})
```

## State Management

### Pinia Store

```typescript
// stores/main.ts
export const useMainStore = defineStore('main', () => {
  // State
  const isLoading = ref(false)
  const currentLanguage = ref('it')

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const changeLanguage = (lang: string) => {
    currentLanguage.value = lang
  }

  return {
    isLoading,
    currentLanguage,
    setLoading,
    changeLanguage,
  }
})
```

### Composables per State

```typescript
// composables/useTheme.ts
export function useTheme() {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark')
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
  }
}
```

## Routing Architecture

### Route Structure

```typescript
// router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home',
      description: 'Portfolio di Alice Mandelli',
    },
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: MaintenanceView,
    meta: {
      title: 'Manutenzione',
      noIndex: true,
    },
  },
]
```

### Navigation Guards

```typescript
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'Alice Mandelli Portfolio'

  // Maintenance mode check
  if (import.meta.env.VITE_MAINTENANCE_MODE === 'true' && to.name !== 'maintenance') {
    next({ name: 'maintenance' })
  } else {
    next()
  }
})
```

## Internationalization

### i18n Structure

```typescript
// i18n/index.ts
const messages = {
  it: {
    nav: {
      home: 'Home',
      about: 'Chi Sono',
      portfolio: 'Portfolio',
      contact: 'Contatto',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
  },
}
```

### Usage Pattern

```vue
<template>
  <nav>
    <a href="#home">{{ t('nav.home') }}</a>
    <a href="#about">{{ t('nav.about') }}</a>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
</script>
```

## Error Handling

### Global Error Handler

```typescript
// main.ts
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)

  // Send to error tracking service
  trackError(err, info)
}
```

### Component Error Boundaries

```vue
<template>
  <ErrorBoundary>
    <template #default>
      <slot />
    </template>
    <template #error="{ error }">
      <div class="error-fallback">
        <h3>Qualcosa è andato storto</h3>
        <p>{{ error.message }}</p>
      </div>
    </template>
  </ErrorBoundary>
</template>
```

## Testing Architecture

### Unit Tests

```typescript
// tests/components/Example.test.ts
import { mount } from '@vue/test-utils'
import ExampleComponent from '@/components/ExampleComponent.vue'

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(ExampleComponent)
    expect(wrapper.find('.example').exists()).toBe(true)
  })
})
```

### Integration Tests

```typescript
// tests/integration/Navigation.test.ts
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

describe('Navigation', () => {
  it('navigates to different sections', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [],
    })

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    await wrapper.find('[data-test="nav-about"]').trigger('click')
    expect(router.currentRoute.value.name).toBe('about')
  })
})
```

## Security Architecture

### Content Security Policy

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
/>
```

### XSS Prevention

```vue
<template>
  <!-- Safe: Vue automatically escapes content -->
  <div>{{ userInput }}</div>

  <!-- Dangerous: Only use when necessary -->
  <div v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'

const sanitizedHtml = computed(() => DOMPurify.sanitize(rawHtml.value))
</script>
```

## Monitoring & Analytics

### Performance Monitoring

```typescript
// composables/usePerformance.ts
export function usePerformance() {
  const reportWebVitals = (metric: any) => {
    // Send to analytics service
    analytics.track('web_vitals', metric)
  }

  onMounted(() => {
    getCLS(reportWebVitals)
    getFID(reportWebVitals)
    getLCP(reportWebVitals)
  })
}
```

### Error Tracking

```typescript
// utils/errorTracking.ts
export const trackError = (error: Error, context?: any) => {
  // Send to error tracking service
  console.error('Error tracked:', error, context)
}
```

## Deployment Architecture

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Environment Configuration

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: mode === 'development',
  },
}))
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy:normal
```

## Scalability Considerations

### Component Reusability

- Design components as pure functions
- Use props for configuration
- Implement slot system for flexibility
- Create composables for shared logic

### Performance Optimization

- Implement virtual scrolling for large lists
- Use `v-memo` for expensive computations
- Optimize images and assets
- Implement proper caching strategies

### Maintainability

- Follow consistent naming conventions
- Document complex logic
- Use TypeScript for type safety
- Implement comprehensive testing

## Future Considerations

### Migration Path

- Vue 3 migration completed
- TypeScript integration
- Modern build tooling
- Performance optimizations

### Potential Improvements

- Server-side rendering (SSR)
- Static site generation (SSG)
- Micro-frontend architecture
- Advanced caching strategies
