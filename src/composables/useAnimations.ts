import { ref, onMounted, onUnmounted, readonly, type Ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Types
export interface AnimationOptions {
  duration?: number
  delay?: number
  ease?: string
  once?: boolean
  trigger?: Element | string | null
  start?: string
  end?: string
  stagger?: number
}

export interface MagneticOptions {
  strength?: number
  distance?: number
  smoothness?: number
}

export interface RippleOptions {
  color?: string
  duration?: number
  scale?: number
}

export interface ParallaxOptions {
  speed?: number
  direction?: 'vertical' | 'horizontal'
  easing?: string
}

// Global animation state
let globalDurationMultiplier = 1
let animationsPaused = false

// Global state

// Utility functions
export function checkReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function setGlobalDuration(multiplier: number) {
  globalDurationMultiplier = multiplier
}

export function pauseAllAnimations() {
  animationsPaused = true
}

export function resumeAllAnimations() {
  animationsPaused = false
}

// Helper functions
function getOpts(opts?: AnimationOptions) {
  const reducedMotion = checkReducedMotion()
  return {
    duration: reducedMotion ? 0.1 : (opts?.duration || 0.6),
    delay: reducedMotion ? 0 : (opts?.delay || 0),
    ease: opts?.ease || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    once: opts?.once ?? true,
    trigger: opts?.trigger || null,
    start: opts?.start || 'top 80%',
    end: opts?.end || 'bottom 20%',
    stagger: opts?.stagger || 0.1
  }
}

function setWillChange(el: Element, props: string[]) {
  if (!checkReducedMotion()) {
    const elementEl = el as HTMLElement
    elementEl.style.setProperty('will-change', props.join(', '))
    setTimeout(() => {
      elementEl.style.removeProperty('will-change')
    }, 1000)
  }
}

// =========================
// SCROLL ANIMATIONS SYSTEM
// =========================

export function useScrollAnimations() {
  const observedElements = ref<Set<Element>>(new Set())
  const observers = ref<Map<Element, IntersectionObserver>>(new Map())

  const observeElement = (element: Element, animationClass: string, options?: AnimationOptions) => {
    if (checkReducedMotion()) {
      element.classList.add(animationClass)
      return null
    }

  const opts = getOpts(options)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !observedElements.value.has(entry.target)) {
            // Add delay if specified
            setTimeout(() => {
              entry.target.classList.add(animationClass)
              observedElements.value.add(entry.target)

              // Remove observer if once is true
              if (opts.once) {
                observer.unobserve(entry.target)
                observers.value.delete(entry.target)
              }
            }, opts.delay * 1000)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(element)
    observers.value.set(element, observer)
    return observer
  }

  const unobserveElement = (element: Element) => {
    const observer = observers.value.get(element)
    if (observer) {
      observer.unobserve(element)
      observers.value.delete(element)
      observedElements.value.delete(element)
    }
  }

  const clearAllObservers = () => {
    observers.value.forEach(observer => observer.disconnect())
    observers.value.clear()
    observedElements.value.clear()
  }

  onUnmounted(() => {
    clearAllObservers()
  })

  return {
    observeElement,
    unobserveElement,
    clearAllObservers,
    observedElements: readonly(observedElements)
  }
}

// =========================
// MAGNETIC EFFECT SYSTEM
// =========================

export function useMagneticEffect() {
  const magneticElements = ref<Map<HTMLElement, { strength: number; distance: number }>>(new Map())

  const handleMouseMove = (e: MouseEvent, element: HTMLElement, options?: MagneticOptions) => {
    if (checkReducedMotion() || animationsPaused) return

    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const strength = options?.strength || 0.15
    const distance = options?.distance || 50

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    // Limit movement distance
    const limitedDeltaX = Math.max(-distance, Math.min(distance, deltaX))
    const limitedDeltaY = Math.max(-distance, Math.min(distance, deltaY))

    element.style.setProperty('--mouse-x', `${limitedDeltaX}px`)
    element.style.setProperty('--mouse-y', `${limitedDeltaY}px`)
  }

  const resetPosition = (element: HTMLElement) => {
    element.style.setProperty('--mouse-x', '0px')
    element.style.setProperty('--mouse-y', '0px')
  }

  const addMagneticElement = (element: HTMLElement, options?: MagneticOptions) => {
    const strength = options?.strength || 0.15
    const distance = options?.distance || 50

    magneticElements.value.set(element, { strength, distance })

    const handleMove = (e: MouseEvent) => handleMouseMove(e, element, options)
    const handleLeave = () => resetPosition(element)

    element.addEventListener('mousemove', handleMove)
    element.addEventListener('mouseleave', handleLeave)

    // Store event listeners for cleanup
    element.setAttribute('data-magnetic', 'true')
    element.setAttribute('data-magnetic-move', handleMove.toString())
    element.setAttribute('data-magnetic-leave', handleLeave.toString())
  }

  const removeMagneticElement = (element: HTMLElement) => {
    magneticElements.value.delete(element)
    resetPosition(element)

    // Remove event listeners
    element.removeAttribute('data-magnetic')
    element.removeAttribute('data-magnetic-move')
    element.removeAttribute('data-magnetic-leave')
  }

  return {
    handleMouseMove,
    resetPosition,
    addMagneticElement,
    removeMagneticElement,
    magneticElements: readonly(magneticElements)
  }
}

// =========================
// PARALLAX SCROLL SYSTEM
// =========================

export function useParallaxScroll() {
  const parallaxElements = ref<{ element: HTMLElement; options: ParallaxOptions }[]>([])
  let scrollHandler: (() => void) | null = null

  const handleScroll = () => {
    if (checkReducedMotion() || animationsPaused) return

    const scrollY = window.scrollY
    const scrollX = window.scrollX

    parallaxElements.value.forEach(({ element, options }) => {
      const speed = options.speed || 0.5
      const direction = options.direction || 'vertical'

      if (direction === 'vertical') {
        const yPos = -(scrollY * speed)
        element.style.transform = `translateY(${yPos}px)`
      } else {
        const xPos = -(scrollX * speed)
        element.style.transform = `translateX(${xPos}px)`
      }
    })
  }

  const addParallaxElement = (element: HTMLElement, options?: ParallaxOptions) => {
    parallaxElements.value.push({ element, options: options || {} })

    // Initialize scroll handler if not already set
    if (!scrollHandler) {
      scrollHandler = handleScroll
      window.addEventListener('scroll', scrollHandler, { passive: true })
    }
  }

  const removeParallaxElement = (element: HTMLElement) => {
    const index = parallaxElements.value.findIndex(item => item.element === element)
    if (index > -1) {
      parallaxElements.value.splice(index, 1)
      element.style.transform = ''
    }

    // Remove scroll handler if no more elements
    if (parallaxElements.value.length === 0 && scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
      scrollHandler = null
    }
  }

  onUnmounted(() => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
  })

  return {
    addParallaxElement,
    removeParallaxElement,
    parallaxElements: readonly(parallaxElements)
  }
}

