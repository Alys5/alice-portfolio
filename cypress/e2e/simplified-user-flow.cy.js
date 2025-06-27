describe('Flusso Utente Semplificato: Home → Portfolio → Contatto', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Completa il flusso utente completo usando comandi personalizzati', () => {
        // Usa il comando personalizzato per completare tutto il flusso
        cy.completeUserFlow()
    })

    it('Testa navigazione individuale con comandi personalizzati', () => {
        // Testa ogni navigazione separatamente
        cy.navigateToPortfolio()
        cy.navigateToContact()
        cy.navigateToHome()
    })

    it('Testa accessibilità con comando personalizzato', () => {
        cy.testAccessibility()
    })

    it('Testa menu mobile con comando personalizzato', () => {
        cy.testMobileMenu()

        // Chiudi il menu
        cy.get('.navbar__close').click()
        cy.get('.navbar__mobile-menu').should('not.be.visible')
    })

    it('Testa flusso mobile completo', () => {
        // Imposta viewport mobile
        cy.viewport(375, 667)

        // Apri menu mobile e naviga al portfolio
        cy.get('.navbar__hamburger').click()
        cy.get('.navbar__mobile-link').contains('Portfolio').click()
        cy.url().should('include', '/portfolio')

        // Apri menu mobile e naviga ai contatti
        cy.get('.navbar__hamburger').click()
        cy.get('.navbar__mobile-link').contains('Contatti').click()
        cy.url().should('include', '/contact')

        // Torna alla homepage tramite brand
        cy.get('.navbar__brand').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('Testa navigazione tastiera', () => {
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

    it('Testa responsive design', () => {
        // Test mobile
        cy.viewport(375, 667)
        cy.get('.navbar__hamburger').should('be.visible')

        // Test tablet
        cy.viewport(768, 1024)
        cy.get('.navbar__hamburger').should('be.visible')

        // Test desktop
        cy.viewport(1280, 720)
        cy.get('.navbar__hamburger').should('not.be.visible')
        cy.get('.navbar__links').should('be.visible')
    })

    it('Testa performance e errori console', () => {
        // Intercetta errori console
        cy.on('window:before:load', (win) => {
            cy.spy(win.console, 'error').as('consoleError')
        })

        // Esegui navigazione
        cy.navigateToPortfolio()
        cy.navigateToContact()
        cy.navigateToHome()

        // Verifica che non ci siano errori
        cy.get('@consoleError').should('not.be.called')
    })
})
