<template>
  <div class="blog-editor-page">
    <div class="container">
      <!-- Error Banner -->
      <div v-if="showError" class="error-banner" role="alert" aria-live="assertive">
        <div class="error-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="error-icon">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
          <span class="error-message">{{ errorMessage }}</span>
          <button
            @click="showError = false"
            class="error-close"
            type="button"
            aria-label="Chiudi messaggio di errore"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Header -->
      <header class="editor-header">
        <h1 class="editor-title">Editor Post Blog</h1>
        <p class="editor-description">
          Crea e modifica i tuoi post del blog con l'editor markdown avanzato
        </p>
      </header>

      <!-- Editor Form -->
      <div class="editor-form">
        <!-- Post Metadata -->
        <div class="form-section">
          <h2 class="section-title">Metadati Post</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="post-title" class="form-label">Titolo *</label>
              <input
                id="post-title"
                v-model="postData.title"
                type="text"
                class="form-input"
                placeholder="Inserisci il titolo del post"
                required
              />
            </div>

            <div class="form-group">
              <label for="post-description" class="form-label">Descrizione *</label>
              <textarea
                id="post-description"
                v-model="postData.description"
                class="form-textarea"
                placeholder="Breve descrizione del post"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="post-date" class="form-label">Data *</label>
              <input
                id="post-date"
                v-model="postData.date"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="post-author" class="form-label">Autore *</label>
              <input
                id="post-author"
                v-model="postData.author"
                type="text"
                class="form-input"
                placeholder="Nome dell'autore"
                required
              />
            </div>

            <div class="form-group">
              <label for="post-image" class="form-label">Immagine di copertina</label>
              <input
                id="post-image"
                v-model="postData.image"
                type="text"
                class="form-input"
                placeholder="/images/blog/nome-immagine.jpg"
              />
            </div>

            <div class="form-group">
              <label for="post-tags" class="form-label">Tag</label>
              <input
                id="post-tags"
                v-model="tagsInput"
                type="text"
                class="form-input"
                placeholder="tag1, tag2, tag3"
                @input="updateTags"
              />
              <div class="tags-display">
                <span v-for="tag in postData.tags" :key="tag" class="tag-item">
                  {{ tag }}
                  <button
                    @click="removeTag(tag)"
                    class="tag-remove"
                    type="button"
                    :aria-label="`Rimuovi tag ${tag}`"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Markdown Editor -->
        <div class="form-section">
          <h2 class="section-title">Contenuto Post</h2>
          <VMarkdownEditor
            v-model="postData.content"
            placeholder="Scrivi il contenuto del tuo post in markdown..."
            :autosave="true"
            :autosave-delay="3000"
            @save="handleSave"
            @image-upload="handleImageUpload"
          />
        </div>

        <!-- Image Uploader -->
        <div class="form-section">
          <h2 class="section-title">Immagini del Post</h2>
          <ImageUploader
            :max-files="10"
            :max-file-size="5 * 1024 * 1024"
            @images-uploaded="handleImagesUploaded"
            @upload-error="handleUploadError"
          />
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button @click="previewPost" class="action-button action-button--secondary" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              />
            </svg>
            Anteprima
          </button>

          <button
            @click="savePost"
            class="action-button action-button--primary"
            type="button"
            :disabled="!isFormValid"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
              />
            </svg>
            Salva Post
          </button>
        </div>
      </div>

      <!-- Preview Modal -->
      <div v-if="showPreview" class="preview-modal" @click="closePreview">
        <div class="preview-content" @click.stop>
          <div class="preview-header">
            <h2>Anteprima Post</h2>
            <button
              @click="closePreview"
              class="preview-close"
              type="button"
              aria-label="Chiudi anteprima"
            >
              ×
            </button>
          </div>
          <div class="preview-body">
            <article class="preview-post">
              <header class="preview-post-header">
                <h1>{{ postData.title }}</h1>
                <p class="preview-post-meta">
                  {{ formatDate(postData.date) }} • {{ postData.author }}
                </p>
                <p class="preview-post-description">{{ postData.description }}</p>
                <div class="preview-post-tags">
                  <span v-for="tag in postData.tags" :key="tag" class="preview-tag">
                    {{ tag }}
                  </span>
                </div>
              </header>
              <div class="preview-post-content" v-html="renderedContent"></div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import VMarkdownEditor from '@/components/ui/VMarkdownEditor.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import type { UploadedImage } from '@/composables/useImageUpload'