// =========================
// GRADIENT ANIMATIONS SYSTEM
// =========================

export function useGradientAnimations() {
  const gradientElements = ref<Set<HTMLElement>>(new Set())

  const createGradientAnimation = (element: HTMLElement, type: 'flow' | 'pulse' | 'rotate' = 'flow') => {
    if (checkReducedMotion()) return

    const baseClass = `gradient-${type}`
    element.classList.add(baseClass)
    gradientElements.value.add(element)

    // Add CSS custom properties for animation control
    element.style.setProperty('--gradient-animation-duration', '15s')
    element.style.setProperty('--gradient-animation-easing', 'ease-in-out')
  }

  const removeGradientAnimation = (element: HTMLElement) => {
    element.classList.remove('gradient-flow', 'gradient-pulse', 'gradient-rotate')
    gradientElements.value.delete(element)
  }

  const setGradientColors = (element: HTMLElement, colors: string[]) => {
    const gradientString = `linear-gradient(270deg, ${colors.join(', ')})`
    element.style.setProperty('--gradient-colors', gradientString)
  }

  return {
    createGradientAnimation,
    removeGradientAnimation,
    setGradientColors,
    gradientElements: readonly(gradientElements)
  }
}

// =========================
// EXISTING ANIMATION FUNCTIONS (UPDATED)
// =========================

