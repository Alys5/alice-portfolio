/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Comandi personalizzati per il flusso utente portfolio

// -- Comando per navigare al portfolio --
Cypress.Commands.add('navigateToPortfolio', () => {
  cy.get('.navbar__link').contains('Portfolio').click()
  cy.url().should('include', '/portfolio')
  cy.contains('Portfolio').should('be.visible')
})

// -- Comando per navigare ai contatti --
Cypress.Commands.add('navigateToContact', () => {
  cy.get('.navbar__link').contains('Contatti').click()
  cy.url().should('include', '/contact')
  cy.contains('Contatti').should('be.visible')
})

// -- Comando per tornare alla homepage --
Cypress.Commands.add('navigateToHome', () => {
  cy.get('.navbar__brand').click()
  cy.url().should('eq', Cypress.config().baseUrl + '/')
  cy.get('.bento-grid').should('be.visible')
})

// -- Comando per testare menu mobile --
Cypress.Commands.add('testMobileMenu', () => {
  cy.viewport(375, 667)
  cy.get('.navbar__hamburger').should('be.visible')
  cy.get('.navbar__hamburger').click()
  cy.get('.navbar__mobile-menu').should('be.visible')
  cy.get('.navbar__hamburger').should('have.attr', 'aria-expanded', 'true')
})

// -- Comando per testare accessibilità --
Cypress.Commands.add('testAccessibility', () => {
  // Verifica skip link
  cy.get('.skip-link').should('be.visible')
  cy.get('.skip-link').should('contain.text', 'Salta al contenuto principale')

  // Verifica aria-labels
  cy.get('nav').should('have.attr', 'aria-label', 'Main navigation')
  cy.get('.navbar__brand').should('have.attr', 'aria-label', 'Alice Mandelli - Home')
})

// -- Comando per completare il flusso completo --
Cypress.Commands.add('completeUserFlow', () => {
  // 1. Inizia dalla homepage
  cy.visit('/')
  cy.get('.bento-grid').should('be.visible')

  // 2. Naviga al portfolio
  cy.navigateToPortfolio()

  // 3. Naviga ai contatti
  cy.navigateToContact()

  // 4. Torna alla homepage
  cy.navigateToHome()

  // 5. Verifica che tutto sia ancora funzionale
  cy.get('.navbar__link').contains('Portfolio').should('be.visible')
  cy.get('.navbar__link').contains('Contatti').should('be.visible')
})
