<template>
  <div class="markdown-editor" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- Toolbar -->
    <div class="editor-toolbar" role="toolbar" aria-label="Strumenti editor markdown">
      <div class="toolbar-group">
        <button
          v-for="tool in toolbarTools"
          :key="tool.action"
          @click="insertMarkdown(tool.action)"
          :title="tool.title"
          :aria-label="tool.title"
          class="toolbar-button"
          type="button"
        >
          <span class="toolbar-icon" v-html="tool.icon"></span>
        </button>
      </div>

      <div class="toolbar-group">
        <button
          @click="toggleFullscreen"
          :title="isFullscreen ? 'Esci dalla modalità schermo intero' : 'Modalità schermo intero'"
          :aria-label="
            isFullscreen ? 'Esci dalla modalità schermo intero' : 'Modalità schermo intero'
          "
          class="toolbar-button"
          type="button"
        >
          <span class="toolbar-icon">
            <svg
              v-if="!isFullscreen"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              />
            </svg>
          </span>
        </button>

        <button
          @click="saveContent"
          :title="'Salva contenuto'"
          :aria-label="'Salva contenuto'"
          class="toolbar-button toolbar-button--save"
          type="button"
          :disabled="!hasChanges"
        >
          <span class="toolbar-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
              />
            </svg>
          </span>
          Salva
        </button>
      </div>
    </div>

    <!-- Editor Container -->
    <div class="editor-container">
      <!-- Editor Area -->
      <div class="editor-area">
        <div class="editor-header">
          <h3 class="editor-title">Editor Markdown</h3>
          <div class="editor-actions">
            <button
              @click="togglePreview"
              :title="showPreview ? 'Nascondi preview' : 'Mostra preview'"
              :aria-label="showPreview ? 'Nascondi preview' : 'Mostra preview'"
              class="preview-toggle"
              type="button"
            >
              <span class="preview-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  />
                </svg>
              </span>
              {{ showPreview ? 'Nascondi' : 'Preview' }}
            </button>
          </div>
        </div>

        <div class="editor-content">
          <textarea
            ref="editorRef"
            v-model="content"
            @input="handleInput"
            @keydown="handleKeydown"
            @paste="handlePaste"
            @drop="handleDrop"
            @dragover.prevent
            class="markdown-textarea"
            :placeholder="placeholder"
            :aria-label="'Editor markdown'"
            :aria-describedby="'editor-help'"
          ></textarea>

          <!-- Upload Area Overlay -->
          <div
            v-show="isDragOver"
            class="upload-overlay"
            @drop="handleDrop"
            @dragover.prevent
            @dragleave="isDragOver = false"
          >
            <div class="upload-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
                />
              </svg>
              <p>Rilascia qui le immagini per caricarle</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Area -->
      <div v-show="showPreview" class="preview-area">
        <div class="preview-header">
          <h3 class="preview-title">Anteprima</h3>
        </div>
        <div class="preview-content">
          <div
            class="markdown-preview"
            v-html="renderedContent"
            :aria-label="'Anteprima del contenuto markdown'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Help Text -->
    <div id="editor-help" class="editor-help sr-only">
      Editor markdown con supporto per upload immagini. Usa la toolbar per inserire elementi di
      formattazione.
    </div>

    <!-- File Input Hidden -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="sr-only"
      @change="handleFileSelect"
    />

    <!-- Status Messages -->
    <div
      v-if="statusMessage"
      class="status-message"
      :class="statusType"
      role="status"
      aria-live="polite"
    >
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import { useLocalStorage, useDebounceFn } from '@vueuse/core'

// Props
interface Props {
  modelValue?: string
  placeholder?: string
  autosave?: boolean
  autosaveDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Scrivi il tuo contenuto in markdown...',
  autosave: true,
  autosaveDelay: 2000,
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: [content: string]
  'image-upload': [files: FileList]
}>()

// Refs
const editorRef = ref<HTMLTextAreaElement>()
const fileInputRef = ref<HTMLInputElement>()
const content = ref(props.modelValue)
const isFullscreen = ref(false)
const showPreview = ref(false)
const isDragOver = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')
const hasChanges = ref(false)

// Local Storage
const savedContent = useLocalStorage('markdown-editor-content', '')

// Debounced save function
const debouncedSave = useDebounceFn(() => {
  if (props.autosave) {
    saveToLocalStorage()
  }
}, props.autosaveDelay)

// Toolbar tools
const toolbarTools = [
  {
    action: 'bold',
    title: 'Grassetto (Ctrl+B)',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 7.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>',
  },
  {
    action: 'italic',
    title: 'Corsivo (Ctrl+I)',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/></svg>',
  },
  {
    action: 'heading',
    title: 'Titolo',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4v3h5v12h3V7h5V4H5z"/></svg>',
  },
  {
    action: 'link',
    title: 'Link',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
  },
  {
    action: 'image',
    title: 'Inserisci immagine',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
  },
  {
    action: 'list',
    title: 'Lista',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>',
  },
  {
    action: 'code',
    title: 'Codice',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>',
  },
  {
    action: 'quote',
    title: 'Citazione',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>',
  },
]

// Computed
const renderedContent = computed(() => {
  try {
    return marked(content.value || '')
  } catch (error) {
    console.error('Errore nel rendering markdown:', error)
    return content.value || ''
  }
})

