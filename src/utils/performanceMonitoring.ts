/**
 * Performance Monitoring Utility
 * Tracking Core Web Vitals e metriche performance
 */

// Definizioni dei tipi per le API di performance
interface LayoutShift extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart?: number
  processingEnd?: number
  startTime: number
}

interface PerformanceNavigationTiming extends PerformanceEntry {
  responseStart: number
  requestStart: number
}

// Definizione globale per gtag
declare global {
  function gtag(...args: unknown[]): void
}

interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  inp: number
  ttfb: number
  fcp: number
}

interface PerformanceThresholds {
  lcp: number // 2.5s
  fid: number // 100ms
  cls: number // 0.1
  inp: number // 200ms
  ttfb: number // 800ms
  fcp: number // 1.8s
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    inp: 0,
    ttfb: 0,
    fcp: 0,
  }

  private thresholds: PerformanceThresholds = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    inp: 200,
    ttfb: 800,
    fcp: 1800,
  }

  private observers: PerformanceObserver[] = []
  private isInitialized = false
  private isDevelopment = import.meta.env.DEV

  /**
   * Inizializza il monitoring delle performance
   */
  init() {
    if (this.isInitialized || !('PerformanceObserver' in window)) return

    this.setupObservers()
    this.isInitialized = true

    if (this.isDevelopment) {
      console.info('[PerformanceMonitor] Inizializzato')
    }
  }

  /**
   * Configura gli observer per le metriche
   */
  private setupObservers() {
    // LCP (Largest Contentful Paint)
    this.setupLCPObserver()

    // FID (First Input Delay)
    this.setupFIDObserver()

    // CLS (Cumulative Layout Shift)
    this.setupCLSObserver()

    // INP (Interaction to Next Paint)
    this.setupINPObserver()

    // TTFB (Time to First Byte)
    this.setupTTFBObserver()

    // FCP (First Contentful Paint)
    this.setupFCPObserver()
  }

  private setupLCPObserver() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        this.metrics.lcp = lastEntry.startTime
        this.checkThreshold('lcp', this.metrics.lcp)
      }
    })
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.push(observer)
  }

  private setupFIDObserver() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming
        if (fidEntry.processingStart && fidEntry.startTime) {
          this.metrics.fid = fidEntry.processingStart - fidEntry.startTime
          this.checkThreshold('fid', this.metrics.fid)
        }
      })
    })
    observer.observe({ entryTypes: ['first-input'] })
    this.observers.push(observer)
  }

  private setupCLSObserver() {
    let cls = 0
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const clsEntry = entry as LayoutShift
        if (!clsEntry.hadRecentInput) {
          cls += clsEntry.value
          this.metrics.cls = cls
          this.checkThreshold('cls', this.metrics.cls)
        }
      })
    })
    observer.observe({ entryTypes: ['layout-shift'] })
    this.observers.push(observer)
  }

  private setupINPObserver() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const inpEntry = entry as PerformanceEventTiming
        if (inpEntry.processingEnd && inpEntry.startTime) {
          const inp = inpEntry.processingEnd - inpEntry.startTime
          if (inp > this.metrics.inp) {
            this.metrics.inp = inp
            this.checkThreshold('inp', this.metrics.inp)
          }
        }
      })
    })
    try {
      observer.observe({ entryTypes: ['event'] })
      this.observers.push(observer)
    } catch (e) {
      // INP non supportato in tutti i browser
    }
  }

  private setupTTFBObserver() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart
          this.checkThreshold('ttfb', this.metrics.ttfb)
        }
      })
    })
    observer.observe({ entryTypes: ['navigation'] })
    this.observers.push(observer)
  }

  private setupFCPObserver() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstEntry = entries[0]
      if (firstEntry) {
        this.metrics.fcp = firstEntry.startTime
        this.checkThreshold('fcp', this.metrics.fcp)
      }
    })
    observer.observe({ entryTypes: ['paint'] })
    this.observers.push(observer)
  }

  /**
   * Controlla se una metrica supera la soglia
   */
  private checkThreshold(metric: keyof PerformanceMetrics, value: number) {
    const threshold = this.thresholds[metric]
    const isPoor = value > threshold

    if (this.isDevelopment) {
      const status = isPoor ? '❌' : '✅'
      console.info(`[PerformanceMonitor] ${metric.toUpperCase()}: ${status} ${value.toFixed(2)}ms`)
    }

    if (isPoor) {
      this.reportPoorPerformance(metric, value, threshold)
    }
  }

  /**
   * Report performance scadente
   */
  private reportPoorPerformance(
    metric: keyof PerformanceMetrics,
    value: number,
    threshold: number,
  ) {
    const data = {
      metric,
      value,
      threshold,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }

    if (this.isDevelopment) {
      console.warn('[PerformanceMonitor] Performance scadente:', data)
    } else {
      // In production, invia a analytics
      this.sendToAnalytics(data)
    }
  }

  /**
   * Invia dati ad analytics
   */
  private sendToAnalytics(data: Record<string, unknown>) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_issue', {
        metric: data.metric,
        value: data.value,
        threshold: data.threshold,
      })
    }

    // Custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {
      // Ignora errori di network per analytics
    })
  }

  /**
   * Ottieni le metriche correnti
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Ottieni il report delle performance
   */
  getReport() {
    const report = {
      metrics: this.metrics,
      thresholds: this.thresholds,
      status: {} as Record<keyof PerformanceMetrics, 'good' | 'needs-improvement' | 'poor'>,
    }

    Object.keys(this.metrics).forEach((metric) => {
      const key = metric as keyof PerformanceMetrics
      const value = this.metrics[key]
      const threshold = this.thresholds[key]

      if (value <= threshold * 0.75) {
        report.status[key] = 'good'
      } else if (value <= threshold) {
        report.status[key] = 'needs-improvement'
      } else {
        report.status[key] = 'poor'
      }
    })

    return report
  }

  /**
   * Pulisce le risorse
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
    this.isInitialized = false
  }
}

// Istanza singleton
export const performanceMonitor = new PerformanceMonitor()

/**
 * Composable per il monitoring delle performance
 */
export function usePerformanceMonitoring() {
  const getMetrics = () => performanceMonitor.getMetrics()
  const getReport = () => performanceMonitor.getReport()

  return {
    getMetrics,
    getReport,
  }
}

// Inizializza automaticamente
performanceMonitor.init()
