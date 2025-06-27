import { ref, readonly, onMounted, onUnmounted, watchEffect } from 'vue'

/**
 * Composable per tracciare Core Web Vitals (LCP, CLS, INP) e loggare i dati in console in dev mode
 */
export function usePerformance() {
  const metrics = ref({
    lcp: 0,
    cls: 0,
    inp: 0,
    fid: 0, // opzionale, per completezza
  })

  let lcpObserver: PerformanceObserver | null = null
  let clsObserver: PerformanceObserver | null = null
  let inpObserver: PerformanceObserver | null = null
  let fidObserver: PerformanceObserver | null = null

  onMounted(() => {
    // LCP
    if ('PerformanceObserver' in window) {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          metrics.value.lcp = lastEntry.startTime
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    }

    // CLS
    if ('PerformanceObserver' in window) {
      let cls = 0
      clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // @ts-expect-error: hadRecentInput e value non sono tipizzate su PerformanceEntry standard
          if (!entry.hadRecentInput && entry.value) {
            // @ts-expect-error: value non è tipizzata su PerformanceEntry standard
            cls += entry.value
          }
        })
        metrics.value.cls = cls
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }

    // INP (Interaction to Next Paint)
    if ('PerformanceObserver' in window) {
      inpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // INP: processingEnd - startTime
          // @ts-expect-error: processingEnd non è tipizzata su PerformanceEventTiming
          if (entry.processingEnd && entry.startTime) {
            // @ts-expect-error: processingEnd non è tipizzata su PerformanceEventTiming
            const inp = entry.processingEnd - entry.startTime
            if (inp > metrics.value.inp) {
              metrics.value.inp = inp
            }
          }
        })
      })
      // "event" type for INP (experimental, supported in Chrome)
      try {
        inpObserver.observe({ entryTypes: ['event'] })
      } catch (e) {
        // fallback: non supportato
      }
    }

    // FID (opzionale)
    if ('PerformanceObserver' in window) {
      fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // @ts-expect-error: processingStart non è tipizzata su PerformanceEntry standard
          if (entry.processingStart && entry.startTime) {
            // @ts-expect-error: processingStart non è tipizzata su PerformanceEntry standard
            metrics.value.fid = entry.processingStart - entry.startTime
          }
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    }
  })

  onUnmounted(() => {
    lcpObserver?.disconnect()
    clsObserver?.disconnect()
    inpObserver?.disconnect()
    fidObserver?.disconnect()
  })

  // Log automatico in console in dev mode
  watchEffect(() => {
    if (import.meta.env.DEV) {
      // Log solo se almeno un valore è > 0
      if (metrics.value.lcp || metrics.value.cls || metrics.value.inp) {
        // Arrotonda i valori per leggibilità
        const out = {
          LCP: metrics.value.lcp.toFixed(0) + 'ms',
          CLS: metrics.value.cls.toFixed(3),
          INP: metrics.value.inp.toFixed(0) + 'ms',
          FID: metrics.value.fid.toFixed(0) + 'ms',
        }

        console.info('[Performance]', out)
      }
    }
  })

  return {
    metrics: readonly(metrics),
  }
}
