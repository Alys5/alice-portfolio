import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

// Tipi
export type CursorState = 'default' | 'hover' | 'click' | 'magnetic' | 'typing'

interface Position {
  x: number
  y: number
}

const cursorPosition = ref<Position>({ x: 0, y: 0 })
const cursorState = ref<CursorState>('default')
const isVisible = ref(false)
const magneticElements = shallowRef(new Set<HTMLElement>())

let animationFrame: number | null = null
let lastMove = 0
let isTouch = false
let isInitialized = false

// Lerp utility
function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n
}

function detectTouch() {
  isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
  isVisible.value = !isTouch && window.innerWidth >= 768
}

function onMouseMove(e: MouseEvent) {
  const now = performance.now()
  if (now - lastMove < 8) return // throttle
  lastMove = now
  cursorPosition.value.x = e.clientX
  cursorPosition.value.y = e.clientY
  if (!isVisible.value) isVisible.value = true
  if (magneticElements.value.size) {
    for (const el of magneticElements.value) {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const strength = Math.max(0, 1 - dist / (rect.width * 1.2))
      if (strength > 0.15) {
        cursorState.value = 'magnetic'
        // Attrazione smooth
        const tx = lerp(0, dx * 0.18, strength)
        const ty = lerp(0, dy * 0.18, strength)
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${1 + strength * 0.08})`
        el.style.zIndex = '20'
      } else {
        el.style.transform = ''
        el.style.zIndex = ''
      }
    }
  }
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(() => {})
}

function onMouseDown() {
  cursorState.value = 'click'
  // Effetto particelle: handled in CustomCursor.vue
}
function onMouseUp() {
  cursorState.value = 'default'
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    cursorState.value = 'typing'
  }
}
function onKeyUp() {
  cursorState.value = 'default'
}

function addMagnetic(element: HTMLElement) {
  magneticElements.value.add(element)
}
function removeMagnetic(element: HTMLElement) {
  magneticElements.value.delete(element)
  element.style.transform = ''
  element.style.zIndex = ''
}
function setCursorState(state: CursorState) {
  cursorState.value = state
}

function initializeCursor() {
  if (isInitialized) return
  isInitialized = true

  detectTouch()
  window.addEventListener('resize', detectTouch)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('touchstart', detectTouch)
}

function cleanupCursor() {
  if (!isInitialized) return
  isInitialized = false

  window.removeEventListener('resize', detectTouch)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('touchstart', detectTouch)
  if (animationFrame) cancelAnimationFrame(animationFrame)
  for (const el of magneticElements.value) {
    el.style.transform = ''
    el.style.zIndex = ''
  }
  magneticElements.value.clear()
}

export default function useCursor() {
  onMounted(() => {
    initializeCursor()
  })

  onUnmounted(() => {
    cleanupCursor()
  })

  return {
    cursorPosition,
    cursorState,
    isVisible,
    addMagnetic,
    removeMagnetic,
    setCursorState,
  }
}
