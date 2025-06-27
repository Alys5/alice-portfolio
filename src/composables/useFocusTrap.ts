import { onMounted, onUnmounted, ref, type Ref, watchEffect } from 'vue'

/**
 * useFocusTrap – Composable per focus trap accessibile (WCAG 2.2 §2.4.11)
 *
 * @param target Ref<Element|null> - elemento root da "trappare"
 * @param active Ref<boolean> - attiva/disattiva il focus trap
 * @returns { enable: () => void, disable: () => void, isActive: Ref<boolean> }
 *
 * Esempio:
 * const { enable, disable, isActive } = useFocusTrap(targetRef, trapActive)
 */
export function useFocusTrap(target: Ref<HTMLElement | null>, active: Ref<boolean> = ref(true)) {
  const isActive = ref(false)
  let lastFocused: HTMLElement | null = null

  function getFocusableElements(root: HTMLElement) {
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]',
      ),
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isActive.value || !target.value) return
    if (e.key !== 'Tab') return
    const focusables = getFocusableElements(target.value)
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const current = document.activeElement
    if (e.shiftKey) {
      if (current === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (current === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  function enable() {
    if (!target.value) return
    isActive.value = true
    lastFocused = document.activeElement as HTMLElement
    const focusables = getFocusableElements(target.value)
    if (focusables.length) focusables[0].focus()
    document.addEventListener('keydown', handleKeydown)
  }

  function disable() {
    isActive.value = false
    document.removeEventListener('keydown', handleKeydown)
    if (lastFocused) lastFocused.focus()
  }

  onMounted(() => {
    if (active.value) enable()
  })

  onUnmounted(() => {
    disable()
  })

  // Watch per attivazione/disattivazione dinamica
  watchEffect(() => {
    if (active.value && !isActive.value) enable()
    else if (!active.value && isActive.value) disable()
  })

  return { enable, disable, isActive }
}
