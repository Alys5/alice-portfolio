describe('Home Page', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Mostra header, hero e bottone portfolio', () => {
        cy.get('header').should('be.visible')
        cy.contains('Alice Mandelli').should('be.visible')
        cy.contains(/esplora portfolio/i).should('be.visible')
    })

    it('Mostra tutte le sezioni principali', () => {
        cy.get('main').within(() => {
            cy.contains(/chi sono|about/i).should('exist')
            cy.contains(/competenze|skills/i).should('exist')
            cy.contains(/servizi|services/i).should('exist')
            cy.contains(/portfolio/i).should('exist')
            cy.contains(/esperienza|experience/i).should('exist')
            cy.contains(/testimonianze|testimonials/i).should('exist')
            cy.contains(/contatti|contact/i).should('exist')
        })
    })

    it('Permette il cambio lingua', () => {
        cy.get('[data-testid="lang-switcher"]').click()
        cy.contains('English').click()
        cy.contains('UI Developer').should('exist')
        cy.get('[data-testid="lang-switcher"]').click()
        cy.contains('Italiano').click()
        cy.contains('UI Developer').should('exist')
    })

    it('Permette il cambio tema', () => {
        cy.get('[data-testid="theme-switcher"]').click()
        cy.get('body').should('exist')
    })
})
