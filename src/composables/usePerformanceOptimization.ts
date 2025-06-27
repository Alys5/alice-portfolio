import { ref, onMounted, onUnmounted, readonly } from 'vue'

interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  inp: number
  ttfb: number
  fcp: number
}

interface PerformanceObserver {
  observe: (options: any) => void
  disconnect: () => void
}

/**
 * Composable per ottimizzazione performance e monitoraggio Core Web Vitals
 */
export function usePerformanceOptimization() {
  const metrics = ref<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    inp: 0,
    ttfb: 0,
    fcp: 0,
  })

  const isOptimized = ref(false)
  const observers: PerformanceObserver[] = []

  /**
   * Monitora i Core Web Vitals
   */
  const monitorCoreWebVitals = () => {
    if (!('PerformanceObserver' in window)) return

    // LCP (Largest Contentful Paint)
    const lcpObserver = new (window as any).PerformanceObserver((list: any) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        metrics.value.lcp = lastEntry.startTime
        console.log('LCP:', lastEntry.startTime, 'ms')
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    observers.push(lcpObserver)

    // FID (First Input Delay)
    const fidObserver = new (window as any).PerformanceObserver((list: any) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime
          metrics.value.fid = fid
          console.log('FID:', fid, 'ms')
        }
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
    observers.push(fidObserver)

    // CLS (Cumulative Layout Shift)
    const clsObserver = new (window as any).PerformanceObserver((list: any) => {
      let cls = 0
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput && entry.value) {
          cls += entry.value
        }
      })
      metrics.value.cls = cls
      console.log('CLS:', cls)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    observers.push(clsObserver)

    // INP (Interaction to Next Paint)
    const inpObserver = new (window as any).PerformanceObserver((list: any) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.processingStart > 0) {
          const inp = entry.processingEnd - entry.startTime
          metrics.value.inp = Math.max(metrics.value.inp, inp)
          console.log('INP:', inp, 'ms')
        }
      })
    })
    inpObserver.observe({ entryTypes: ['event'] })
    observers.push(inpObserver)

    // FCP (First Contentful Paint)
    const fcpObserver = new (window as any).PerformanceObserver((list: any) => {
      const entries = list.getEntries()
      const firstEntry = entries[0]
      if (firstEntry) {
        metrics.value.fcp = firstEntry.startTime
        console.log('FCP:', firstEntry.startTime, 'ms')
      }
    })
    fcpObserver.observe({ entryTypes: ['first-contentful-paint'] })
    observers.push(fcpObserver)
  }

  /**
   * Ottimizza il caricamento delle immagini
   */
  const optimizeImages = () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      },
    )

    images.forEach((img) => imageObserver.observe(img))
  }

  /**
   * Preload risorse critiche
   */
  const preloadCriticalResources = () => {
    // Preload font critici
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = '/fonts/inter-var.woff2'
    fontLink.as = 'font'
    fontLink.type = 'font/woff2'
    fontLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontLink)

    // Preload immagini critiche
    const criticalImages = ['/images/profile.webp', '/images/hero-bg.webp']

    criticalImages.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    })
  }

  /**
   * Ottimizza il rendering con requestIdleCallback
   */
  const optimizeRendering = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(callback, { timeout: 1000 })
    } else {
      setTimeout(callback, 0)
    }
  }

  /**
   * Debounce per ottimizzare eventi frequenti
   */
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: number
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  /**
   * Throttle per ottimizzare eventi frequenti
   */
  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  }

  /**
   * Ottimizza scroll events
   */
  const optimizeScroll = (callback: (scrollY: number) => void) => {
    const throttledCallback = throttle(callback, 16) // ~60fps
    window.addEventListener(
      'scroll',
      () => {
        throttledCallback(window.scrollY)
      },
      { passive: true },
    )
  }

  /**
   * Ottimizza resize events
   */
  const optimizeResize = (callback: () => void) => {
    const debouncedCallback = debounce(callback, 250)
    window.addEventListener('resize', debouncedCallback, { passive: true })
  }

  /**
   * Valuta se le performance sono ottimali
   */
  const evaluatePerformance = () => {
    const { lcp, fid, cls, inp } = metrics.value

    const isLCPGood = lcp <= 2500
    const isFIDGood = fid <= 100
    const isCLSGood = cls <= 0.1
    const isINPGood = inp <= 200

    isOptimized.value = isLCPGood && isFIDGood && isCLSGood && isINPGood

    return {
      isOptimized: isOptimized.value,
      scores: {
        lcp: isLCPGood ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor',
        fid: isFIDGood ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
        cls: isCLSGood ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor',
        inp: isINPGood ? 'good' : inp <= 500 ? 'needs-improvement' : 'poor',
      },
    }
  }

  /**
   * Ottimizza il bundle con code splitting
   */
  const optimizeBundle = () => {
    // Preload route adiacenti
    const preloadAdjacentRoutes = () => {
      const routes = ['/about', '/portfolio', '/contact']
      routes.forEach((route) => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
      })
    }

    // Preload componenti critici
    const preloadCriticalComponents = () => {
      const components = [
        '/src/components/sections/HeroSection.vue',
        '/src/components/sections/PortfolioSection.vue',
      ]

      components.forEach((component) => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = component
        document.head.appendChild(link)
      })
    }

    optimizeRendering(() => {
      preloadAdjacentRoutes()
      preloadCriticalComponents()
    })
  }

  /**
   * Ottimizza CSS per ridurre CLS
   */
  const optimizeCSS = () => {
    // Inline CSS critico
    const criticalCSS = `
      .hero-section { display: flex; justify-content: center; }
      .hero-title { font-size: clamp(2rem, 5vw, 2.8rem); }
      .profile-img { width: 110px; height: 110px; border-radius: 50%; }
    `

    const style = document.createElement('style')
    style.textContent = criticalCSS
    document.head.appendChild(style)
  }

  // Inizializzazione
  onMounted(() => {
    monitorCoreWebVitals()
    preloadCriticalResources()
    optimizeImages()
    optimizeCSS()
    optimizeBundle()
  })

  // Cleanup
  onUnmounted(() => {
    observers.forEach((observer) => observer.disconnect())
  })

  return {
    metrics: readonly(metrics),
    isOptimized: readonly(isOptimized),
    optimizeRendering,
    debounce,
    throttle,
    optimizeScroll,
    optimizeResize,
    evaluatePerformance,
  }
}