import { useMeta } from '@/composables/useMeta'

// Component name
defineOptions({
  name: 'BlogEditorPage',
})

// Types
interface PostData {
  title: string
  description: string
  date: string
  author: string
  image: string
  tags: string[]
  content: string
}

// State
const postData = ref<PostData>({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  author: 'Alice Mandelli',
  image: '',
  tags: [],
  content: '',
})

const tagsInput = ref('')
const showPreview = ref(false)

// State per gestione errori
const errorMessage = ref('')
const showError = ref(false)

// Importo il composable per i meta tag SEO
const { setPageMeta } = useMeta()

// Computed
const isFormValid = computed(() => {
  return (
    postData.value.title.trim() &&
    postData.value.description.trim() &&
    postData.value.date &&
    postData.value.author.trim() &&
    postData.value.content.trim()
  )
})

const renderedContent = computed(() => {
  try {
    return marked(postData.value.content || '')
  } catch (error) {
    console.error('Errore nel rendering markdown:', error)
    return '<p class="error-message">Errore nel rendering del contenuto</p>'
  }
})

// Watch per gestire errori di rendering
watch(renderedContent, (newContent) => {
  if (typeof newContent === 'string' && newContent.includes('error-message')) {
    showError.value = true
    errorMessage.value = 'Errore nel rendering del contenuto markdown'
  }
})

// Methods
const updateTags = () => {
  const tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
  postData.value.tags = tags
}

const removeTag = (tagToRemove: string) => {
  postData.value.tags = postData.value.tags.filter((tag) => tag !== tagToRemove)
  tagsInput.value = postData.value.tags.join(', ')
}

const handleSave = (content: string) => {
  console.log('Contenuto salvato:', content)
  // Qui potresti implementare la logica di salvataggio
}

const handleImageUpload = (files: FileList) => {
  console.log('Immagini caricate:', files)
  // Qui potresti implementare la logica di upload
  // Per ora simuliamo un upload locale
  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log('Immagine caricata:', e.target?.result)
    }
    reader.readAsDataURL(file)
  })
}

const handleImagesUploaded = (images: UploadedImage[]) => {
  console.log('Immagini caricate:', images)
  // Qui potresti implementare la logica di gestione delle immagini caricate
  // Ad esempio, aggiungere i link delle immagini al contenuto markdown
  images.forEach((image) => {
    if (image.status === 'success') {
      const imageMarkdown = `![${image.name}](/uploads/${image.name})\n`
      postData.value.content += imageMarkdown
    }
  })
}

const handleUploadError = (error: string) => {
  handleError(new Error(error), 'upload immagini')
}

// Funzione per gestire errori generici
const handleError = (error: Error, context: string) => {
  console.error(`Errore in ${context}:`, error)
  showError.value = true
  errorMessage.value = `Errore: ${error.message}`

  // Nascondi errore dopo 5 secondi
  setTimeout(() => {
    showError.value = false
    errorMessage.value = ''
  }, 5000)
}

