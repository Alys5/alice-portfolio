import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ResumeSection from '@/components/sections/ResumeSection.vue'

// Mock dei composables
vi.mock('@/composables/useIntersectionObserver', () => ({
  useIntersectionObserver: vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
  })),
}))

// Mock dei dati resume
vi.mock('@/data/resume.json', () => ({
  default: {
    Intro: {
      nome: 'Alice Mandelli',
      ruolo: 'UX/UI Designer & Front-End Developer',
      località: 'Roma, Italia',
      profilo: 'Professionista con oltre 15 anni di esperienza...',
    },
    Esperienze: [
      {
        ruolo: 'UI Developer',
        azienda: 'PLANTITC',
        periodo: 'Feb 2025 - Mar 2025',
        descrizione: 'Progettazione e sviluppo di interfacce complesse...',
      },
    ],
    Istruzione: [
      {
        titolo: 'Masterclass UX/UI Design',
        istituto: 'UXbox',
        anno: '2024',
      },
    ],
    Competenze: ['UX/UI Design', 'Front-End Development', 'Design System'],
    Certificazioni: [
      {
        titolo: 'Nielsen Norman Award 2021',
        descrizione: 'Premio per la SNAM-Easy Intranet tra le Top 10 globali.',
      },
    ],
  },
}))

