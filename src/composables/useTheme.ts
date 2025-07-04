import { ref, computed, watchEffect, onMounted } from 'vue'

const THEME_KEY = 'alice-mandelli-theme'
const isDark = ref(false)
const systemPreference = ref<'light' | 'dark'>('light')
const mode = ref<'light' | 'dark' | 'system'>('system')
let isInitialized = false

// Palette Alice Mandelli (shared)
const sharedVars = {
  '--accent-primary': 'var(--bright-sun)',
  '--accent-secondary': 'var(--persian-blue)',
  '--accent-tertiary': 'var(--picton-blue)',
}
const lightVars = {
  '--bg-primary': '#ffffff',
  '--bg-secondary': '#f8fafc',
  '--text-primary': 'var(--ebony-clay)',
  '--text-secondary': 'rgba(41, 53, 63, 0.7)',
}
const darkVars = {
  '--bg-primary': 'var(--ebony-clay)',
  '--bg-secondary': '#1e293b',
  '--text-primary': '#ffffff',
  '--text-secondary': 'rgba(255,255,255,0.8)',
}

function applyThemeVars(vars: Record<string, string>) {
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v)
  }
}
function setTheme(modeValue: 'light' | 'dark' | 'system') {
  mode.value = modeValue
  if (modeValue === 'system') {
    isDark.value = systemPreference.value === 'dark'
  } else {
    isDark.value = modeValue === 'dark'
  }
  localStorage.setItem(THEME_KEY, modeValue)
  updateThemeVars()
}
function updateThemeVars() {
  // Smooth transition
  const root = document.documentElement
  root.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  // Palette
  applyThemeVars(sharedVars)
  if (isDark.value) {
    applyThemeVars(darkVars)
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    applyThemeVars(lightVars)
    root.classList.add('light')
    root.classList.remove('dark')
  }
}
function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark')
}
function detectSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
function handleSystemChange(e: MediaQueryListEvent) {
  systemPreference.value = e.matches ? 'dark' : 'light'
  if (mode.value === 'system') {
    isDark.value = systemPreference.value === 'dark'
    updateThemeVars()
  }
}

function initializeTheme() {
  if (isInitialized) return
  isInitialized = true

  // Prevent flash: apply theme before hydration
  const saved = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'system' | null
  systemPreference.value = detectSystemPreference()
  if (saved === 'light' || saved === 'dark') {
    isDark.value = saved === 'dark'
    mode.value = saved
  } else {
    isDark.value = systemPreference.value === 'dark'
    mode.value = 'system'
  }
  updateThemeVars()

  // Watch system preference
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  systemPreference.value = mq.matches ? 'dark' : 'light'
  mq.addEventListener('change', handleSystemChange)
}

export function useTheme() {
  onMounted(() => {
    initializeTheme()
  })

  watchEffect(() => {
    if (isInitialized) {
      updateThemeVars()
    }
  })

  return {
    isDark: computed(() => isDark.value),
    toggleTheme,
    setTheme,
    systemPreference: computed(() => systemPreference.value),
  }
}