const savePost = () => {
  if (!isFormValid.value) return

  // Genera il frontmatter
  const frontmatter = `---
title: '${postData.value.title}'
description: '${postData.value.description}'
date: '${postData.value.date}'
author: '${postData.value.author}'
tags: [${postData.value.tags.map((tag) => `'${tag}'`).join(', ')}]
${postData.value.image ? `image: '${postData.value.image}'` : ''}
---

`

  // Combina frontmatter e contenuto
  const fullContent = frontmatter + postData.value.content

  // Crea il file per il download
  const blob = new Blob([fullContent], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${postData.value.title.toLowerCase().replace(/\s+/g, '-')}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  console.log('Post salvato:', fullContent)
}

const previewPost = () => {
  if (!isFormValid.value) return
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Lifecycle
onMounted(() => {
  // Carica dati di esempio se non ci sono dati salvati
  if (!postData.value.content) {
    postData.value.content = `# Benvenuto nel tuo nuovo post! 👋

Scrivi qui il contenuto del tuo post utilizzando la sintassi markdown.

## Esempi di formattazione

### Testo in grassetto e corsivo
Questo è un testo in **grassetto** e questo è in *corsivo*.

### Liste
- Elemento 1
- Elemento 2
- Elemento 3

### Codice
\`\`\`javascript
console.log('Hello World!')
\`\`\`

### Citazioni
> Questa è una citazione interessante.

### Link e immagini
[Link di esempio](https://example.com)

![Descrizione immagine](/path/to/image.jpg)

---

*Buon lavoro!*`
  }

  // Imposto i meta tag per la pagina editor del blog
  setPageMeta({
    title: 'Editor Blog | Alice Mandelli - UI Developer & AI Strategist',
    description:
      'Editor per la creazione e modifica di post del blog. Strumento per la gestione dei contenuti del portfolio.',
    keywords: 'Editor Blog, CMS, Content Management, Alice Mandelli, Blog Management',
    robots: 'noindex, nofollow', // Non indicizzare la pagina editor
    ogTitle: 'Editor Blog - Alice Mandelli',
    ogDescription: 'Editor per la creazione e modifica di post del blog.',
    twitterTitle: 'Editor Blog - Alice Mandelli',
    twitterDescription: 'Editor per la creazione e modifica di post del blog.',
  })
})
</script>

<style scoped lang="scss">
.blog-editor-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background: var(--color-surface);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.editor-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.editor-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.editor-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.editor-form {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.form-section {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.form-input,
.form-textarea {
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-base);
  transition: border-color var(--duration-sm) var(--easing-smooth);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  &::placeholder {
    color: var(--color-text-muted);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.tag-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: bold;
  border-radius: 50%;
  transition: background-color var(--duration-sm) var(--easing-smooth);

  &:hover {
    background: var(--color-primary);
    color: white;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-surface-secondary);
  border-top: 1px solid var(--color-border);
}

.action-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--primary {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }
  }

  &--secondary {
    background: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);

    &:hover:not(:disabled) {
      background: var(--color-surface-secondary);
    }
  }
}

// Preview Modal
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.preview-content {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);

  h2 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }
}

.preview-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: var(--font-size-lg);
  font-weight: bold;
  border-radius: var(--radius-sm);
  transition: background-color var(--duration-sm) var(--easing-smooth);

  &:hover {
    background: var(--color-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.preview-body {
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

.preview-post {
  padding: var(--spacing-xl);
}

.preview-post-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }
}

.preview-post-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.preview-post-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.preview-post-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.preview-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.preview-post-content {
  font-size: var(--font-size-base);
  line-height: 1.8;
  color: var(--color-text);

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    color: var(--color-text);
    margin-top: var(--spacing-xl);
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
}

// Responsive
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }

  .preview-modal {
    padding: var(--spacing-sm);
  }

  .preview-content {
    max-height: 95vh;
  }

  .preview-body {
    max-height: calc(95vh - 80px);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .form-input,
  .form-textarea,
  .action-button,
  .tag-remove,
  .preview-close {
    transition: none;
  }
}

// Error Banner
.error-banner {
  position: sticky;
  top: 0;
  z-index: var(--z-toast);
  background: var(--color-error);
  color: white;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-medium);
  animation: slideDown var(--duration-md) var(--easing-smooth);
}

.error-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  max-width: 100%;
}

.error-icon {
  flex-shrink: 0;
  color: white;
}

.error-message {
  flex: 1;
  font-weight: 500;
}

.error-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: var(--font-size-lg);
  font-weight: bold;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: background-color var(--duration-sm) var(--easing-smooth);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
