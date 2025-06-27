import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ExampleContainer from './components/ExampleContainer.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Registra componenti globali
    app.component('ExampleContainer', ExampleContainer)
  },
} satisfies Theme
