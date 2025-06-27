# Spec Cypress: Flusso Utente Completo

## Descrizione

Questo spec Cypress (`complete-user-flow.cy.js`) testa il flusso utente completo dell'applicazione portfolio di Alice Mandelli, dalla homepage al portfolio e poi ai contatti.

## Struttura dei Test

### 1. Homepage - Verifica Iniziale

- **Caricamento elementi essenziali**: Verifica presenza navbar, brand, skip link
- **Layout Bento Grid**: Controlla tutte le sezioni della homepage
- **Navigazione tastiera**: Testa accessibilità con Tab e focus management
- **Menu mobile**: Verifica funzionalità su viewport piccolo

### 2. Navigazione Home → Portfolio

- **Navbar desktop**: Navigazione tramite link desktop
- **Menu mobile**: Navigazione tramite hamburger menu
- **Tastiera**: Navigazione completa con Tab + Enter
- **Browser back**: Testa funzionalità back button

### 3. Pagina Portfolio

- **Contenuto**: Verifica caricamento pagina portfolio
- **Navigazione tastiera**: Mantiene accessibilità
- **Responsive**: Testa comportamento su diversi viewport

### 4. Navigazione Portfolio → Contatto

- **Navbar desktop**: Navigazione ai contatti
- **Menu mobile**: Navigazione mobile ai contatti
- **Tastiera**: Navigazione tastiera ai contatti

### 5. Pagina Contatti

- **Contenuto**: Verifica caricamento pagina contatti
- **Torna alla home**: Testa navigazione tramite brand
- **Navigazione completa**: Verifica tutti i link funzionanti

### 6. Flusso Completo End-to-End

- **Flusso completo**: Testa l'intero percorso senza errori
- **Dispositivo mobile**: Completa il flusso su mobile
- **Solo tastiera**: Completa il flusso usando solo tastiera

### 7. Test di Accessibilità e Performance

- **Focus management**: Verifica gestione focus durante navigazione
- **ARIA labels**: Controlla mantenimento aria-labels
- **Errori console**: Verifica assenza errori JavaScript
- **Performance**: Testa velocità di navigazione

## Come Eseguire i Test

### Esecuzione Completa

```bash
npm run test:e2e
```

### Esecuzione Specifica

```bash
npx cypress run --spec "cypress/e2e/complete-user-flow.cy.js"
```

### Esecuzione Interattiva

```bash
npx cypress open
# Poi seleziona "complete-user-flow.cy.js"
```

## Requisiti

- Node.js 18+
- Cypress 14+
- Applicazione Vue in esecuzione su `http://localhost:3000`

## Configurazione

Assicurati che nel `cypress.config.ts` sia configurato:

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    // ... altre configurazioni
  },
})
```

## Best Practices Implementate

### Accessibilità WCAG 2.2+

- **Skip links**: Testa presenza e funzionalità
- **Focus management**: Verifica navigazione tastiera
- **ARIA labels**: Controlla attributi semantici
- **Contrasto focus**: Verifica visibilità outline

### Performance

- **LCP**: Verifica caricamento elementi critici
- **CLS**: Controlla stabilità layout
- **INP**: Testa interazioni utente
- **Errori console**: Monitora JavaScript errors

### Responsive Design

- **Mobile viewport**: Testa su 375x667
- **Desktop viewport**: Testa su 1024x768
- **Menu hamburger**: Verifica funzionalità mobile
- **Layout adattivo**: Controlla comportamento responsive

### User Experience

- **Flusso naturale**: Simula percorso utente reale
- **Fallback**: Testa navigazione alternativa
- **Consistenza**: Verifica coerenza tra pagine
- **Feedback visivo**: Controlla indicatori di stato

## Debugging

### Problemi Comuni

1. **Test fallisce su mobile**:

   - Verifica che il menu hamburger sia presente
   - Controlla che i link mobile abbiano le classi corrette

2. **Navigazione tastiera non funziona**:

   - Verifica che gli elementi siano focusabili
   - Controlla che non ci siano `tabindex="-1"` non necessari

3. **Performance lenta**:
   - Controlla bundle size dell'applicazione
   - Verifica lazy loading dei componenti

### Logging

Per debug dettagliato, aggiungi:

```javascript
cy.log('Debug: Navigazione completata')
cy.screenshot('portfolio-page')
```

## Estensioni Future

### Test Aggiuntivi Suggeriti

1. **Test di caricamento lento**:

   ```javascript
   cy.intercept('GET', '/api/*', { delay: 2000 })
   ```

2. **Test di errore di rete**:

   ```javascript
   cy.intercept('GET', '/api/*', { forceNetworkError: true })
   ```

3. **Test di accessibilità avanzati**:

   ```javascript
   cy.injectAxe()
   cy.checkA11y()
   ```

4. **Test di performance con Lighthouse**:
   ```javascript
   cy.lighthouse({
     performance: 90,
     accessibility: 95,
   })
   ```

## Integrazione CI/CD

Questo spec è configurato per essere eseguito automaticamente in:

- **GitHub Actions**: Vedi `.github/workflows/cypress.yml`
- **Vercel**: Integrazione con deploy automatico
- **Local development**: Pre-commit hooks

## Metriche di Qualità

- **Coverage**: 100% del flusso utente critico
- **Accessibilità**: Conformità WCAG 2.2 AA
- **Performance**: Core Web Vitals ottimali
- **Responsive**: Funzionalità su tutti i dispositivi
