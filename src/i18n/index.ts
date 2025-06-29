import { createI18n } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'
import it from './locales/it.json'
import en from './locales/en.json'
import es from './locales/es.json'

// Type definitions per le chiavi di traduzione
export type TranslationKeys =
  // Common
  | 'common.actions.save'
  | 'common.actions.cancel'
  | 'common.actions.delete'
  | 'common.actions.close'
  | 'common.actions.open'
  | 'common.actions.loading'
  | 'common.actions.submit'
  | 'common.actions.saveChanges'
  | 'common.actions.exploreProjects'
  | 'common.actions.downloadCV'
  | 'common.actions.startProject'
  | 'common.actions.viewAllProjects'
  | 'common.actions.exploreProject'
  | 'common.labels.name'
  | 'common.labels.fullName'
  | 'common.labels.email'
  | 'common.labels.businessEmail'
  | 'common.labels.phone'
  | 'common.labels.company'
  | 'common.labels.budget'
  | 'common.labels.message'
  | 'common.labels.projectDescription'
  | 'common.messages.loading'
  | 'common.messages.error'
  | 'common.messages.success'
  | 'common.messages.noData'
  | 'common.messages.retry'
  | 'common.messages.thankYou'
  | 'common.messages.errorSending'
  | 'common.navigation.skipToContent'
  | 'common.navigation.mainNavigation'
  | 'common.navigation.closeMenu'
  | 'common.navigation.openMenu'
  | 'common.theme.darkMode'
  | 'common.theme.lightMode'
  | 'common.theme.activateDarkMode'
  | 'common.theme.activateLightMode'
  | 'common.brand.name'
  | 'common.brand.tagline'
  | 'common.brand.loading'
  | 'common.brand.loadingPortfolio'
  | 'common.copyright.text'
  | 'common.copyright.madeWith'
  | 'common.copyright.rightsReserved'

  // Meta
  | 'meta.title'
  | 'meta.description'
  | 'meta.keywords'

  // Pages
  | 'pages.home.title'
  | 'pages.home.hero.badge'
  | 'pages.home.hero.title'
  | 'pages.home.hero.typewriterPrefix'
  | 'pages.home.hero.desc1'
  | 'pages.home.hero.desc2'
  | 'pages.home.hero.cta'
  | 'pages.home.hero.ctaSecondary'
  | 'pages.home.about.title'
  | 'pages.home.about.subtitle'
  | 'pages.home.about.description'
  | 'pages.home.portfolio.title'
  | 'pages.home.portfolio.subtitle'
  | 'pages.home.portfolio.description'
  | 'pages.home.contact.title'
  | 'pages.home.contact.subtitle'
  | 'pages.home.contact.description'
  | 'pages.navigation.home'
  | 'pages.navigation.about'
  | 'pages.navigation.services'
  | 'pages.navigation.portfolio'
  | 'pages.navigation.experience'
  | 'pages.navigation.contact'
  | 'pages.navigation.logo'
  | 'pages.navigation.logoLabel'
  | 'pages.footer.bio'
  | 'pages.footer.social.title'
  | 'pages.footer.social.visit'
  | 'pages.footer.social.linkedin'
  | 'pages.footer.social.email'
  | 'pages.footer.social.website'
  | 'pages.footer.social.dribbble'
  | 'pages.footer.social.behance'
  | 'pages.footer.contact.title'
  | 'pages.footer.contact.email'
  | 'pages.footer.contact.phone'
  | 'pages.footer.contact.location'
  | 'pages.footer.contact.availability'
  | 'pages.footer.links.privacy'
  | 'pages.footer.links.terms'

  // Services
  | 'services.title'
  | 'services.subtitle'
  | 'services.uiDevelopment.title'
  | 'services.uiDevelopment.description'
  | 'services.uiDevelopment.price'
  | 'services.aiSolutions.title'
  | 'services.aiSolutions.description'
  | 'services.aiSolutions.price'
  | 'services.consulting.title'
  | 'services.consulting.description'
  | 'services.consulting.price'

  // Skills
  | 'skills.title'
  | 'skills.frontend.title'
  | 'skills.frontend.items'
  | 'skills.design.title'
  | 'skills.design.items'
  | 'skills.enterprise.title'
  | 'skills.enterprise.items'

  // Blog
  | 'blog.title'
  | 'blog.subtitle'
  | 'blog.readMore'
  | 'blog.cta.title'
  | 'blog.cta.description'
  | 'blog.cta.viewAll'
  | 'blog.cta.newsletter'

  // Lead Magnet
  | 'leadMagnet.title'
  | 'leadMagnet.subtitle'
  | 'leadMagnet.benefits.benefit1'
  | 'leadMagnet.benefits.benefit2'
  | 'leadMagnet.benefits.benefit3'
  | 'leadMagnet.benefits.benefit4'
  | 'leadMagnet.testimonial'
  | 'leadMagnet.author'
  | 'leadMagnet.authorRole'
  | 'leadMagnet.form.title'
  | 'leadMagnet.form.subtitle'
  | 'leadMagnet.form.firstName'
  | 'leadMagnet.form.firstNamePlaceholder'
  | 'leadMagnet.form.email'
  | 'leadMagnet.form.emailPlaceholder'
  | 'leadMagnet.form.interests'
  | 'leadMagnet.form.privacy'
  | 'leadMagnet.form.privacyLink'
  | 'leadMagnet.form.submit'
  | 'leadMagnet.form.submitting'
  | 'leadMagnet.trust.privacy'
  | 'leadMagnet.trust.noSpam'
  | 'leadMagnet.trust.unsubscribe'

  // Forms
  | 'forms.validation.required'
  | 'forms.validation.email'
  | 'forms.validation.minLength'
  | 'forms.validation.maxLength'
  | 'forms.validation.phone'
  | 'forms.validation.privacy'
  | 'forms.contact.title'
  | 'forms.contact.subtitle'
  | 'forms.contact.name'
  | 'forms.contact.namePlaceholder'
  | 'forms.contact.email'
  | 'forms.contact.emailPlaceholder'
  | 'forms.contact.company'
  | 'forms.contact.companyPlaceholder'
  | 'forms.contact.companyHelp'
  | 'forms.contact.budget'
  | 'forms.contact.budgetPlaceholder'
  | 'forms.contact.budgetSmall'
  | 'forms.contact.budgetMedium'
  | 'forms.contact.budgetLarge'
  | 'forms.contact.budgetEnterprise'
  | 'forms.contact.message'
  | 'forms.contact.messagePlaceholder'
  | 'forms.contact.privacy'
  | 'forms.contact.privacyLink'
  | 'forms.contact.send'
  | 'forms.contact.sending'
  | 'forms.contact.success'
  | 'forms.contact.error'

  // Animations
  | 'animations.demo.title'
  | 'animations.demo.subtitle'
  | 'animations.demo.fluidFade'
  | 'animations.demo.morphingHover'
  | 'animations.demo.magneticHover'
  | 'animations.demo.rippleEffect'
  | 'animations.demo.liquidLoading'
  | 'animations.demo.kineticText'
  | 'animations.demo.gradientShift'
  | 'animations.demo.floatingElements'
  | 'animations.demo.performance'
  | 'animations.demo.fps'
  | 'animations.demo.frameTime'

  // Accessibility
  | 'accessibility.skipToContent'
  | 'accessibility.mainNavigation'
  | 'accessibility.closeMenu'
  | 'accessibility.openMenu'
  | 'accessibility.loading'
  | 'accessibility.loadingContent'
  | 'accessibility.error'
  | 'accessibility.success'
  | 'accessibility.visit'
  | 'accessibility.logo'
  | 'accessibility.logoLabel'

// Configurazione i18n
const i18nConfig: I18nOptions = {
  locale: 'it',
  fallbackLocale: 'en',
  messages: {
    it,
    en,
    es
  }
}

// Creazione istanza i18n
export const i18n = createI18n(i18nConfig)

// Helper per type safety
export function t(key: TranslationKeys, params?: Record<string, unknown>): string {
  if (params) {
    return i18n.global.t(key, params) as string
  }
  return i18n.global.t(key) as string
}

// Helper per date/time
export function d(value: string | number | Date, format?: string): string {
  if (format) {
    return i18n.global.d(value, format) as string
  }
  return i18n.global.d(value) as string
}

// Helper per numeri
export function n(value: number, format?: string): string {
  if (format) {
    return i18n.global.n(value, format) as string
  }
  return i18n.global.n(value) as string
}

export default i18n
