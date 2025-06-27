import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ContactForm from '@/components/ui/ContactForm.vue'

// Mock dei composables
vi.mock('@/composables/useAccessibilityAnnouncements', () => ({
  useAccessibilityAnnouncements: vi.fn(() => ({
    announceToScreenReader: vi.fn(),
    announceError: vi.fn(),
  })),
}))

// Mock di vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'contact.form.name': 'Nome',
        'contact.form.email': 'Email',
        'contact.form.message': 'Messaggio',
        'contact.form.submit': 'Invia',
        'contact.form.success': 'Messaggio inviato con successo!',
        'contact.form.error': "Errore nell'invio del messaggio",
      }
      return translations[key] || key
    }),
  })),
}))

// Mock di fetch
global.fetch = vi.fn()

describe('ContactForm.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof ContactForm>>

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    vi.mocked(fetch).mockReset()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('Rendering', () => {
    it('rende correttamente tutti i campi del form', () => {
      wrapper = mount(ContactForm)

      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('textarea').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('rende label corrette per ogni campo', () => {
      wrapper = mount(ContactForm)

      expect(wrapper.find('label[for="contact-name"]').text()).toBe('Nome')
      expect(wrapper.find('label[for="contact-email"]').text()).toBe('Email')
      expect(wrapper.find('label[for="contact-message"]').text()).toBe('Messaggio')
    })

    it('rende attributi di accessibilità corretti', () => {
      wrapper = mount(ContactForm)

      const nameInput = wrapper.find('input[type="text"]')
      const emailInput = wrapper.find('input[type="email"]')
      const messageTextarea = wrapper.find('textarea')

      expect(nameInput.attributes('aria-describedby')).toBeUndefined()
      expect(nameInput.attributes('aria-invalid')).toBe('false')
      expect(nameInput.attributes('autocomplete')).toBe('name')
      expect(nameInput.attributes('required')).toBeDefined()

      expect(emailInput.attributes('autocomplete')).toBe('email')
      expect(messageTextarea.attributes('required')).toBeDefined()
    })

    it('rende live region per annunci', () => {
      wrapper = mount(ContactForm)

      const liveRegion = wrapper.find('[aria-live="polite"]')
      expect(liveRegion.exists()).toBe(true)
      expect(liveRegion.attributes('aria-atomic')).toBe('true')
    })
  })

  describe('Validazione', () => {
    it('valida nome obbligatorio', async () => {
      wrapper = mount(ContactForm)

      await wrapper.find('form').trigger('submit')
      await nextTick()

      const nameError = wrapper.find('#contact-name-error')
      expect(nameError.exists()).toBe(true)
      expect(nameError.text()).toBe('Il nome è obbligatorio.')
    })

    it('valida nome con almeno 2 caratteri', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ form: { name: 'A', email: '', message: '' } })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const nameError = wrapper.find('#contact-name-error')
      expect(nameError.text()).toBe('Il nome deve contenere almeno 2 caratteri.')
    })

    it('valida email obbligatoria', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ form: { name: 'Test', email: '', message: '' } })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const emailError = wrapper.find('#contact-email-error')
      expect(emailError.text()).toBe("L'email è obbligatoria.")
    })

    it('valida formato email', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ form: { name: 'Test', email: 'invalid-email', message: '' } })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const emailError = wrapper.find('#contact-email-error')
      expect(emailError.text()).toBe("Inserisci un'email valida.")
    })

    it('accetta email valide', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ form: { name: 'Test', email: 'test@example.com', message: '' } })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const emailError = wrapper.find('#contact-email-error')
      expect(emailError.exists()).toBe(false)
    })

    it('valida messaggio obbligatorio', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ form: { name: 'Test', email: 'test@example.com', message: '' } })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const messageError = wrapper.find('#contact-message-error')
      expect(messageError.text()).toBe('Il messaggio è obbligatorio.')
    })

    it('valida messaggio con almeno 10 caratteri', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ form: { name: 'Test', email: 'test@example.com', message: 'Short' } })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const messageError = wrapper.find('#contact-message-error')
      expect(messageError.text()).toBe('Il messaggio deve contenere almeno 10 caratteri.')
    })

    it('accetta messaggio valido', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test',
          email: 'test@example.com',
          message: 'This is a valid message with more than 10 characters',
        },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const messageError = wrapper.find('#contact-email-error')
      expect(messageError.exists()).toBe(false)
    })

    it('conta correttamente gli errori', async () => {
      const { useAccessibilityAnnouncements } = await import(
        '@/composables/useAccessibilityAnnouncements'
      )
      const mockAnnounceError = vi.fn()
      vi.mocked(useAccessibilityAnnouncements).mockReturnValue({
        announceToScreenReader: vi.fn(),
        announceError: mockAnnounceError,
      })

      wrapper = mount(ContactForm)

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(mockAnnounceError).toHaveBeenCalledWith('3 errori di validazione')
    })

    it('annuncia singolo errore correttamente', async () => {
      const { useAccessibilityAnnouncements } = await import(
        '@/composables/useAccessibilityAnnouncements'
      )
      const mockAnnounceError = vi.fn()
      vi.mocked(useAccessibilityAnnouncements).mockReturnValue({
        announceToScreenReader: vi.fn(),
        announceError: mockAnnounceError,
      })

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: { name: '', email: 'test@example.com', message: 'Valid message' },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(mockAnnounceError).toHaveBeenCalledWith('1 errore di validazione')
    })
  })

  describe('Invio Form', () => {
    it('invia form con successo', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(fetch).toHaveBeenCalledWith('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        }),
      })

      expect(wrapper.vm.successMessage).toBe('Messaggio inviato con successo!')
      expect(wrapper.vm.form).toEqual({ name: '', email: '', message: '' })
    })

    it('gestisce errore di invio', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false }),
      } as Response)

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(wrapper.vm.errorMessage).toBe("Errore nell'invio del messaggio")
    })

    it('gestisce errore di rete', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(wrapper.vm.errorMessage).toBe("Errore nell'invio del messaggio")
    })

    it('mostra stato di caricamento', async () => {
      vi.mocked(fetch).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeUndefined()

      const submitPromise = wrapper.find('form').trigger('submit')
      await nextTick()

      expect(wrapper.vm.loading).toBe(true)
      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(submitButton.text()).toContain('Invio...')

      await submitPromise
      await nextTick()

      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('Accessibilità', () => {
    it('aggiorna attributi aria-invalid durante validazione', async () => {
      wrapper = mount(ContactForm)

      const nameInput = wrapper.find('input[type="text"]')
      expect(nameInput.attributes('aria-invalid')).toBe('false')

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(nameInput.attributes('aria-invalid')).toBe('true')
    })

    it('aggiorna aria-describedby quando ci sono errori', async () => {
      wrapper = mount(ContactForm)

      const nameInput = wrapper.find('input[type="text"]')
      expect(nameInput.attributes('aria-describedby')).toBeUndefined()

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(nameInput.attributes('aria-describedby')).toBe('contact-name-error')
    })

    it('annuncia stato di invio', async () => {
      const { useAccessibilityAnnouncements } = await import(
        '@/composables/useAccessibilityAnnouncements'
      )
      const mockAnnounceToScreenReader = vi.fn()
      vi.mocked(useAccessibilityAnnouncements).mockReturnValue({
        announceToScreenReader: mockAnnounceToScreenReader,
        announceError: vi.fn(),
      })

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(mockAnnounceToScreenReader).toHaveBeenCalledWith('Invio del messaggio in corso')
      expect(mockAnnounceToScreenReader).toHaveBeenCalledWith('Messaggio inviato con successo')
    })

    it('annuncia errori di invio', async () => {
      const { useAccessibilityAnnouncements } = await import(
        '@/composables/useAccessibilityAnnouncements'
      )
      const mockAnnounceError = vi.fn()
      vi.mocked(useAccessibilityAnnouncements).mockReturnValue({
        announceToScreenReader: vi.fn(),
        announceError: mockAnnounceError,
      })

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(mockAnnounceError).toHaveBeenCalledWith("Errore nell'invio del messaggio")
    })

    it('ha live region per annunci di stato', () => {
      wrapper = mount(ContactForm)

      const liveRegion = wrapper.find('[aria-live="polite"]')
      expect(liveRegion.exists()).toBe(true)
      expect(liveRegion.attributes('aria-atomic')).toBe('true')
    })

    it('ha live region per errori critici', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ errorMessage: 'Errore critico' })
      await nextTick()

      const errorRegion = wrapper.find('[aria-live="assertive"]')
      expect(errorRegion.exists()).toBe(true)
      expect(errorRegion.text()).toBe('Errore critico')
    })
  })

  describe('Focus Management', () => {
    it('focusa sul primo errore dopo validazione fallita', async () => {
      const mockFocus = vi.fn()
      Element.prototype.focus = mockFocus

      wrapper = mount(ContactForm)

      await wrapper.find('form').trigger('submit')
      await nextTick()

      // Simula il setTimeout nel componente
      await new Promise((resolve) => setTimeout(resolve, 20))

      expect(mockFocus).toHaveBeenCalled()
    })

    it('gestisce focus quando non ci sono errori', async () => {
      const mockFocus = vi.fn()
      Element.prototype.focus = mockFocus

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      await wrapper.find('form').trigger('submit')
      await nextTick()

      // Non dovrebbe chiamare focus
      expect(mockFocus).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('gestisce email con spazi', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: { name: 'Test', email: ' test@example.com ', message: 'Valid message' },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const emailError = wrapper.find('#contact-email-error')
      expect(emailError.exists()).toBe(false)
    })

    it('gestisce nome con spazi', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: { name: '  Test User  ', email: 'test@example.com', message: 'Valid message' },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const nameError = wrapper.find('#contact-name-error')
      expect(nameError.exists()).toBe(false)
    })

    it('gestisce messaggio con solo spazi', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({ form: { name: 'Test', email: 'test@example.com', message: '   ' } })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const messageError = wrapper.find('#contact-message-error')
      expect(messageError.text()).toBe('Il messaggio è obbligatorio.')
    })

    it('gestisce email con caratteri speciali', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: { name: 'Test', email: 'test+tag@example.com', message: 'Valid message' },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const emailError = wrapper.find('#contact-email-error')
      expect(emailError.exists()).toBe(false)
    })

    it('gestisce email con dominio locale', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: { name: 'Test', email: 'test@localhost', message: 'Valid message' },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const emailError = wrapper.find('#contact-email-error')
      expect(emailError.exists()).toBe(false)
    })

    it('gestisce messaggio molto lungo', async () => {
      const longMessage = 'A'.repeat(10000)

      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: { name: 'Test', email: 'test@example.com', message: longMessage },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const messageError = wrapper.find('#contact-message-error')
      expect(messageError.exists()).toBe(false)
    })

    it('gestisce caratteri Unicode nel nome', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: { name: 'José María', email: 'test@example.com', message: 'Valid message' },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const nameError = wrapper.find('#contact-name-error')
      expect(nameError.exists()).toBe(false)
    })

    it('gestisce caratteri Unicode nel messaggio', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        form: {
          name: 'Test',
          email: 'test@example.com',
          message: 'Messaggio con caratteri speciali: àèéìòù',
        },
      })
      await wrapper.find('form').trigger('submit')
      await nextTick()

      const messageError = wrapper.find('#contact-message-error')
      expect(messageError.exists()).toBe(false)
    })
  })

  describe('Performance', () => {
    it('pulisce messaggi precedenti prima di nuovo invio', async () => {
      wrapper = mount(ContactForm)

      await wrapper.setData({
        successMessage: 'Previous success',
        errorMessage: 'Previous error',
        liveAnnouncement: 'Previous announcement',
      })

      await wrapper.setData({
        form: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        },
      })

      await wrapper.find('form').trigger('submit')
      await nextTick()

      expect(wrapper.vm.successMessage).toBe('')
      expect(wrapper.vm.errorMessage).toBe('')
      expect(wrapper.vm.liveAnnouncement).toBe('')
    })

    it('usa debouncing per focus management', async () => {
      const mockFocus = vi.fn()
      Element.prototype.focus = mockFocus

      wrapper = mount(ContactForm)

      await wrapper.find('form').trigger('submit')
      await nextTick()

      // Il focus dovrebbe essere chiamato dopo un breve delay
      expect(mockFocus).not.toHaveBeenCalled()

      await new Promise((resolve) => setTimeout(resolve, 20))
      expect(mockFocus).toHaveBeenCalled()
    })
  })

  describe('Internazionalizzazione', () => {
    it('usa traduzioni corrette', () => {
      const { useI18n } = require('vue-i18n')
      const mockT = vi.fn((key: string) => key)
      vi.mocked(useI18n).mockReturnValue({ t: mockT })

      wrapper = mount(ContactForm)

      expect(mockT).toHaveBeenCalledWith('contact.form.name')
      expect(mockT).toHaveBeenCalledWith('contact.form.email')
      expect(mockT).toHaveBeenCalledWith('contact.form.message')
      expect(mockT).toHaveBeenCalledWith('contact.form.submit')
    })

    it('gestisce traduzioni mancanti', () => {
      const { useI18n } = require('vue-i18n')
      const mockT = vi.fn((key: string) => key) // Ritorna la chiave se non trova traduzione
      vi.mocked(useI18n).mockReturnValue({ t: mockT })

      wrapper = mount(ContactForm)

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toBe('contact.form.submit')
    })
  })
})
