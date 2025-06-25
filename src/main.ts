// Importa gli stili globali SCSS (palette, reset, variabili)
import '@/assets/styles/global.scss'

// Importa core Vue e plugin principali
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupI18n } from '@/data/i18n'

import App from './App.vue'
import router from './router'

// Crea istanza principale dell'app Vue
const app = createApp(App)
// Crea istanza Pinia (state management globale)
const pinia = createPinia()

// Registra Pinia e router
app.use(pinia)
app.use(router)

// Recupera la lingua da localStorage PRIMA di creare lo store
const locale = (localStorage.getItem('locale') as 'it' | 'en') || 'it'
// Setup i18n con lingua attiva
const i18n = setupI18n(locale)
app.use(i18n)

// Monta l'app sull'elemento #app
app.mount('#app')