export async function fluidFadeIn(element: Element, options?: AnimationOptions): Promise<void> {
  if (checkReducedMotion() || animationsPaused) {
    element.classList.add('animate-fluid-fade')
    return
  }

  const opts = getOpts(options)
  setWillChange(element, ['opacity', 'transform'])

  const elementEl = element as HTMLElement
  elementEl.style.opacity = '0'
  elementEl.style.transform = 'translateY(30px)'

  await new Promise(resolve => setTimeout(resolve, opts.delay * 1000))

  elementEl.style.transition = `all ${opts.duration * globalDurationMultiplier}s ${opts.ease}`
  elementEl.style.opacity = '1'
  elementEl.style.transform = 'translateY(0)'

  setTimeout(() => {
    elementEl.style.removeProperty('transition')
    elementEl.style.removeProperty('opacity')
    elementEl.style.removeProperty('transform')
  }, opts.duration * 1000 * globalDurationMultiplier)
}

export async function morphingHover(element: Element, options?: AnimationOptions): Promise<void> {
  if (checkReducedMotion()) return

  const opts = getOpts(options)
  setWillChange(element, ['transform', 'border-radius'])

  const elementEl = element as HTMLElement
  elementEl.style.transition = `all ${opts.duration * globalDurationMultiplier}s ${opts.ease}`
  elementEl.style.transform = 'scale(1.05) rotate(1deg)'
  elementEl.style.borderRadius = '20px'

  setTimeout(() => {
    elementEl.style.transform = 'scale(1) rotate(0deg)'
    elementEl.style.borderRadius = ''
  }, opts.duration * 1000 * globalDurationMultiplier)
}

export async function magneticHover(element: HTMLElement, strength = 0.18): Promise<void> {
  if (checkReducedMotion()) return

  const { addMagneticElement } = useMagneticEffect()
  addMagneticElement(element, { strength })
}

