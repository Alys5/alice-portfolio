import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// Options interface
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

let globalDuration = 1
const activeTweens: gsap.core.Tween[] = []

export function isReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
export function setGlobalDuration(multiplier: number) {
  globalDuration = multiplier
}
export function pauseAllAnimations() {
  gsap.globalTimeline.pause()
}
export function resumeAllAnimations() {
  gsap.globalTimeline.resume()
}

function getOpts(opts?: AnimationOptions) {
  return {
    duration: opts?.duration ?? 0.6 * globalDuration,
    delay: opts?.delay ?? 0,
    ease: opts?.ease ?? 'power2.out',
    once: opts?.once ?? true,
    stagger: opts?.stagger,
    trigger: opts?.trigger,
    start: opts?.start ?? 'top 80%',
    end: opts?.end ?? 'bottom 10%',
  }
}

function setWillChange(el: Element, props: string[]) {
  const prev = (el as HTMLElement).style.willChange
  ;(el as HTMLElement).style.willChange = props.join(', ')
  return () => {
    (el as HTMLElement).style.willChange = prev
  }
}

export async function fadeIn(element: Element, options?: AnimationOptions): Promise<void> {
  if (!element || isReducedMotion()) return
  const opts = getOpts(options)
  const cleanupWillChange = setWillChange(element, ['opacity', 'transform'])
  return new Promise((resolve) => {
    const tween = gsap.fromTo(
      element,
      { autoAlpha: 0, y: 24, force3D: true },
      {
        autoAlpha: 1,
        y: 0,
        duration: opts.duration,
        delay: opts.delay,
        ease: opts.ease,
        onComplete: () => {
          cleanupWillChange()
          resolve()
        },
      }
    )
    activeTweens.push(tween)
    if (opts.trigger) {
      ScrollTrigger.create({
        trigger: opts.trigger,
        start: opts.start,
        once: opts.once,
        animation: tween,
      })
    }
  })
}

export async function slideUp(element: Element, options?: AnimationOptions): Promise<void> {
  if (!element || isReducedMotion()) return
  const opts = getOpts(options)
  const cleanupWillChange = setWillChange(element, ['opacity', 'transform'])
  return new Promise((resolve) => {
    const tween = gsap.fromTo(
      element,
      { autoAlpha: 0, y: 60, force3D: true },
      {
        autoAlpha: 1,
        y: 0,
        duration: opts.duration,
        delay: opts.delay,
        ease: opts.ease,
        onComplete: () => {
          cleanupWillChange()
          resolve()
        },
      }
    )
    activeTweens.push(tween)
    if (opts.trigger) {
      ScrollTrigger.create({
        trigger: opts.trigger,
        start: opts.start,
        once: opts.once,
        animation: tween,
      })
    }
  })
}

export async function scaleIn(element: Element, options?: AnimationOptions): Promise<void> {
  if (!element || isReducedMotion()) return
  const opts = getOpts(options)
  const cleanupWillChange = setWillChange(element, ['opacity', 'transform'])
  return new Promise((resolve) => {
    const tween = gsap.fromTo(
      element,
      { autoAlpha: 0, scale: 0.8, force3D: true },
      {
        autoAlpha: 1,
        scale: 1,
        duration: opts.duration,
        delay: opts.delay,
        ease: opts.ease,
        onComplete: () => {
          cleanupWillChange()
          resolve()
        },
      }
    )
    activeTweens.push(tween)
    if (opts.trigger) {
      ScrollTrigger.create({
        trigger: opts.trigger,
        start: opts.start,
        once: opts.once,
        animation: tween,
      })
    }
  })
}

export async function staggerIn(elements: Element[] | NodeListOf<Element>, options?: AnimationOptions): Promise<void> {
  if (!elements || isReducedMotion()) return
  const opts = getOpts(options)
  const cleanupFns = Array.from(elements).map(el => setWillChange(el, ['opacity', 'transform']))
  return new Promise((resolve) => {
    const tween = gsap.fromTo(
      elements,
      { autoAlpha: 0, y: 32, force3D: true },
      {
        autoAlpha: 1,
        y: 0,
        duration: opts.duration,
        delay: opts.delay,
        ease: opts.ease,
        stagger: opts.stagger ?? 0.12,
        onComplete: () => {
          cleanupFns.forEach(fn => fn())
          resolve()
        },
      }
    )
    activeTweens.push(tween)
    if (opts.trigger) {
      ScrollTrigger.create({
        trigger: opts.trigger,
        start: opts.start,
        once: opts.once,
        animation: tween,
      })
    }
  })
}

// Magnetic hover effect
export function magneticHover(element: HTMLElement, strength = 0.18) {
  if (!element) return () => {}
  let mouseX = 0, mouseY = 0, animating = false
  let rafId: number | null = null
  let rect: DOMRect
  function onMouseMove(ev: MouseEvent) {
    rect = element.getBoundingClientRect()
    const x = ev.clientX - (rect.left + rect.width / 2)
    const y = ev.clientY - (rect.top + rect.height / 2)
    const dist = Math.sqrt(x * x + y * y)
    if (dist < rect.width * 0.8) {
      mouseX = x * strength
      mouseY = y * strength
      if (!animating) animate()
    } else {
      reset()
    }
  }
  function animate() {
    animating = true
    gsap.to(element, {
      x: mouseX,
      y: mouseY,
      scale: 1.05,
      boxShadow: '0 0 32px 0 var(--persian-blue)',
      duration: 0.35,
      ease: 'expo.out',
      force3D: true,
      onUpdate: () => {
        if (Math.abs(mouseX) < 1 && Math.abs(mouseY) < 1) reset()
      }
    })
    rafId = requestAnimationFrame(animate)
  }
  function reset() {
    animating = false
    gsap.to(element, {
      x: 0,
      y: 0,
      scale: 1,
      boxShadow: '',
      duration: 0.5,
      ease: 'elastic.out(1,0.4)',
      force3D: true,
    })
    if (rafId) cancelAnimationFrame(rafId)
  }
  element.addEventListener('mousemove', onMouseMove)
  element.addEventListener('mouseleave', reset)
  // Cleanup
  const cleanup = () => {
    element.removeEventListener('mousemove', onMouseMove)
    element.removeEventListener('mouseleave', reset)
    reset()
  }
  return cleanup
}
