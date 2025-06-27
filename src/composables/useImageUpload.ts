import { ref, computed } from 'vue'

export interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

/**
 * Composable per gestire l'upload delle immagini
 */
export function useImageUpload() {
  const uploadedImages = ref<UploadedImage[]>([])
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  // Computed
  const totalImages = computed(() => uploadedImages.value.length)
  const successfulUploads = computed(
    () => uploadedImages.value.filter((img) => img.status === 'success').length,
  )
  const failedUploads = computed(
    () => uploadedImages.value.filter((img) => img.status === 'error').length,
  )

  /**
   * Aggiunge immagini alla coda di upload
   */
  const addImages = (files: FileList | File[]) => {
    const fileArray = Array.from(files)

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        console.warn(`File ${file.name} non è un'immagine`)
        return
      }

      const image: UploadedImage = {
        id: generateId(),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading',
      }

      uploadedImages.value.push(image)
    })

    // Simula upload (in un'implementazione reale, qui faresti l'upload al server)
    simulateUpload()
  }

  /**
   * Simula l'upload delle immagini (per demo)
   */
  const simulateUpload = async () => {
    isUploading.value = true
    uploadProgress.value = 0

    const uploadingImages = uploadedImages.value.filter((img) => img.status === 'uploading')

    for (const image of uploadingImages) {
      // Simula progresso
      for (let i = 0; i <= 100; i += 10) {
        image.progress = i
        uploadProgress.value = (uploadingImages.indexOf(image) * 100 + i) / uploadingImages.length
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Simula successo o errore casuale
      if (Math.random() > 0.1) {
        image.status = 'success'
      } else {
        image.status = 'error'
        image.error = "Errore durante l'upload"
      }
    }

    isUploading.value = false
    uploadProgress.value = 100
  }

  /**
   * Rimuove un'immagine dalla lista
   */
  const removeImage = (id: string) => {
    const index = uploadedImages.value.findIndex((img) => img.id === id)
    if (index > -1) {
      const image = uploadedImages.value[index]
      URL.revokeObjectURL(image.url) // Libera la memoria
      uploadedImages.value.splice(index, 1)
    }
  }

  /**
   * Rimuove tutte le immagini
   */
  const clearImages = () => {
    uploadedImages.value.forEach((image) => {
      URL.revokeObjectURL(image.url)
    })
    uploadedImages.value = []
    uploadProgress.value = 0
  }

  /**
   * Genera un ID univoco
   */
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9)
  }

  /**
   * Formatta la dimensione del file
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Valida un file immagine
   */
  const validateImage = (file: File): Promise<{ valid: boolean; error?: string }> => {
    // Controlla il tipo
    if (!file.type.startsWith('image/')) {
      return Promise.resolve({ valid: false, error: "Il file deve essere un'immagine" })
    }

    // Controlla la dimensione (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return Promise.resolve({ valid: false, error: "L'immagine deve essere inferiore a 5MB" })
    }

    // Controlla le dimensioni (opzionale)
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        if (img.width > 4000 || img.height > 4000) {
          resolve({ valid: false, error: "L'immagine deve essere inferiore a 4000x4000px" })
        } else {
          resolve({ valid: true })
        }
      }
      img.onerror = () => {
        resolve({ valid: false, error: "Impossibile caricare l'immagine" })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Ridimensiona un'immagine (per performance)
   */
  const resizeImage = (
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Calcola le nuove dimensioni
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        // Ridimensiona
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        // Converti in blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(resizedFile)
            } else {
              resolve(file)
            }
          },
          file.type,
          0.8,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  return {
    // State
    uploadedImages: computed(() => uploadedImages.value),
    isUploading: computed(() => isUploading.value),
    uploadProgress: computed(() => uploadProgress.value),

    // Computed
    totalImages: computed(() => totalImages.value),
    successfulUploads: computed(() => successfulUploads.value),
    failedUploads: computed(() => failedUploads.value),

    // Methods
    addImages,
    removeImage,
    clearImages,
    formatFileSize,
    validateImage,
    resizeImage,
  }
}