export function createRippleEffect(event: MouseEvent, options?: RippleOptions): void {
  if (checkReducedMotion()) return

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: ${options?.color || 'rgba(255, 255, 255, 0.3)'};
    border-radius: 50%;
    transform: scale(0);
    animation: ripple ${options?.duration || 0.6}s linear;
    pointer-events: none;
  `

  target.style.position = 'relative'
  target.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, (options?.duration || 0.6) * 1000)
}

export function liquidLoading(element: Element, options?: AnimationOptions): void {
  if (checkReducedMotion()) return

  const opts = getOpts(options)
  const elementEl = element as HTMLElement
  elementEl.classList.add('animate-liquid-loading')
  elementEl.style.setProperty('--loading-duration', `${opts.duration * globalDurationMultiplier}s`)
}

export function kineticText(element: Element, options?: AnimationOptions): Promise<void> {
  if (checkReducedMotion()) return Promise.resolve()

  const opts = getOpts(options)
  const elementEl = element as HTMLElement
  const text = elementEl.textContent || ''
  const chars = text.split('')

  elementEl.innerHTML = chars.map(char => `<span class="char">${char}</span>`).join('')

  const charElements = elementEl.querySelectorAll('.char')
  charElements.forEach((char, index) => {
    const charEl = char as HTMLElement
    charEl.style.animationDelay = `${index * 50}ms`
    charEl.classList.add('animate-kinetic')
  })

  return new Promise(resolve => {
    setTimeout(resolve, chars.length * 50 + opts.duration * 1000)
  })
}

export function gradientShift(element: Element, options?: AnimationOptions): void {
  if (checkReducedMotion()) return

  const opts = getOpts(options)
  const elementEl = element as HTMLElement
  elementEl.classList.add('animate-gradient-shift')
  elementEl.style.setProperty('--gradient-duration', `${opts.duration * globalDurationMultiplier}s`)
}

export function floatingElements(element: Element, options?: AnimationOptions): void {
  if (checkReducedMotion()) return

  const opts = getOpts(options)
  const elementEl = element as HTMLElement
  elementEl.classList.add('animate-floating')
  elementEl.style.setProperty('--float-duration', `${opts.duration * globalDurationMultiplier}s`)
}

export async function staggerIn(elements: Element[] | NodeListOf<Element>, options?: AnimationOptions): Promise<void> {
  if (checkReducedMotion()) {
    elements.forEach(el => el.classList.add('animate-fluid-fade'))
    return
  }

  const opts = getOpts(options)
  const elementArray = Array.from(elements)

  for (let i = 0; i < elementArray.length; i++) {
    const element = elementArray[i]
    const delay = opts.delay + (i * opts.stagger)

    setTimeout(() => {
      fluidFadeIn(element, { ...opts, delay: 0 })
    }, delay * 1000)
  }

  const totalDuration = opts.delay + (elementArray.length * opts.stagger) + opts.duration
  await new Promise(resolve => setTimeout(resolve, totalDuration * 1000))
}

// =========================
// INTERSECTION OBSERVER COMPOSABLE
// =========================

export function useIntersectionObserver(
  target: Ref<Element | null>,
  options: IntersectionObserverInit = {}
) {
  const isIntersecting = ref(false)
  const intersectionRatio = ref(0)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (target.value && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting.value = entry.isIntersecting
        intersectionRatio.value = entry.intersectionRatio
      }, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px',
        ...options
      })

      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isIntersecting: readonly(isIntersecting),
    intersectionRatio: readonly(intersectionRatio)
  }
}

// =========================
// SCROLL ANIMATION COMPOSABLE
// =========================

export function useScrollAnimation(threshold = 0.2) {
  const target = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const hasAnimated = ref(false)

  let observer: IntersectionObserver | null = null

  const startAnimation = () => {
    if (!target.value || hasAnimated.value) return

    hasAnimated.value = true
    target.value.classList.add('animate-fluid-fade')
  }

  onMounted(() => {
    if (target.value && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible.value = entry.isIntersecting
          if (entry.isIntersecting && !hasAnimated.value) {
            startAnimation()
          }
        },
        { threshold }
      )

      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    target,
    isVisible: readonly(isVisible),
    hasAnimated: readonly(hasAnimated),
    startAnimation
  }
}

// =========================
// PERFORMANCE MONITORING
// =========================

export function useAnimationPerformance() {
  const fps = ref(60)
  const frameTime = ref(16.67)

  let frameCount = 0
  let lastTime = performance.now()

  function measureFPS(currentTime: number) {
    frameCount++

    if (currentTime - lastTime >= 1000) {
      fps.value = Math.round((frameCount * 1000) / (currentTime - lastTime))
      frameTime.value = 1000 / fps.value

      frameCount = 0
      lastTime = currentTime
    }

    requestAnimationFrame(measureFPS)
  }

  onMounted(() => {
    requestAnimationFrame(measureFPS)
  })

  return {
    fps: readonly(fps),
    frameTime: readonly(frameTime)
  }
}

// =========================
// MAIN COMPOSABLE EXPORT
// =========================

export default function useAnimations() {
  const { observeElement, observedElements } = useScrollAnimations()
  const { handleMouseMove, resetPosition, addMagneticElement } = useMagneticEffect()
  const { addParallaxElement } = useParallaxScroll()
  const { createGradientAnimation } = useGradientAnimations()
  const { fps, frameTime } = useAnimationPerformance()

  return {
    // Scroll animations
    observeElement,
    observedElements,

    // Magnetic effects
    handleMouseMove,
    resetPosition,
    addMagneticElement,

    // Parallax
    addParallaxElement,

    // Gradient animations
    createGradientAnimation,

    // Performance
    fps,
    frameTime,

    // Utility functions
    fluidFadeIn,
    morphingHover,
    magneticHover,
    createRippleEffect,
    liquidLoading,
    kineticText,
    gradientShift,
    floatingElements,
    staggerIn,

    // Composables
    useIntersectionObserver,
    useScrollAnimation,
    useScrollAnimations,
    useMagneticEffect,
    useParallaxScroll,
    useGradientAnimations,
    useAnimationPerformance
  }
}