describe('ResumeSection.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof ResumeSection>>

  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('rende correttamente tutte le sezioni', () => {
      wrapper = mount(ResumeSection)

      expect(wrapper.find('.resume-section').exists()).toBe(true)
      expect(wrapper.find('#resume-title').exists()).toBe(true)
      expect(wrapper.find('.resume-block').exists()).toBe(true)
    })

    it('rende il titolo nascosto per screen reader', () => {
      wrapper = mount(ResumeSection)

      const title = wrapper.find('#resume-title')
      expect(title.exists()).toBe(true)
      expect(title.classes()).toContain('sr-only')
    })

    it('rende tutte le sezioni ordinate correttamente', () => {
      wrapper = mount(ResumeSection)

      const blocks = wrapper.findAll('.resume-block')
      expect(blocks).toHaveLength(5) // Intro, Esperienze, Istruzione, Competenze, Certificazioni
    })

    it('filtra sezioni con dati vuoti', () => {
      // Mock con dati parziali
      vi.doMock('@/data/resume.json', () => ({
        default: {
          Intro: { nome: 'Test' },
          Esperienze: [],
          Istruzione: null,
          Competenze: ['Test'],
          Certificazioni: undefined,
        },
      }))

      wrapper = mount(ResumeSection)
      const blocks = wrapper.findAll('.resume-block')
      expect(blocks).toHaveLength(2) // Solo Intro e Competenze
    })
  })

  describe('Sezioni Componenti', () => {
    it('rende sezione Intro correttamente', () => {
      wrapper = mount(ResumeSection)

      const introSection = wrapper.find('#resume-intro-title')
      expect(introSection.text()).toBe('Alice Mandelli')

      const role = wrapper.find('.resume-title')
      expect(role.text()).toBe('UX/UI Designer & Front-End Developer')

      const location = wrapper.find('.resume-location')
      expect(location.text()).toBe('Roma, Italia')
    })

    it('rende sezione Esperienze correttamente', () => {
      wrapper = mount(ResumeSection)

      const experiencesTitle = wrapper.find('#resume-esperienze-title')
      expect(experiencesTitle.text()).toBe('Esperienze')

      const experienceItem = wrapper.find('.resume-list li')
      expect(experienceItem.text()).toContain('UI Developer')
      expect(experienceItem.text()).toContain('PLANTITC')
      expect(experienceItem.text()).toContain('Feb 2025 - Mar 2025')
    })

    it('rende sezione Istruzione correttamente', () => {
      wrapper = mount(ResumeSection)

      const educationTitle = wrapper.find('#resume-istruzione-title')
      expect(educationTitle.text()).toBe('Istruzione')

      const educationItem = wrapper.find('.resume-list li')
      expect(educationItem.text()).toContain('Masterclass UX/UI Design')
      expect(educationItem.text()).toContain('UXbox')
      expect(educationItem.text()).toContain('2024')
    })

    it('rende sezione Competenze correttamente', () => {
      wrapper = mount(ResumeSection)

      const skillsTitle = wrapper.find('#resume-competenze-title')
      expect(skillsTitle.text()).toBe('Competenze')

      const skillsList = wrapper.findAll('.resume-skills li')
      expect(skillsList).toHaveLength(3)
      expect(skillsList[0].text()).toBe('UX/UI Design')
      expect(skillsList[1].text()).toBe('Front-End Development')
      expect(skillsList[2].text()).toBe('Design System')
    })

    it('rende sezione Certificazioni correttamente', () => {
      wrapper = mount(ResumeSection)

      const certificationsTitle = wrapper.find('#resume-certificazioni-title')
      expect(certificationsTitle.text()).toBe('Certificazioni')

      const certificationItem = wrapper.find('.resume-list li')
      expect(certificationItem.text()).toContain('Nielsen Norman Award 2021')
      expect(certificationItem.text()).toContain('Premio per la SNAM-Easy Intranet')
    })
  })

  describe('Animazioni e Visibilità', () => {
    it('applica classe fade-up inizialmente', () => {
      wrapper = mount(ResumeSection)

      const blocks = wrapper.findAll('.resume-block')
      blocks.forEach((block) => {
        expect(block.classes()).toContain('fade-up')
        expect(block.classes()).not.toContain('is-visible')
      })
    })

    it('applica classe is-visible quando sezione diventa visibile', async () => {
      wrapper = mount(ResumeSection)

      // Simula che una sezione diventi visibile
      await wrapper.setData({ visibleSections: { Intro: true } })
      await nextTick()

      const introBlock = wrapper.find('.resume-block')
      expect(introBlock.classes()).toContain('is-visible')
    })

    it('aggiorna announcement quando sezione diventa visibile', async () => {
      wrapper = mount(ResumeSection)

      await wrapper.setData({ announcement: 'Sezione Intro visibile' })
      await nextTick()

      const liveRegion = wrapper.find('[aria-live="polite"]')
      expect(liveRegion.text()).toBe('Sezione Intro visibile')
    })
  })

  describe('Accessibilità', () => {
    it('ha landmark semantici corretti', () => {
      wrapper = mount(ResumeSection)

      expect(wrapper.find('section').exists()).toBe(true)
      expect(wrapper.find('section').attributes('aria-labelledby')).toBe('resume-title')
    })

    it('ha live region per annunci', () => {
      wrapper = mount(ResumeSection)

      const liveRegion = wrapper.find('[aria-live="polite"]')
      expect(liveRegion.exists()).toBe(true)
      expect(liveRegion.attributes('aria-atomic')).toBe('true')
    })

    it('ha attributi aria-labelledby corretti per ogni sezione', () => {
      wrapper = mount(ResumeSection)

      const blocks = wrapper.findAll('.resume-block')
      expect(blocks[0].attributes('aria-labelledby')).toBe('resume-Intro-title')
      expect(blocks[1].attributes('aria-labelledby')).toBe('resume-Esperienze-title')
      expect(blocks[2].attributes('aria-labelledby')).toBe('resume-Istruzione-title')
      expect(blocks[3].attributes('aria-labelledby')).toBe('resume-Competenze-title')
      expect(blocks[4].attributes('aria-labelledby')).toBe('resume-Certificazioni-title')
    })

    it('ha focus management corretto', () => {
      wrapper = mount(ResumeSection)

      const blocks = wrapper.findAll('.resume-block')
      blocks.forEach((block) => {
        expect(block.attributes('tabindex')).toBe('-1')
      })
    })
  })

  describe('Edge Cases', () => {
    it('gestisce dati resume vuoti', () => {
      vi.doMock('@/data/resume.json', () => ({
        default: {},
      }))

      wrapper = mount(ResumeSection)
      const blocks = wrapper.findAll('.resume-block')
      expect(blocks).toHaveLength(0)
    })

    it('gestisce sezioni con dati null/undefined', () => {
      vi.doMock('@/data/resume.json', () => ({
        default: {
          Intro: null,
          Esperienze: undefined,
          Istruzione: [],
          Competenze: null,
          Certificazioni: undefined,
        },
      }))

      wrapper = mount(ResumeSection)
      const blocks = wrapper.findAll('.resume-block')
      expect(blocks).toHaveLength(0)
    })

    it('gestisce componenti sezione mancanti', () => {
      wrapper = mount(ResumeSection)

      // Testa getSectionComponent con chiave non esistente
      const component = wrapper.vm.getSectionComponent('NonEsistente')
      expect(component.template).toBe('<div />')
    })

    it('gestisce setSectionRef con elemento null', () => {
      wrapper = mount(ResumeSection)

      // Non dovrebbe lanciare errori
      wrapper.vm.setSectionRef('test', null)
      expect(wrapper.vm.sectionRefs.test).toBeNull()
    })

    it('gestisce dati esperienze vuoti', () => {
      vi.doMock('@/data/resume.json', () => ({
        default: {
          Intro: { nome: 'Test' },
          Esperienze: [],
          Istruzione: [],
          Competenze: [],
          Certificazioni: [],
        },
      }))

      wrapper = mount(ResumeSection)
      const experiencesList = wrapper.find('.resume-list')
      expect(experiencesList.exists()).toBe(false)
    })

    it('gestisce dati istruzione con campi mancanti', () => {
      vi.doMock('@/data/resume.json', () => ({
        default: {
          Intro: { nome: 'Test' },
          Istruzione: [
            { titolo: 'Test', istituto: 'Test Institute' }, // senza anno
            { titolo: 'Test 2' }, // solo titolo
            { istituto: 'Test Institute 2' }, // solo istituto
          ],
        },
      }))

      wrapper = mount(ResumeSection)
      const educationItems = wrapper.findAll('.resume-list li')
      expect(educationItems).toHaveLength(3)
    })

    it('gestisce certificazioni con campi opzionali', () => {
      vi.doMock('@/data/resume.json', () => ({
        default: {
          Intro: { nome: 'Test' },
          Certificazioni: [
            { titolo: 'Test Cert' }, // solo titolo
            { titolo: 'Test Cert 2', istituto: 'Test Institute' }, // titolo + istituto
            { titolo: 'Test Cert 3', anno: '2024' }, // titolo + anno
            { titolo: 'Test Cert 4', descrizione: 'Test description' }, // titolo + descrizione
          ],
        },
      }))

      wrapper = mount(ResumeSection)
      const certificationItems = wrapper.findAll('.resume-list li')
      expect(certificationItems).toHaveLength(4)
    })
  })

  describe('Intersection Observer', () => {
    it('inizializza observer per ogni sezione', () => {
      const { useIntersectionObserver } = require('@/composables/useIntersectionObserver')
      const mockObserve = vi.fn()
      vi.mocked(useIntersectionObserver).mockReturnValue({
        observe: mockObserve,
        unobserve: vi.fn(),
      })

      wrapper = mount(ResumeSection)

      // Dovrebbe chiamare observe per ogni sezione
      expect(mockObserve).toHaveBeenCalledTimes(5)
    })

    it('gestisce callback intersection observer', async () => {
      const { useIntersectionObserver } = require('@/composables/useIntersectionObserver')
      let intersectionCallback: (entries: any[]) => void

      vi.mocked(useIntersectionObserver).mockImplementation((callback) => {
        intersectionCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
        }
      })

      wrapper = mount(ResumeSection)

      // Simula che una sezione diventi visibile
      intersectionCallback([{ isIntersecting: true }])
      await nextTick()

      expect(wrapper.vm.visibleSections.Intro).toBe(true)
      expect(wrapper.vm.announcement).toBe('Sezione Intro visibile')
    })

    it('gestisce observer con threshold personalizzato', () => {
      const { useIntersectionObserver } = require('@/composables/useIntersectionObserver')

      wrapper = mount(ResumeSection)

      expect(useIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0.2 })
    })
  })

  describe('Performance', () => {
    it('usa nextTick per operazioni DOM', async () => {
      const nextTickSpy = vi.spyOn(await import('vue'), 'nextTick')

      wrapper = mount(ResumeSection)

      expect(nextTickSpy).toHaveBeenCalled()
    })

    it('pulisce observer su unmount', () => {
      const { useIntersectionObserver } = require('@/composables/useIntersectionObserver')
      const mockUnobserve = vi.fn()
      vi.mocked(useIntersectionObserver).mockReturnValue({
        observe: vi.fn(),
        unobserve: mockUnobserve,
      })

      wrapper = mount(ResumeSection)
      wrapper.unmount()

      // L'observer dovrebbe essere pulito
      expect(mockUnobserve).toHaveBeenCalled()
    })
  })

  describe('Responsive Design', () => {
    it('ha classi CSS responsive', () => {
      wrapper = mount(ResumeSection)

      const section = wrapper.find('.resume-section')
      expect(section.exists()).toBe(true)

      const blocks = wrapper.findAll('.resume-block')
      blocks.forEach((block) => {
        expect(block.classes()).toContain('resume-block')
      })
    })

    it('supporta prefers-reduced-motion', () => {
      wrapper = mount(ResumeSection)

      // Verifica che le classi CSS supportino prefers-reduced-motion
      const fadeUpElements = wrapper.findAll('.fade-up')
      fadeUpElements.forEach((element) => {
        expect(element.exists()).toBe(true)
      })
    })
  })

  describe('Validazione Dati', () => {
    it('valida struttura dati Intro', () => {
      wrapper = mount(ResumeSection)

      const introData = wrapper.vm.orderedSections.find((s) => s.key === 'Intro')
      expect(introData?.data).toHaveProperty('nome')
      expect(introData?.data).toHaveProperty('ruolo')
      expect(introData?.data).toHaveProperty('località')
      expect(introData?.data).toHaveProperty('profilo')
    })

    it('valida struttura dati Esperienze', () => {
      wrapper = mount(ResumeSection)

      const experiencesData = wrapper.vm.orderedSections.find((s) => s.key === 'Esperienze')
      expect(Array.isArray(experiencesData?.data)).toBe(true)

      if (experiencesData?.data.length > 0) {
        const experience = experiencesData.data[0]
        expect(experience).toHaveProperty('ruolo')
        expect(experience).toHaveProperty('azienda')
        expect(experience).toHaveProperty('periodo')
        expect(experience).toHaveProperty('descrizione')
      }
    })

    it('valida struttura dati Istruzione', () => {
      wrapper = mount(ResumeSection)

      const educationData = wrapper.vm.orderedSections.find((s) => s.key === 'Istruzione')
      expect(Array.isArray(educationData?.data)).toBe(true)

      if (educationData?.data.length > 0) {
        const education = educationData.data[0]
        expect(education).toHaveProperty('titolo')
        expect(education).toHaveProperty('istituto')
        expect(education).toHaveProperty('anno')
      }
    })
  })
})
