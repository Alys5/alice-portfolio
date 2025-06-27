<template>
  <div class="example-container">
    <div class="example-header">
      <h3>Demo Interattiva</h3>
      <div class="example-controls">
        <button
          @click="toggleCode"
          class="code-toggle"
          :aria-expanded="showCode"
          :aria-controls="'code-' + componentName"
        >
          {{ showCode ? 'Nascondi' : 'Mostra' }} Codice
        </button>
        <button @click="resetDemo" class="reset-button" aria-label="Ripristina demo">🔄</button>
      </div>
    </div>

    <div class="example-demo">
      <div class="demo-frame">
        <component
          :is="demoComponent"
          v-bind="demoProps"
          @click="handleDemoEvent"
          @focus="handleDemoEvent"
          @blur="handleDemoEvent"
        />
      </div>
    </div>

    <Transition name="slide-fade">
      <div v-if="showCode" :id="'code-' + componentName" class="example-code">
        <div class="code-header">
          <span>Codice</span>
          <button
            @click="copyCode"
            class="copy-button"
            :aria-label="copied ? 'Copiato!' : 'Copia codice'"
          >
            {{ copied ? '✅' : '📋' }}
          </button>
        </div>
        <pre><code>{{ demoCode }}</code></pre>
      </div>
    </Transition>

    <div class="example-info">
      <div class="info-item"><strong>Componente:</strong> {{ componentName }}</div>
      <div class="info-item">
        <strong>File:</strong>
        <a :href="sourceLink" target="_blank" rel="noopener noreferrer">
          {{ sourceFile }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ContactForm from '@/components/ui/ContactForm.vue'
import VMarkdownEditor from '@/components/ui/VMarkdownEditor.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import PWAStatus from '@/components/ui/PWAStatus.vue'

interface Props {
  component: string
}

const props = defineProps<Props>()

// State
const showCode = ref(false)
const copied = ref(false)
const demoProps = ref({})

// Component mapping
const componentMap = {
  ModernButton,
  ModernCard,
  ContactForm,
  VMarkdownEditor,
  ImageUploader,
  ProjectCard,
  ThemeToggle,
  PWAStatus,
}

// Computed
const componentName = computed(() => props.component)
const demoComponent = computed(() => componentMap[componentName.value])

const sourceFile = computed(() => {
  const fileMap = {
    ModernButton: 'src/components/ui/ModernButton.vue',
    ModernCard: 'src/components/ui/ModernCard.vue',
    ContactForm: 'src/components/ui/ContactForm.vue',
    VMarkdownEditor: 'src/components/ui/VMarkdownEditor.vue',
    ImageUploader: 'src/components/ui/ImageUploader.vue',
    ProjectCard: 'src/components/ui/ProjectCard.vue',
    ThemeToggle: 'src/components/ui/ThemeToggle.vue',
    PWAStatus: 'src/components/ui/PWAStatus.vue',
  }
  return fileMap[componentName.value] || ''
})

const sourceLink = computed(
  () => `https://github.com/alicemandelli/portfolio/blob/main/${sourceFile.value}`,
)

const demoCode = computed(() => {
  const codeMap = {
    ModernButton: `<ModernButton variant="primary" size="lg" @click="handleClick">
  Clicca qui
</ModernButton>`,
    ModernCard: `<ModernCard title="Titolo Card" interactive>
  Contenuto della card
</ModernCard>`,
    ContactForm: '<ContactForm @submit="handleSubmit" />',
    VMarkdownEditor: '<VMarkdownEditor v-model="content" />',
    ImageUploader: '<ImageUploader @images-uploaded="handleUpload" />',
    ProjectCard: `<ProjectCard
  title="Progetto"
  imgSrc="/project.jpg"
  interactive
/>`,
    ThemeToggle: '<ThemeToggle />',
    PWAStatus: '<PWAStatus />',
  }
  return codeMap[componentName.value] || ''
})

// Methods
const toggleCode = () => {
  showCode.value = !showCode.value
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(demoCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Errore nel copiare:', err)
  }
}

const resetDemo = () => {
  demoProps.value = {}
  showCode.value = false
}

const handleDemoEvent = (event: Event) => {
  console.log(`${componentName.value} event:`, event.type)
}

// Lifecycle
onMounted(() => {
  // Inizializza props specifiche per componente
  const propsMap = {
    ModernButton: { variant: 'primary', size: 'lg' },
    ModernCard: { title: 'Demo Card', interactive: true },
    ContactForm: {},
    VMarkdownEditor: { modelValue: '# Demo\n\nContenuto di esempio' },
    ImageUploader: { maxFiles: 3 },
    ProjectCard: {
      title: 'Progetto Demo',
      imgSrc: '/placeholder.jpg',
      interactive: true,
    },
    ThemeToggle: {},
    PWAStatus: {},
  }

  demoProps.value = propsMap[componentName.value] || {}
})
</script>

<style scoped>
.example-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 2rem 0;
  overflow: hidden;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.example-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.example-controls {
  display: flex;
  gap: 0.5rem;
}

.code-toggle,
.reset-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.code-toggle:hover,
.reset-button:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand);
}

.example-demo {
  padding: 2rem;
  background: var(--vp-c-bg);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-frame {
  width: 100%;
  max-width: 600px;
}

.example-code {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  font-weight: 500;
}

.copy-button {
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.copy-button:hover {
  background: var(--vp-c-bg);
}

.example-code pre {
  margin: 0;
  padding: 1rem;
  background: var(--vp-c-bg);
  overflow-x: auto;
}

.example-code code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.example-info {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
}

.info-item {
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .example-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .example-controls {
    justify-content: center;
  }

  .example-demo {
    padding: 1rem;
  }
}
</style>
