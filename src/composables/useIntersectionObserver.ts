import { ref, onUnmounted } from 'vue'

/**
 * @component
 * @name useIntersectionObserver
 * @desc Composable per Intersection Observer con performance ottimizzate per lazy loading e animazioni scroll-triggered
 * @example
 * const { observe, unobserve } = useIntersectionObserver(
 *   (entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         // Elemento visibile
 *         entry.target.classList.add('animate-in')
 *       }
 *     })
 *   },
 *   { threshold: 0.2 }
 * )
 *
 * // Osserva elemento
 * observe(elementRef.value)
 * @example
 * // Lazy loading immagini
 * const { observe } = useIntersectionObserver(
 *   (entries) => {
 *     entries.forEach(entry => {
 *       if (entry.isIntersecting) {
 *         const img = entry.target as HTMLImageElement
 *         img.src = img.dataset.src || ''
 *         img.classList.remove('lazy')
 *       }
 *     })
 *   },
 *   { rootMargin: '50px' }
 * )
 */
export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {},
) {
  const isSupported = 'IntersectionObserver' in window
  const observer = ref<IntersectionObserver | null>(null)

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  }

  if (isSupported) {
    observer.value = new IntersectionObserver(callback, defaultOptions)
  }

  const observe = (element: Element) => {
    if (observer.value && element) {
      observer.value.observe(element)
    }
  }

  const unobserve = (element: Element) => {
    if (observer.value && element) {
      observer.value.unobserve(element)
    }
  }

  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect()
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    isSupported,
    observe,
    unobserve,
    disconnect,
  }
}
