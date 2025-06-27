import { ref, onMounted, onUnmounted, readonly } from 'vue'

/**
 * Composable per tracking del progresso di scroll con performance monitoring
 * Implementa intersection observer ottimizzato e supporto per reduced motion
 *
 * @returns Oggetto con stato reattivo e metodi per scroll progress, direzione, visibilità elementi, ecc.
 */
export function useScrollProgress() {
  const scrollProgress = ref(0)
  const isScrolling = ref(false)
  const scrollDirection = ref<'up' | 'down' | null>(null)
  const lastScrollY = ref(0)

  // Performance monitoring
  const scrollEvents = ref(0)
  const lastScrollTime = ref(0)
  const scrollThrottle = 16 // ~60fps

  // Reduced motion support
  const prefersReducedMotion = ref(false)

  // Intersection Observer per elementi
  const observedElements = ref<Set<Element>>(new Set())
  const elementVisibility = ref<Map<Element, boolean>>(new Map())

  // Timeout per debounce
  let scrollTimeout: number | undefined

  /**
   * Calcola il progresso di scroll (0-100)
   */
  const calculateScrollProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  }

  /**
   * Gestisce la direzione di scroll
   */
  const handleScrollDirection = () => {
    const currentScrollY = window.pageYOffset
    scrollDirection.value = currentScrollY > lastScrollY.value ? 'down' : 'up'
    lastScrollY.value = currentScrollY
  }

  /**
   * Throttled scroll handler per performance
   */
  const handleScroll = () => {
    const now = Date.now()

    // Throttle per performance
    if (now - lastScrollTime.value < scrollThrottle) {
      return
    }

    lastScrollTime.value = now
    scrollEvents.value++

    // Rispetta reduced motion
    if (prefersReducedMotion.value) {
      calculateScrollProgress()
      return
    }

    isScrolling.value = true
    calculateScrollProgress()
    handleScrollDirection()

    // Debounce per fermare lo stato di scrolling
    clearTimeout(scrollTimeout)
    scrollTimeout = window.setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  /**
   * Intersection Observer per elementi
   */
  const createIntersectionObserver = () => {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          elementVisibility.value.set(entry.target, entry.isIntersecting)

          // Trigger custom event per animazioni
          if (entry.isIntersecting) {
            entry.target.dispatchEvent(
              new CustomEvent('element-visible', {
                detail: { progress: scrollProgress.value },
              }),
            )
          }
        })
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px 0px -10% 0px',
      },
    )
  }

  /**
   * Osserva un elemento per visibilità
   */
  const observeElement = (element: Element) => {
    if (!observedElements.value.has(element)) {
      observedElements.value.add(element)
      const observer = createIntersectionObserver()
      observer.observe(element)

      // Cleanup observer quando il composable viene distrutto
      onUnmounted(() => {
        observer.unobserve(element)
        observer.disconnect()
      })
    }
  }

  /**
   * Controlla se un elemento è visibile
   */
  const isElementVisible = (element: Element) => {
    return elementVisibility.value.get(element) || false
  }

  /**
   * Scroll to element con smooth behavior
   */
  const scrollToElement = (element: Element, offset = 0) => {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset
    const targetPosition = elementTop - offset

    if (prefersReducedMotion.value) {
      window.scrollTo(0, targetPosition)
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }
  }

  /**
   * Scroll to top
   */
  const scrollToTop = () => {
    if (prefersReducedMotion.value) {
      window.scrollTo(0, 0)
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  /**
   * Performance monitoring
   */
  const getScrollMetrics = () => {
    return {
      progress: scrollProgress.value,
      events: scrollEvents.value,
      direction: scrollDirection.value,
      isScrolling: isScrolling.value,
    }
  }

  onMounted(() => {
    // Check reduced motion preference
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Listen for preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handlePreferenceChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.value = e.matches
    }

    mediaQuery.addEventListener('change', handlePreferenceChange)

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial calculation
    calculateScrollProgress()

    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      mediaQuery.removeEventListener('change', handlePreferenceChange)
      clearTimeout(scrollTimeout)
    })
  })

  return {
    // Reactive state
    scrollProgress: readonly(scrollProgress),
    isScrolling: readonly(isScrolling),
    scrollDirection: readonly(scrollDirection),

    // Methods
    observeElement,
    isElementVisible,
    scrollToElement,
    scrollToTop,
    getScrollMetrics,

    // Computed
    prefersReducedMotion: readonly(prefersReducedMotion),
  }
}