// Methods
const insertMarkdown = (action: string) => {
  if (!editorRef.value) return

  const textarea = editorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  let replacement = ''

  switch (action) {
    case 'bold':
      replacement = `**${selectedText || 'testo grassetto'}**`
      break
    case 'italic':
      replacement = `*${selectedText || 'testo corsivo'}*`
      break
    case 'heading':
      replacement = `# ${selectedText || 'Titolo'}\n`
      break
    case 'link':
      replacement = `[${selectedText || 'testo del link'}](url)`
      break
    case 'image':
      replacement = `![${selectedText || 'descrizione immagine'}](url-immagine)`
      break
    case 'list':
      replacement = `- ${selectedText || 'elemento lista'}\n`
      break
    case 'code':
      replacement = `\`${selectedText || 'codice'}\``
      break
    case 'quote':
      replacement = `> ${selectedText || 'citazione'}`
      break
  }

  const newContent = content.value.substring(0, start) + replacement + content.value.substring(end)
  content.value = newContent

  // Focus back to editor
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.focus()
      const newCursorPos = start + replacement.length
      editorRef.value.setSelectionRange(newCursorPos, newCursorPos)
    }
  })

  hasChanges.value = true
}

const handleInput = () => {
  emit('update:modelValue', content.value)
  hasChanges.value = true
  debouncedSave()
}

const handleKeydown = (event: KeyboardEvent) => {
  // Shortcuts
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault()
        insertMarkdown('bold')
        break
      case 'i':
        event.preventDefault()
        insertMarkdown('italic')
        break
      case 's':
        event.preventDefault()
        saveContent()
        break
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault()
      const file = item.getAsFile()
      if (file) {
        handleImageUpload([file])
      }
      break
    }
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      handleImageUpload(imageFiles)
    }
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleImageUpload(Array.from(target.files))
  }
}

const handleImageUpload = (files: File[]) => {
  emit('image-upload', files as unknown as FileList)

  // Insert image markdown for each file
  files.forEach((file) => {
    const imageMarkdown = `![${file.name}](/uploads/${file.name})\n`
    content.value += imageMarkdown
  })

  showStatus('Immagini caricate con successo', 'success')
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const saveContent = () => {
  emit('save', content.value)
  saveToLocalStorage()
  hasChanges.value = false
  showStatus('Contenuto salvato', 'success')
}

const saveToLocalStorage = () => {
  savedContent.value = content.value
}

const showStatus = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  statusMessage.value = message
  statusType.value = type

  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

// Lifecycle
onMounted(() => {
  // Load from localStorage if no content
  if (!content.value && savedContent.value) {
    content.value = savedContent.value
  }
})

onUnmounted(() => {
  if (isFullscreen.value) {
    document.body.style.overflow = ''
  }
})

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== content.value) {
      content.value = newValue
    }
  },
)
</script>

<style scoped lang="scss">
.markdown-editor {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  overflow: hidden;
  transition: all var(--duration-md) var(--easing-smooth);

  &.is-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    height: 100vh;
    border-radius: 0;
  }
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-md);
}

.toolbar-group {
  display: flex;
  gap: var(--spacing-xs);
}

.toolbar-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover {
    background: var(--color-primary-light);
    border-color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--save {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }
  }
}

.toolbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);
}

.editor-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.preview-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover {
    background: var(--color-primary-light);
    border-color: var(--color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.preview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-content {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  padding: var(--spacing-lg);
  border: none;
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  line-height: 1.6;
  resize: none;
  overflow-y: auto;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    background: var(--color-surface);
  }
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--color-primary-rgb), 0.1);
  border: 2px dashed var(--color-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.upload-message {
  text-align: center;
  color: var(--color-primary);

  svg {
    margin-bottom: var(--spacing-md);
  }

  p {
    font-size: var(--font-size-lg);
    font-weight: 500;
    margin: 0;
  }
}

.preview-area {
  display: flex;
  flex-direction: column;
  width: 50%;
  border-left: 1px solid var(--color-border);
  background: var(--color-surface);
}

.preview-header {
  padding: var(--spacing-md);
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);
}

.preview-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.markdown-preview {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text);

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    color: var(--color-text);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    font-weight: 600;
  }

  :deep(h1) {
    font-size: var(--font-size-xl);
  }
  :deep(h2) {
    font-size: var(--font-size-lg);
  }
  :deep(h3) {
    font-size: var(--font-size-base);
  }

  :deep(p) {
    margin-bottom: var(--spacing-md);
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);
  }

  :deep(blockquote) {
    border-left: 4px solid var(--color-primary);
    padding-left: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
    font-style: italic;
    color: var(--color-text-muted);
  }

  :deep(code) {
    background: var(--color-surface-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
  }

  :deep(pre) {
    background: var(--color-surface-secondary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: var(--spacing-lg) 0;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(a) {
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color var(--duration-sm) var(--easing-smooth);

    &:hover {
      border-bottom-color: var(--color-primary);
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: var(--spacing-lg) 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: var(--spacing-lg) 0;
  }

  :deep(th),
  :deep(td) {
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    text-align: left;
  }

  :deep(th) {
    background: var(--color-surface-secondary);
    font-weight: 600;
  }
}

.status-message {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  z-index: 1001;
  animation: slideIn var(--duration-md) var(--easing-smooth);

  &.success {
    background: var(--color-success);
    color: white;
  }

  &.error {
    background: var(--color-danger);
    color: white;
  }

  &.info {
    background: var(--color-primary);
    color: white;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
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

// Responsive
@media (max-width: 768px) {
  .markdown-editor {
    height: 500px;
  }

  .editor-toolbar {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .toolbar-group {
    width: 100%;
    justify-content: center;
  }

  .preview-area {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--color-border);
  }

  .editor-container {
    flex-direction: column;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .markdown-editor,
  .toolbar-button,
  .preview-toggle,
  .status-message {
    transition: none;
  }

  .status-message {
    animation: none;
  }
}
</style>
