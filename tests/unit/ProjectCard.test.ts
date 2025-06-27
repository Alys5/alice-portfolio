import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'

// Mock dei composables
vi.mock('@/composables/useIntersectionObserver', () => ({
  useIntersectionObserver: vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
  })),
}))

vi.mock('@/composables/useUserPreferences', () => ({
  useUserPreferences: vi.fn(() => ({
    preferences: { reducedMotion: false },
  })),
}))

describe('ProjectCard.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectCard>>

  const defaultProps = {
    imgSrc: '/test-image.jpg',
    imgAlt: 'Test image',
    title: 'Test Project',
    interactive: true,
    ariaLabel: 'Test project card',
  }

  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 300,
      height: 200,
      right: 300,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }))
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('rende correttamente con props di base', () => {
      wrapper = mount(ProjectCard, {
        props: defaultProps,
      })

      expect(wrapper.find('.project-card').exists()).toBe(true)
      expect(wrapper.find('.project-card__title').text()).toBe('Test Project')
      expect(wrapper.find('.project-card__image').attributes('src')).toBe('/test-image.jpg')
      expect(wrapper.find('.project-card__image').attributes('alt')).toBe('Test image')
    })

    it('rende senza titolo quando non fornito', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, title: undefined },
      })

      expect(wrapper.find('.project-card__title').exists()).toBe(false)
    })

    it('rende con aria-label personalizzato', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, ariaLabel: 'Custom aria label' },
      })

      expect(wrapper.find('.project-card').attributes('aria-label')).toBe('Custom aria label')
    })

    it('rende con role corretto in base a interactive', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })
      expect(wrapper.find('.project-card').attributes('role')).toBe('button')

      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: false },
      })
      expect(wrapper.find('.project-card').attributes('role')).toBe('article')
    })

    it('rende con tabindex corretto', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })
      expect(wrapper.find('.project-card').attributes('tabindex')).toBe('0')

      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: false },
      })
      expect(wrapper.find('.project-card').attributes('tabindex')).toBeUndefined()
    })
  })

  describe('Slots', () => {
    it('rende slot di default', () => {
      wrapper = mount(ProjectCard, {
        props: defaultProps,
        slots: {
          default: '<p>Custom content</p>',
        },
      })

      expect(wrapper.find('.project-card__body p').text()).toBe('Custom content')
    })

    it('rende slot header personalizzato', () => {
      wrapper = mount(ProjectCard, {
        props: defaultProps,
        slots: {
          header: '<h4>Custom header</h4>',
        },
      })

      expect(wrapper.find('.project-card__header h4').text()).toBe('Custom header')
      expect(wrapper.find('.project-card__title').exists()).toBe(false)
    })

    it('rende slot footer', () => {
      wrapper = mount(ProjectCard, {
        props: defaultProps,
        slots: {
          footer: '<button>Action</button>',
        },
      })

      expect(wrapper.find('.project-card__footer button').text()).toBe('Action')
    })
  })

  describe('Lazy Loading', () => {
    it('mostra skeleton inizialmente', () => {
      wrapper = mount(ProjectCard, {
        props: defaultProps,
      })

      expect(wrapper.find('.project-card__image-skeleton').exists()).toBe(true)
      expect(wrapper.find('.project-card__image').exists()).toBe(false)
    })

    it('mostra immagine quando visibile', async () => {
      wrapper = mount(ProjectCard, {
        props: defaultProps,
      })

      // Simula che l'immagine diventi visibile
      await wrapper.setData({ imageVisible: true })
      await nextTick()

      expect(wrapper.find('.project-card__image-skeleton').exists()).toBe(false)
      expect(wrapper.find('.project-card__image').exists()).toBe(true)
    })
  })

  describe('Interazioni', () => {
    it('emette evento click quando interactive', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      await wrapper.find('.project-card').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('non emette evento click quando non interactive', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: false },
      })

      await wrapper.find('.project-card').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('gestisce click da tastiera (Enter)', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      await wrapper.find('.project-card').trigger('keydown.enter')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('gestisce click da tastiera (Space)', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      await wrapper.find('.project-card').trigger('keydown.space')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Ripple Effect', () => {
    it('crea ripple su mousedown', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 50,
      })

      await wrapper.find('.project-card__ripple-container').trigger('mousedown', mouseEvent)
      await nextTick()

      expect(wrapper.vm.ripples.length).toBe(1)
    })

    it('crea ripple su touchstart', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 50 } as Touch],
      })

      await wrapper.find('.project-card__ripple-container').trigger('touchstart', touchEvent)
      await nextTick()

      expect(wrapper.vm.ripples.length).toBe(1)
    })

    it('non crea ripple con prefers-reduced-motion', async () => {
      const { useUserPreferences } = await import('@/composables/useUserPreferences')
      vi.mocked(useUserPreferences).mockReturnValue({
        preferences: { reducedMotion: true },
      })

      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 50,
      })

      await wrapper.find('.project-card__ripple-container').trigger('mousedown', mouseEvent)
      await nextTick()

      expect(wrapper.vm.ripples.length).toBe(0)
    })

    it('rimuove ripple dopo animazione', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      // Aggiungi un ripple manualmente
      wrapper.vm.ripples = [{ id: 1, style: {} }]

      await wrapper.vm.removeRipple(1)
      expect(wrapper.vm.ripples.length).toBe(0)
    })
  })

  describe('Magnetic Hover', () => {
    it('applica offset magnetico su mousemove', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 100,
      })

      await wrapper.find('.project-card__magnetic').trigger('mousemove', mouseEvent)
      await nextTick()

      expect(wrapper.vm.magneticOffset.x).not.toBe(0)
      expect(wrapper.vm.magneticOffset.y).not.toBe(0)
    })

    it('resetta offset magnetico su mouseleave', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      // Imposta un offset iniziale
      wrapper.vm.magneticOffset = { x: 10, y: 10 }

      await wrapper.find('.project-card__magnetic').trigger('mouseleave')
      await nextTick()

      expect(wrapper.vm.magneticOffset.x).toBe(0)
      expect(wrapper.vm.magneticOffset.y).toBe(0)
    })

    it('non applica magnetic hover con prefers-reduced-motion', async () => {
      const { useUserPreferences } = await import('@/composables/useUserPreferences')
      vi.mocked(useUserPreferences).mockReturnValue({
        preferences: { reducedMotion: true },
      })

      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 100,
      })

      await wrapper.find('.project-card__magnetic').trigger('mousemove', mouseEvent)
      await nextTick()

      expect(wrapper.vm.magneticOffset.x).toBe(0)
      expect(wrapper.vm.magneticOffset.y).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('gestisce getBoundingClientRect null', async () => {
      Element.prototype.getBoundingClientRect = vi.fn(() => null as unknown as DOMRect)

      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 50,
      })

      // Non dovrebbe lanciare errori
      await wrapper.find('.project-card__ripple-container').trigger('mousedown', mouseEvent)
      expect(wrapper.vm.ripples.length).toBe(0)
    })

    it('gestisce touch event senza touches', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const touchEvent = new TouchEvent('touchstart', {
        touches: [],
      })

      await wrapper.find('.project-card__ripple-container').trigger('touchstart', touchEvent)
      expect(wrapper.vm.ripples.length).toBe(0)
    })

    it('gestisce immagine con src vuoto', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, imgSrc: '' },
      })

      expect(wrapper.find('.project-card__image').attributes('src')).toBe('')
    })

    it('gestisce aria-label vuoto', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, ariaLabel: '' },
      })

      expect(wrapper.find('.project-card').attributes('aria-label')).toBe('')
    })

    it('gestisce componenti non interattivi senza ripple/magnetic', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: false },
      })

      expect(wrapper.find('.project-card__ripple-container').exists()).toBe(false)
      expect(wrapper.find('.project-card__magnetic').exists()).toBe(false)
    })
  })

  describe('Accessibilità', () => {
    it('ha attributi ARIA corretti', () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const card = wrapper.find('.project-card')
      expect(card.attributes('role')).toBe('button')
      expect(card.attributes('aria-label')).toBe('Test project card')
      expect(card.attributes('tabindex')).toBe('0')
    })

    it('supporta navigazione da tastiera', async () => {
      wrapper = mount(ProjectCard, {
        props: { ...defaultProps, interactive: true },
      })

      const card = wrapper.find('.project-card')

      // Test focus
      await card.trigger('focus')
      expect(card.element).toBe(document.activeElement)

      // Test keyboard events
      await card.trigger('keydown.enter')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('usa will-change per ottimizzazioni', () => {
      wrapper = mount(ProjectCard, {
        props: defaultProps,
      })

      const card = wrapper.find('.project-card')
      expect(card.attributes('style')).toContain('will-change')
    })

    it('pulisce observer su unmount', async () => {
      const { useIntersectionObserver } = await import('@/composables/useIntersectionObserver')
      const mockUnobserve = vi.fn()
      vi.mocked(useIntersectionObserver).mockReturnValue({
        observe: vi.fn(),
        unobserve: mockUnobserve,
      })

      wrapper = mount(ProjectCard, {
        props: defaultProps,
      })

      wrapper.unmount()
      expect(mockUnobserve).toHaveBeenCalled()
    })
  })
})
