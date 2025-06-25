import { createRouter, createWebHistory } from 'vue-router'

// Definizione delle rotte principali dell'app
const router = createRouter({
  history: createWebHistory(), // Modalità history (URL puliti)
  routes: [
    // Home page (lazy loading della view)
    { path: '/', component: () => import('@/views/Home.vue') },
    // Altre rotte possono essere aggiunte qui (Portfolio, About, Contact...)
  ],
})

export default router
