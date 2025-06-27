import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  title: 'Alice Portfolio',
  description: 'Documentazione tecnica del portfolio di Alice Mandelli',
  lang: 'it-IT',

  themeConfig: {
    siteTitle: 'Alice Portfolio Docs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Componenti', link: '/components/' },
      { text: 'Composables', link: '/composables/' },
      { text: 'Guide', link: '/guides/' },
      { text: 'GitHub', link: 'https://github.com/alicemandelli/portfolio' },
    ],

    sidebar: {
      '/components/': [
        {
          text: 'Componenti UI',
          items: [
            { text: 'Panoramica', link: '/components/' },
            { text: 'ModernButton', link: '/components/ui/ModernButton' },
            { text: 'ModernCard', link: '/components/ui/ModernCard' },
            { text: 'ContactForm', link: '/components/ui/ContactForm' },
            { text: 'VMarkdownEditor', link: '/components/ui/VMarkdownEditor' },
            { text: 'ImageUploader', link: '/components/ui/ImageUploader' },
            { text: 'ProjectCard', link: '/components/ui/ProjectCard' },
            { text: 'ThemeToggle', link: '/components/ui/ThemeToggle' },
            { text: 'PWAStatus', link: '/components/ui/PWAStatus' },
          ],
        },
        {
          text: 'Layout',
          items: [
            { text: 'AppHeader', link: '/components/layout/AppHeader' },
            { text: 'AppFooter', link: '/components/layout/AppFooter' },
            { text: 'NavBar', link: '/components/layout/NavBar' },
            { text: 'BentoGrid', link: '/components/layout/BentoGrid' },
          ],
        },
        {
          text: 'Sezioni',
          items: [
            { text: 'HeroSection', link: '/components/sections/HeroSection' },
            { text: 'AboutSection', link: '/components/sections/AboutSection' },
            { text: 'PortfolioSection', link: '/components/sections/PortfolioSection' },
            { text: 'ContactSection', link: '/components/sections/ContactSection' },
            { text: 'SkillsSection', link: '/components/sections/SkillsSection' },
            { text: 'ExperienceSection', link: '/components/sections/ExperienceSection' },
            { text: 'ResumeSection', link: '/components/sections/ResumeSection' },
            { text: 'ServicesSection', link: '/components/sections/ServicesSection' },
            { text: 'TestimonialsSection', link: '/components/sections/TestimonialsSection' },
          ],
        },
      ],
      '/composables/': [
        {
          text: 'Composables',
          items: [
            { text: 'Panoramica', link: '/composables/' },
            { text: 'useTheme', link: '/composables/useTheme' },
            { text: 'usePerformance', link: '/composables/usePerformance' },
            {
              text: 'useAccessibilityAnnouncements',
              link: '/composables/useAccessibilityAnnouncements',
            },
            { text: 'useIntersectionObserver', link: '/composables/useIntersectionObserver' },
            { text: 'useImageUpload', link: '/composables/useImageUpload' },
            { text: 'useFocusTrap', link: '/composables/useFocusTrap' },
            { text: 'useScrollProgress', link: '/composables/useScrollProgress' },
            { text: 'useServiceWorker', link: '/composables/useServiceWorker' },
            { text: 'useUserPreferences', link: '/composables/useUserPreferences' },
            { text: 'useProjectsFilter', link: '/composables/useProjectsFilter' },
            { text: 'useBlog', link: '/composables/useBlog' },
            { text: 'useMeta', link: '/composables/useMeta' },
          ],
        },
      ],
      '/guides/': [
        {
          text: 'Guide',
          items: [
            { text: 'Panoramica', link: '/guides/' },
            { text: 'Accessibilità', link: '/guides/accessibility' },
            { text: 'Performance', link: '/guides/performance' },
            { text: 'PWA Setup', link: '/guides/pwa-setup' },
            { text: 'Theme System', link: '/guides/theme-system' },
            { text: 'Testing', link: '/guides/testing' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/alicemandelli/portfolio' }],

    search: {
      provider: 'local',
      options: {
        locales: {
          'it-IT': {
            translations: {
              button: {
                buttonText: 'Cerca documentazione...',
                buttonAriaLabel: 'Cerca documentazione',
              },
              modal: {
                noResultsText: 'Nessun risultato trovato',
                resetButtonTitle: 'Cancella ricerca',
                footer: {
                  selectText: 'seleziona',
                  navigateText: 'naviga',
                  closeText: 'chiudi',
                },
              },
            },
          },
        },
      },
    },

    footer: {
      message: 'Rilasciato sotto licenza MIT',
      copyright: 'Copyright © 2025 Alice Mandelli',
    },
  },

  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../src'),
      },
    },
  },

  markdown: {
    theme: 'material-theme-palenight',
    lineNumbers: true,
  },
})
