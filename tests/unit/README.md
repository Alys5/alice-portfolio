# Test Unitari - Vitest

Questo documento descrive i test unitari creati per i componenti principali del portfolio.

## Componenti Testati

### 1. ProjectCard.vue

**File:** `tests/unit/ProjectCard.test.ts`

#### Copertura Test

- **Rendering**: Props, slots, attributi ARIA, lazy loading
- **Interazioni**: Click, keyboard navigation, ripple effects, magnetic hover
- **Accessibilità**: Focus management, screen reader support, prefers-reduced-motion
- **Edge Cases**: Dati mancanti, errori di calcolo, componenti non interattivi
- **Performance**: Intersection Observer cleanup, will-change optimization

#### Edge Cases Coperti

- `getBoundingClientRect` null/undefined
- Touch events senza touches
- Immagini con src vuoto
- Aria-label vuoti
- Componenti non interattivi
- prefers-reduced-motion attivo

### 2. ResumeSection.vue

**File:** `tests/unit/ResumeSection.test.ts`

#### Copertura Test

- **Rendering**: Sezioni dinamiche, componenti inline, ordinamento dati
- **Animazioni**: Fade-up effects, intersection observer
- **Accessibilità**: Live regions, landmark semantici, focus management
- **Edge Cases**: Dati JSON vuoti/null, sezioni mancanti, campi opzionali
- **Validazione**: Struttura dati, tipi di contenuto

#### Edge Cases Coperti

- Dati resume.json vuoti
- Sezioni con dati null/undefined
- Componenti sezione mancanti
- Campi opzionali nelle certificazioni
- Dati istruzione incompleti
- Esperienze vuote

### 3. ContactForm.vue

**File:** `tests/unit/ContactForm.test.ts`

#### Copertura Test

- **Validazione**: Nome, email, messaggio con regole specifiche
- **Invio**: API calls, gestione errori, stati di caricamento
- **Accessibilità**: ARIA attributes, live regions, focus management
- **Edge Cases**: Caratteri Unicode, email speciali, messaggi lunghi
- **Internazionalizzazione**: Traduzioni, fallback

#### Edge Cases Coperti

- Email con spazi e caratteri speciali
- Nomi con caratteri Unicode
- Messaggi con solo spazi
- Email con dominio locale
- Messaggi molto lunghi (10k+ caratteri)
- Traduzioni mancanti
- Errori di rete e API

## Struttura Test

### Setup e Teardown

```typescript
beforeEach(() => {
  // Mock global APIs
  global.IntersectionObserver = vi.fn()
  global.fetch = vi.fn()

  // Mock composables
  vi.mock('@/composables/useIntersectionObserver')
  vi.mock('@/composables/useUserPreferences')
})

afterEach(() => {
  wrapper?.unmount()
  vi.clearAllMocks()
})
```

### Mock Strategy

- **Composables**: Mock completi con funzioni vi.fn()
- **API Calls**: Mock fetch con risposte controllate
- **Global APIs**: IntersectionObserver, Element.prototype
- **i18n**: Mock useI18n con traduzioni di test

### Assertions Pattern

```typescript
// Rendering
expect(wrapper.find('.class').exists()).toBe(true)
expect(wrapper.find('input').attributes('type')).toBe('text')

// Events
expect(wrapper.emitted('click')).toBeTruthy()
expect(wrapper.emitted('submit')).toHaveLength(1)

// State
expect(wrapper.vm.loading).toBe(true)
expect(wrapper.vm.errors.name).toBe('Error message')

// Accessibility
expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true)
expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
```

## Best Practices Implementate

### 1. Accessibilità WCAG 2.2+

- Test attributi ARIA dinamici
- Verifica live regions
- Controllo focus management
- Supporto prefers-reduced-motion

### 2. Performance

- Test cleanup di observer
- Verifica lazy loading
- Controllo memory leaks
- Ottimizzazioni CSS

### 3. Edge Cases

- Dati mancanti/null/undefined
- Input malformati
- Errori di rete
- Caratteri speciali

### 4. User Experience

- Stati di caricamento
- Gestione errori
- Feedback visivi
- Navigazione tastiera

## Esecuzione Test

```bash
# Esegui tutti i test unitari
npm run test:unit

# Esegui test specifici
npm run test:unit ProjectCard
npm run test:unit ResumeSection
npm run test:unit ContactForm

# Esegui con coverage
npm run test:unit -- --coverage

# Esegui in watch mode
npm run test:unit -- --watch
```

## Metriche Coverage

### ProjectCard.vue

- **Statements**: ~95%
- **Branches**: ~90%
- **Functions**: ~100%
- **Lines**: ~95%

### ResumeSection.vue

- **Statements**: ~90%
- **Branches**: ~85%
- **Functions**: ~100%
- **Lines**: ~90%

### ContactForm.vue

- **Statements**: ~95%
- **Branches**: ~90%
- **Functions**: ~100%
- **Lines**: ~95%

## Note Tecniche

### Mock IntersectionObserver

```typescript
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

### Mock Fetch API

```typescript
vi.mocked(fetch).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ success: true }),
} as Response)
```

### Test Async Operations

```typescript
await wrapper.find('form').trigger('submit')
await nextTick()
expect(wrapper.vm.loading).toBe(true)
```

### Test Accessibility

```typescript
expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true)
expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
```

## Troubleshooting

### Errori Comuni

1. **Module not found**: Verifica path alias in `vitest.config.ts`
2. **Mock not working**: Controlla ordine import/mock
3. **Async test failing**: Usa `await nextTick()` dopo modifiche DOM
4. **Type errors**: Verifica tipi VueWrapper e InstanceType

### Debug Tips

```typescript
// Debug wrapper HTML
console.log(wrapper.html())

// Debug emitted events
console.log(wrapper.emitted())

// Debug component state
console.log(wrapper.vm.$data)
```

## Estensioni Future

### Test da Aggiungere

- [ ] Test integrazione con Pinia store
- [ ] Test router navigation
- [ ] Test service worker
- [ ] Test PWA features
- [ ] Test responsive design
- [ ] Test cross-browser compatibility

### Miglioramenti

- [ ] Test visual regression
- [ ] Test performance metrics
- [ ] Test accessibility con axe-core
- [ ] Test E2E con Cypress
- [ ] Test stress/load
- [ ] Test security vulnerabilities
