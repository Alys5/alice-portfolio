<template>
  <div class="image-uploader">
    <!-- Upload Area -->
    <div
      class="upload-area"
      :class="{ 'is-dragover': isDragOver, 'is-uploading': isUploading }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        multiple
        class="file-input"
        @change="handleFileSelect"
      />

      <div class="upload-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" class="upload-icon">
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
          />
        </svg>

        <h3 class="upload-title">Carica immagini</h3>
        <p class="upload-description">Trascina qui le immagini o clicca per selezionarle</p>
        <p class="upload-hint">Supporta: JPG, PNG, GIF, WebP (max 5MB)</p>
      </div>

      <!-- Progress Bar -->
      <div v-if="isUploading" class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <p class="progress-text">{{ Math.round(uploadProgress) }}% completato</p>
      </div>
    </div>

    <!-- Images Grid -->
    <div v-if="uploadedImages.length > 0" class="images-grid">
      <div
        v-for="image in uploadedImages"
        :key="image.id"
        class="image-item"
        :class="{ 'is-error': image.status === 'error' }"
      >
        <div class="image-preview">
          <img :src="image.url" :alt="image.name" class="image-thumbnail" />

          <!-- Status Overlay -->
          <div class="image-overlay">
            <div v-if="image.status === 'uploading'" class="image-status">
              <div class="spinner"></div>
              <span>Caricamento...</span>
            </div>

            <div v-else-if="image.status === 'error'" class="image-status image-status--error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              <span>Errore</span>
            </div>

            <div v-else-if="image.status === 'success'" class="image-status image-status--success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>Completato</span>
            </div>
          </div>

          <!-- Remove Button -->
          <button
            @click.stop="removeImage(image.id)"
            class="image-remove"
            type="button"
            :aria-label="`Rimuovi ${image.name}`"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>

        <div class="image-info">
          <p class="image-name" :title="image.name">{{ image.name }}</p>
          <p class="image-size">{{ formatFileSize(image.size) }}</p>
          <p v-if="image.error" class="image-error">{{ image.error }}</p>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="uploadedImages.length > 0" class="upload-summary">
      <div class="summary-stats">
        <span class="stat">
          <strong>{{ totalImages }}</strong> immagini
        </span>
        <span class="stat stat--success">
          <strong>{{ successfulUploads }}</strong> completate
        </span>
        <span v-if="failedUploads > 0" class="stat stat--error">
          <strong>{{ failedUploads }}</strong> fallite
        </span>
      </div>

      <button @click="clearImages" class="clear-button" type="button" :disabled="isUploading">
        Rimuovi tutte
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useImageUpload, type UploadedImage } from '@/composables/useImageUpload'

// Props
interface Props {
  maxFiles?: number
  maxFileSize?: number
  acceptedTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
})

// Emits
const emit = defineEmits<{
  'images-uploaded': [images: UploadedImage[]]
  'upload-error': [error: string]
}>()

// Refs
const fileInputRef = ref<HTMLInputElement>()
const isDragOver = ref(false)

// Composable
const {
  uploadedImages,
  isUploading,
  uploadProgress,
  totalImages,
  successfulUploads,
  failedUploads,
  addImages,
  removeImage,
  clearImages,
  formatFileSize,
} = useImageUpload()

// Methods
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFiles = (files: File[]) => {
  // Controlla il numero massimo di file
  if (uploadedImages.value.length + files.length > props.maxFiles) {
    emit('upload-error', `Puoi caricare al massimo ${props.maxFiles} immagini`)
    return
  }

  // Filtra solo le immagini
  const imageFiles = files.filter(
    (file) => file.type.startsWith('image/') && props.acceptedTypes.includes(file.type),
  )

  if (imageFiles.length === 0) {
    emit('upload-error', 'Nessuna immagine valida trovata')
    return
  }

  // Controlla la dimensione dei file
  const oversizedFiles = imageFiles.filter((file) => file.size > props.maxFileSize)
  if (oversizedFiles.length > 0) {
    emit(
      'upload-error',
      `Alcuni file sono troppo grandi (max ${formatFileSize(props.maxFileSize)})`,
    )
    return
  }

  // Aggiungi le immagini
  addImages(imageFiles)
  emit('images-uploaded', uploadedImages.value)
}

const handleRemoveImage = (id: string) => {
  removeImage(id)
  emit('images-uploaded', uploadedImages.value)
}

const handleClearImages = () => {
  clearImages()
  emit('images-uploaded', [])
}

// Lifecycle
onMounted(() => {
  // Reset file input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
})

onUnmounted(() => {
  // Cleanup
  clearImages()
})
</script>

<style scoped lang="scss">
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.upload-area {
  position: relative;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xxl);
  text-align: center;
  cursor: pointer;
  transition: all var(--duration-md) var(--easing-smooth);
  background: var(--color-surface);

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  &.is-dragover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
    transform: scale(1.02);
  }

  &.is-uploading {
    pointer-events: none;
    opacity: 0.8;
  }
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.upload-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.upload-description {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.upload-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.upload-progress {
  position: absolute;
  bottom: var(--spacing-lg);
  left: var(--spacing-lg);
  right: var(--spacing-lg);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--duration-sm) var(--easing-smooth);
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.image-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover {
    box-shadow: var(--shadow-md);
  }

  &.is-error {
    border-color: var(--color-danger);
  }
}

.image-preview {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-sm) var(--easing-smooth);
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 500;

  &--success {
    color: var(--color-success);
  }

  &--error {
    color: var(--color-danger);
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.image-remove {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover {
    background: var(--color-danger);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.image-item:hover .image-remove {
  opacity: 1;
}

.image-info {
  padding: var(--spacing-sm);
}

.image-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-size {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.image-error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  margin: var(--spacing-xs) 0 0;
}

.upload-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-surface-secondary);
  border-radius: var(--radius-md);
}

.summary-stats {
  display: flex;
  gap: var(--spacing-lg);
}

.stat {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);

  &--success {
    color: var(--color-success);
  }

  &--error {
    color: var(--color-danger);
  }
}

.clear-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover:not(:disabled) {
    border-color: var(--color-danger);
    color: var(--color-danger);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

// Responsive
@media (max-width: 768px) {
  .upload-area {
    padding: var(--spacing-lg);
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .upload-summary {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .summary-stats {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .upload-area,
  .image-item,
  .image-overlay,
  .image-remove,
  .clear-button,
  .progress-fill {
    transition: none;
  }

  .spinner {
    animation: none;
  }
}
</style>
