import { useI18n as useVueI18n } from 'vue-i18n'

// Type per le chiavi di traduzione
type TranslationKeys = string

/**
 * Composable moderno per Vue i18n con type safety
 * Fornisce helper functions tipizzate per traduzioni, date e numeri
 */
export function useI18n() {
  const { t, d, n, locale } = useVueI18n()

  /**
   * Traduzione tipizzata con parametri
   */
  const translate = (key: TranslationKeys, params?: Record<string, unknown>): string => {
    if (params) {
      return t(key, params) as string
    }
    return t(key) as string
  }

  /**
   * Formattazione data/tempo
   */
  const formatDate = (value: string | number | Date, format?: string): string => {
    if (format) {
      return d(value, format) as string
    }
    return d(value) as string
  }

  /**
   * Formattazione numeri
   */
  const formatNumber = (value: number, format?: string): string => {
    if (format) {
      return n(value, format) as string
    }
    return n(value) as string
  }

  /**
   * Ottiene la lingua corrente
   */
  const currentLocale = locale

  return {
    // Funzioni di traduzione
    t: translate,
    d: formatDate,
    n: formatNumber,

    // Gestione locale
    locale: currentLocale,

    // Funzioni originali per compatibilità
    translate,
    formatDate,
    formatNumber
  }
}

/**
 * Helper per traduzioni con context
 */
export function useTranslation() {
  const { t } = useI18n()

  return {
    t,
    // Helper specifici per sezioni
    common: {
      actions: {
        submit: () => t('common.actions.submit'),
        cancel: () => t('common.actions.cancel'),
        save: () => t('common.actions.save'),
        delete: () => t('common.actions.delete'),
        edit: () => t('common.actions.edit'),
        view: () => t('common.actions.view'),
        close: () => t('common.actions.close'),
        back: () => t('common.actions.back'),
        next: () => t('common.actions.next'),
        previous: () => t('common.actions.previous')
      },
      labels: {
        name: () => t('common.labels.name'),
        email: () => t('common.labels.email'),
        phone: () => t('common.labels.phone'),
        message: () => t('common.labels.message'),
        subject: () => t('common.labels.subject'),
        description: () => t('common.labels.description'),
        title: () => t('common.labels.title'),
        category: () => t('common.labels.category'),
        date: () => t('common.labels.date'),
        time: () => t('common.labels.time')
      },
      messages: {
        loading: () => t('common.messages.loading'),
        error: () => t('common.messages.error'),
        success: () => t('common.messages.success'),
        warning: () => t('common.messages.warning'),
        info: () => t('common.messages.info'),
        noData: () => t('common.messages.noData'),
        noResults: () => t('common.messages.noResults')
      },
      navigation: {
        home: () => t('common.navigation.home'),
        about: () => t('common.navigation.about'),
        contact: () => t('common.navigation.contact'),
        portfolio: () => t('common.navigation.portfolio'),
        services: () => t('common.navigation.services'),
        blog: () => t('common.navigation.blog'),
        skipToContent: () => t('common.navigation.skipToContent'),
        skipToNavigation: () => t('common.navigation.skipToNavigation')
      },
      theme: {
        lightMode: () => t('common.theme.lightMode'),
        darkMode: () => t('common.theme.darkMode'),
        systemMode: () => t('common.theme.systemMode'),
        toggleTheme: () => t('common.theme.toggleTheme')
      },
      brand: {
        name: () => t('common.brand.name'),
        tagline: () => t('common.brand.tagline'),
        loadingPortfolio: () => t('common.brand.loadingPortfolio')
      },
      copyright: {
        text: () => t('common.copyright.text'),
        madeWith: () => t('common.copyright.madeWith')
      }
    },
    pages: {
      home: {
        title: () => t('pages.home.title'),
        hero: {
          title: () => t('pages.home.hero.title'),
          subtitle: () => t('pages.home.hero.subtitle'),
          cta: () => t('pages.home.hero.cta'),
          scrollDown: () => t('pages.home.hero.scrollDown')
        },
        about: {
          title: () => t('pages.home.about.title'),
          description: () => t('pages.home.about.description')
        },
        portfolio: {
          title: () => t('pages.home.portfolio.title'),
          description: () => t('pages.home.portfolio.description')
        },
        contact: {
          title: () => t('pages.home.contact.title'),
          description: () => t('pages.home.contact.description')
        },
        animatedSection: {
          title: () => t('pages.home.animatedSection.title'),
          content: () => t('pages.home.animatedSection.content')
        }
      }
    },
    navigation: {
      home: () => t('navigation.home'),
      portfolio: () => t('navigation.portfolio'),
      about: () => t('navigation.about'),
      contact: () => t('navigation.contact'),
      logo: () => t('navigation.logo'),
      logoLabel: () => t('navigation.logoLabel')
    },
    footer: {
      social: {
        title: () => t('footer.social.title'),
        visit: (platform: string) => t('footer.social.visit', { platform }),
        linkedin: () => t('footer.social.linkedin'),
        instagram: () => t('footer.social.instagram'),
        github: () => t('footer.social.github'),
        behance: () => t('footer.social.behance')
      },
      contact: {
        title: () => t('footer.contact.title'),
        email: () => t('footer.contact.email'),
        location: () => t('footer.contact.location')
      }
    },
    services: {
      uiux: {
        title: () => t('services.uiux.title'),
        description: () => t('services.uiux.description')
      },
      motion: {
        title: () => t('services.motion.title'),
        description: () => t('services.motion.description')
      },
      webdev: {
        title: () => t('services.webdev.title'),
        description: () => t('services.webdev.description')
      },
      consulting: {
        title: () => t('services.consulting.title'),
        description: () => t('services.consulting.description')
      }
    },
    forms: {
      validation: {
        required: () => t('forms.validation.required'),
        email: () => t('forms.validation.email'),
        minLength: (count: number) => t('forms.validation.minLength', { count }),
        maxLength: (count: number) => t('forms.validation.maxLength', { count }),
        phone: () => t('forms.validation.phone')
      },
      contact: {
        title: () => t('forms.contact.title'),
        name: () => t('forms.contact.name'),
        email: () => t('forms.contact.email'),
        subject: () => t('forms.contact.subject'),
        message: () => t('forms.contact.message'),
        submit: () => t('forms.contact.submit'),
        success: () => t('forms.contact.success'),
        error: () => t('forms.contact.error')
      }
    },
    accessibility: {
      skipToContent: () => t('accessibility.skipToContent'),
      mainNavigation: () => t('accessibility.mainNavigation'),
      closeMenu: () => t('accessibility.closeMenu'),
      openMenu: () => t('accessibility.openMenu'),
      loading: () => t('accessibility.loading'),
      loadingContent: () => t('accessibility.loadingContent'),
      error: () => t('accessibility.error'),
      success: () => t('accessibility.success'),
      visit: (platform: string) => t('accessibility.visit', { platform }),
      logo: () => t('accessibility.logo'),
      logoLabel: () => t('accessibility.logoLabel'),
      toggleTheme: () => t('accessibility.toggleTheme'),
      selectLanguage: () => t('accessibility.selectLanguage')
    }
  }
}
