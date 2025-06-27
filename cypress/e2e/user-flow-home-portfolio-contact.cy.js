describe('Flusso Utente Completo: Home → Portfolio → Contatto', () => {
  beforeEach(() => {
    // Visita la homepage prima di ogni test
    cy.visit('/')
    // Aspetta che l'app sia caricata
    cy.get('body').should('be.visible')
  })

  describe('1. Homepage - Verifica Iniziale', () => {
    it('Carica correttamente la homepage con tutti gli elementi essenziali', () => {
      // Verifica elementi di navigazione
      cy.get('nav').should('be.visible')
      cy.get('nav').should('have.attr', 'aria-label', 'Main navigation')

      // Verifica brand/logo
      cy.get('.navbar__brand').should('be.visible')
      cy.get('.navbar__brand').should('contain.text', 'Alice Mandelli')

      // Verifica skip link per accessibilità
      cy.get('.skip-link').should('be.visible')
      cy.get('.skip-link').should('contain.text', 'Salta al contenuto principale')

      // Verifica che la homepage sia nella URL
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('Mostra tutte le sezioni Bento Grid della homepage', () => {
      // Verifica che il layout Bento Grid sia presente
      cy.get('.bento-grid').should('be.visible')

      // Verifica le sezioni principali
      cy.get('.bento-hero').should('be.visible')
      cy.get('.bento-portfolio').should('be.visible')
      cy.get('.bento-about').should('be.visible')
      cy.get('.bento-skills').should('be.visible')
      cy.get('.bento-services').should('be.visible')
      cy.get('.bento-experience').should('be.visible')
      cy.get('.bento-testimonials').should('be.visible')
      cy.get('.bento-contact').should('be.visible')
    })

    it('Navigazione tastiera funziona correttamente', () => {
      // Testa navigazione con Tab
      cy.get('body').tab()
      cy.focused().should('have.class', 'skip-link')

      // Naviga attraverso i link principali
      cy.tab()
      cy.focused().should('have.class', 'navbar__brand')

      cy.tab()
      cy.focused().should('have.class', 'navbar__link')

      // Verifica che il focus sia visibile
      cy.focused().should('have.css', 'outline').and('not.eq', 'none')
    })

    it('Menu mobile funziona correttamente su viewport piccolo', () => {
      // Imposta viewport mobile
      cy.viewport(375, 667)

      // Verifica che il menu hamburger sia visibile
      cy.get('.navbar__hamburger').should('be.visible')
      cy.get('.navbar__hamburger').should('have.attr', 'aria-label', 'Apri menu di navigazione')

      // Apri il menu mobile
      cy.get('.navbar__hamburger').click()
      cy.get('.navbar__mobile-menu').should('be.visible')
      cy.get('.navbar__hamburger').should('have.attr', 'aria-expanded', 'true')

      // Verifica che i link del menu mobile siano presenti
      cy.get('.navbar__mobile-links').within(() => {
        cy.contains('Home').should('be.visible')
        cy.contains('Portfolio').should('be.visible')
        cy.contains('Contatti').should('be.visible')
      })

      // Chiudi il menu
      cy.get('.navbar__close').click()
      cy.get('.navbar__mobile-menu').should('not.be.visible')
    })
  })

  describe('2. Navigazione Home → Portfolio', () => {
    it('Naviga dalla homepage al portfolio tramite navbar desktop', () => {
      // Clicca sul link Portfolio nella navbar
      cy.get('.navbar__link').contains('Portfolio').click()

      // Verifica che sia navigato alla pagina portfolio
      cy.url().should('include', '/portfolio')
      cy.contains('Portfolio').should('be.visible')
      cy.contains('Sezione portfolio in costruzione').should('be.visible')

      // Verifica che il link Portfolio sia evidenziato come attivo
      cy.get('.navbar__link').contains('Portfolio').should('have.attr', 'aria-current', 'page')
    })

    it('Naviga dalla homepage al portfolio tramite menu mobile', () => {
      // Imposta viewport mobile
      cy.viewport(375, 667)

      // Apri menu mobile
      cy.get('.navbar__hamburger').click()
      cy.get('.navbar__mobile-menu').should('be.visible')

      // Clicca su Portfolio nel menu mobile
      cy.get('.navbar__mobile-link').contains('Portfolio').click()

      // Verifica navigazione
      cy.url().should('include', '/portfolio')
      cy.contains('Portfolio').should('be.visible')

      // Verifica che il menu mobile si sia chiuso
      cy.get('.navbar__mobile-menu').should('not.be.visible')
    })

    it('Naviga dalla homepage al portfolio tramite tastiera', () => {
      // Naviga con Tab fino al link Portfolio
      cy.get('body').tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.focused().should('contain.text', 'Portfolio')

      // Attiva il link con Enter
      cy.focused().type('{enter}')

      // Verifica navigazione
      cy.url().should('include', '/portfolio')
      cy.contains('Portfolio').should('be.visible')
    })

    it('Naviga dalla homepage al portfolio tramite breadcrumb/back button', () => {
      // Naviga al portfolio
      cy.get('.navbar__link').contains('Portfolio').click()
      cy.url().should('include', '/portfolio')

      // Torna indietro con il browser back button
      cy.go('back')
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Verifica che la homepage sia ancora funzionale
      cy.get('.bento-grid').should('be.visible')
    })
  })

  describe('3. Pagina Portfolio', () => {
    beforeEach(() => {
      // Naviga alla pagina portfolio
      cy.visit('/portfolio')
    })

    it('Carica correttamente la pagina portfolio', () => {
      // Verifica contenuto della pagina
      cy.contains('Portfolio').should('be.visible')
      cy.contains('Sezione portfolio in costruzione').should('be.visible')

      // Verifica che la navbar sia ancora presente e funzionale
      cy.get('nav').should('be.visible')
      cy.get('.navbar__brand').should('be.visible')

      // Verifica che il link Portfolio sia evidenziato
      cy.get('.navbar__link').contains('Portfolio').should('have.attr', 'aria-current', 'page')
    })

    it('Mantiene la navigazione tastiera funzionale', () => {
      // Testa che la navigazione tastiera funzioni ancora
      cy.get('body').tab()
      cy.focused().should('have.class', 'skip-link')

      // Naviga attraverso i link
      cy.tab()
      cy.focused().should('have.class', 'navbar__brand')

      // Verifica che il focus sia visibile
      cy.focused().should('have.css', 'outline').and('not.eq', 'none')
    })

    it('Responde correttamente al cambio viewport', () => {
      // Testa responsive design
      cy.viewport(375, 667)
      cy.get('.navbar__hamburger').should('be.visible')

      cy.viewport(1024, 768)
      cy.get('.navbar__hamburger').should('not.be.visible')
      cy.get('.navbar__links').should('be.visible')
    })
  })

  describe('4. Navigazione Portfolio → Contatto', () => {
    beforeEach(() => {
      // Naviga alla pagina portfolio
      cy.visit('/portfolio')
    })

    it('Naviga dal portfolio ai contatti tramite navbar desktop', () => {
      // Clicca sul link Contatti nella navbar
      cy.get('.navbar__link').contains('Contatti').click()

      // Verifica navigazione
      cy.url().should('include', '/contact')
      cy.contains('Contatti').should('be.visible')
      cy.contains('Sezione contatti in costruzione').should('be.visible')

      // Verifica che il link Contatti sia evidenziato
      cy.get('.navbar__link').contains('Contatti').should('have.attr', 'aria-current', 'page')
    })

    it('Naviga dal portfolio ai contatti tramite menu mobile', () => {
      // Imposta viewport mobile
      cy.viewport(375, 667)

      // Apri menu mobile
      cy.get('.navbar__hamburger').click()
      cy.get('.navbar__mobile-menu').should('be.visible')

      // Clicca su Contatti nel menu mobile
      cy.get('.navbar__mobile-link').contains('Contatti').click()

      // Verifica navigazione
      cy.url().should('include', '/contact')
      cy.contains('Contatti').should('be.visible')
    })

    it('Naviga dal portfolio ai contatti tramite tastiera', () => {
      // Naviga con Tab fino al link Contatti
      cy.get('body').tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.focused().should('contain.text', 'Contatti')

      // Attiva il link con Enter
      cy.focused().type('{enter}')

      // Verifica navigazione
      cy.url().should('include', '/contact')
      cy.contains('Contatti').should('be.visible')
    })
  })

  describe('5. Pagina Contatti', () => {
    beforeEach(() => {
      // Naviga alla pagina contatti
      cy.visit('/contact')
    })

    it('Carica correttamente la pagina contatti', () => {
      // Verifica contenuto della pagina
      cy.contains('Contatti').should('be.visible')
      cy.contains('Sezione contatti in costruzione').should('be.visible')

      // Verifica che la navbar sia presente
      cy.get('nav').should('be.visible')
      cy.get('.navbar__brand').should('be.visible')

      // Verifica che il link Contatti sia evidenziato
      cy.get('.navbar__link').contains('Contatti').should('have.attr', 'aria-current', 'page')
    })

    it('Permette di tornare alla homepage tramite brand/logo', () => {
      // Clicca sul brand/logo per tornare alla homepage
      cy.get('.navbar__brand').click()

      // Verifica che sia tornato alla homepage
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.get('.bento-grid').should('be.visible')
    })

    it('Mantiene la navigazione completa funzionale', () => {
      // Verifica che tutti i link di navigazione siano ancora funzionali
      cy.get('.navbar__link').contains('Home').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      cy.get('.navbar__link').contains('Portfolio').click()
      cy.url().should('include', '/portfolio')

      cy.get('.navbar__link').contains('Contatti').click()
      cy.url().should('include', '/contact')
    })
  })

  describe('6. Flusso Completo End-to-End', () => {
    it('Completa l\'intero flusso utente senza errori', () => {
      // 1. Inizia dalla homepage
      cy.visit('/')
      cy.get('.bento-grid').should('be.visible')

      // 2. Naviga al portfolio
      cy.get('.navbar__link').contains('Portfolio').click()
      cy.url().should('include', '/portfolio')
      cy.contains('Portfolio').should('be.visible')

      // 3. Naviga ai contatti
      cy.get('.navbar__link').contains('Contatti').click()
      cy.url().should('include', '/contact')
      cy.contains('Contatti').should('be.visible')

      // 4. Torna alla homepage
      cy.get('.navbar__brand').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.get('.bento-grid').should('be.visible')

      // 5. Verifica che tutto sia ancora funzionale
      cy.get('.navbar__link').contains('Portfolio').should('be.visible')
      cy.get('.navbar__link').contains('Contatti').should('be.visible')
    })

    it('Completa il flusso su dispositivo mobile', () => {
      // Imposta viewport mobile
      cy.viewport(375, 667)

      // 1. Inizia dalla homepage
      cy.visit('/')
      cy.get('.bento-grid').should('be.visible')

      // 2. Apri menu mobile e naviga al portfolio
      cy.get('.navbar__hamburger').click()
      cy.get('.navbar__mobile-link').contains('Portfolio').click()
      cy.url().should('include', '/portfolio')

      // 3. Apri menu mobile e naviga ai contatti
      cy.get('.navbar__hamburger').click()
      cy.get('.navbar__mobile-link').contains('Contatti').click()
      cy.url().should('include', '/contact')

      // 4. Torna alla homepage tramite brand
      cy.get('.navbar__brand').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('Completa il flusso usando solo la tastiera', () => {
      // 1. Inizia dalla homepage
      cy.visit('/')

      // 2. Naviga al portfolio con Tab + Enter
      cy.get('body').tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.focused().should('contain.text', 'Portfolio')
      cy.focused().type('{enter}')
      cy.url().should('include', '/portfolio')

      // 3. Naviga ai contatti con Tab + Enter
      cy.get('body').tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.tab()
      cy.focused().should('contain.text', 'Contatti')
      cy.focused().type('{enter}')
      cy.url().should('include', '/contact')

      // 4. Torna alla homepage tramite brand
      cy.get('body').tab()
      cy.tab()
      cy.focused().should('have.class', 'navbar__brand')
      cy.focused().type('{enter}')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('7. Test di Accessibilità e Performance', () => {
    it('Mantiene focus management corretto durante la navigazione', () => {
      // Verifica che il focus sia gestito correttamente
      cy.visit('/')
      cy.get('body').tab()
      cy.focused().should('have.class', 'skip-link')

      // Naviga al portfolio
      cy.get('.navbar__link').contains('Portfolio').click()
      cy.url().should('include', '/portfolio')

      // Verifica che il focus sia ancora gestito
      cy.get('body').tab()
      cy.focused().should('have.class', 'skip-link')
    })

    it('Mantiene aria-labels e ruoli corretti', () => {
      // Verifica aria-labels
      cy.get('nav').should('have.attr', 'aria-label', 'Main navigation')
      cy.get('.navbar__brand').should('have.attr', 'aria-label', 'Alice Mandelli - Home')

      // Naviga e verifica che siano mantenuti
      cy.get('.navbar__link').contains('Portfolio').click()
      cy.get('nav').should('have.attr', 'aria-label', 'Main navigation')
      cy.get('.navbar__brand').should('have.attr', 'aria-label', 'Alice Mandelli - Home')
    })

    it('Non genera errori console durante la navigazione', () => {
      // Intercetta errori console
      cy.on('window:before:load', (win) => {
        cy.spy(win.console, 'error').as('consoleError')
      })

      // Esegui navigazione
      cy.get('.navbar__link').contains('Portfolio').click()
      cy.get('.navbar__link').contains('Contatti').click()
      cy.get('.navbar__brand').click()

      // Verifica che non ci siano errori
      cy.get('@consoleError').should('not.be.called')
    })

    it('Mantiene performance accettabili durante la navigazione', () => {
      // Misura tempo di caricamento iniziale
      cy.visit('/', {
        onBeforeLoad: (win) => {
          cy.spy(win.console, 'time').as('consoleTime')
          cy.spy(win.console, 'timeEnd').as('consoleTimeEnd')
        }
      })

      // Naviga e verifica performance
      cy.get('.navbar__link').contains('Portfolio').click()
      cy.url().should('include', '/portfolio')

      // Verifica che la navigazione sia rapida
      cy.get('@consoleTimeEnd').should('be.called')
    })
  })
})