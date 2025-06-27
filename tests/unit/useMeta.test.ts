import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMeta } from '@/composables/useMeta'

// Mock del DOM
const mockMetaElement = {
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
}

const mockLinkElement = {
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
}

// Mock di document
const mockDocument = {
  title: '',
  head: {
    appendChild: vi.fn(),
    querySelector: vi.fn(),
  },
  querySelector: vi.fn(),
  createElement: vi.fn(),
}

// Mock di window
const mockWindow = {
  location: {
    href: 'https://alys5.eu/test',
  },
}

// Mock di Vue Router
const mockRoute = {
  path: '/test',
  params: { slug: 'test-post' },
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}))

describe('useMeta', () => {
  beforeEach(() => {
    // Reset dei mock
    vi.clearAllMocks()

    // Mock di document
    global.document = mockDocument as unknown as Document
    global.window = mockWindow as unknown as Window & typeof globalThis

    // Mock di querySelector per meta tag
    mockDocument.querySelector.mockImplementation((selector: string) => {
      if (selector.includes('meta')) {
        return mockMetaElement
      }
      if (selector.includes('link[rel="canonical"]')) {
        return mockLinkElement
      }
      return null
    })

    // Mock di createElement
    mockDocument.createElement.mockImplementation((tag: string) => {
      if (tag === 'meta') {
        return mockMetaElement
      }
      if (tag === 'link') {
        return mockLinkElement
      }
      return {}
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('dovrebbe inizializzare con i meta tag di default', () => {
    const { currentMeta } = useMeta()

    expect(currentMeta.value.title).toBe(
      'Alice Mandelli - UI Developer & AI Strategist | Portfolio 2025',
    )
    expect(currentMeta.value.description).toContain('UI Developer e AI Strategist')
    expect(currentMeta.value.author).toBe('Alice Mandelli')
  })

  it('dovrebbe impostare il title del documento', () => {
    const { setMeta } = useMeta()

    setMeta({ title: 'Test Title' })

    expect(document.title).toBe('Test Title')
  })

  it('dovrebbe impostare i meta tag standard', () => {
    const { setMeta } = useMeta()

    setMeta({
      description: 'Test description',
      keywords: 'test, keywords',
      author: 'Test Author',
      robots: 'noindex, nofollow',
    })

    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'Test description')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'test, keywords')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'Test Author')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'noindex, nofollow')
  })

  it('dovrebbe impostare i meta tag Open Graph', () => {
    const { setMeta } = useMeta()

    setMeta({
      ogTitle: 'OG Title',
      ogDescription: 'OG Description',
      ogImage: 'https://example.com/image.jpg',
      ogType: 'article',
    })

    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'OG Title')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'OG Description')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith(
      'content',
      'https://example.com/image.jpg',
    )
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'article')
  })

  it('dovrebbe impostare i meta tag Twitter', () => {
    const { setMeta } = useMeta()

    setMeta({
      twitterTitle: 'Twitter Title',
      twitterDescription: 'Twitter Description',
      twitterCard: 'summary_large_image',
    })

    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'Twitter Title')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'Twitter Description')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'summary_large_image')
  })

  it('dovrebbe impostare il link canonical', () => {
    const { setMeta } = useMeta()

    setMeta({ canonical: 'https://example.com/canonical' })

    expect(mockLinkElement.setAttribute).toHaveBeenCalledWith(
      'href',
      'https://example.com/canonical',
    )
  })

  it('dovrebbe generare URL automatici per setPageMeta', () => {
    const { setPageMeta } = useMeta()

    setPageMeta({
      title: 'Page Title',
      description: 'Page Description',
    })

    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'https://alys5.eu/test')
  })

  it('dovrebbe impostare meta tag per post del blog', () => {
    const { setBlogPostMeta } = useMeta()

    setBlogPostMeta({
      title: 'Blog Post Title',
      description: 'Blog post description',
      author: 'Alice Mandelli',
      publishedAt: '2025-01-15',
      tags: ['Vue.js', 'Design'],
    })

    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith(
      'content',
      'Blog Post Title | Alice Mandelli Blog',
    )
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'Blog post description')
    expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', 'Vue.js, Design')
  })

  it('dovrebbe resettare ai valori di default', () => {
    const { setMeta, resetMeta } = useMeta()

    // Imposta valori personalizzati
    setMeta({ title: 'Custom Title' })
    expect(document.title).toBe('Custom Title')

    // Resetta ai valori di default
    resetMeta()
    expect(document.title).toBe('Alice Mandelli - UI Developer & AI Strategist | Portfolio 2025')
  })

  it('dovrebbe gestire meta tag vuoti senza errori', () => {
    const { setMeta } = useMeta()

    expect(() => {
      setMeta({
        title: '',
        description: undefined,
        keywords: null as unknown as string,
      })
    }).not.toThrow()
  })
})
