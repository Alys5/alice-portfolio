/// <reference types="cypress" />

describe('Autenticazione - Happy Path', () => {
    beforeEach(() => {
        cy.visit('/login')
    })

    it('Login riuscito con credenziali valide', () => {
        cy.get('input[name="email"]').type('alice@example.com')
        cy.get('input[name="password"]').type('password123')
        cy.get('button[type="submit"]').click()
        cy.url().should('not.include', '/login')
        cy.contains('Benvenuto').should('exist')
    })

    it('Logout', () => {
        // Simula login
        cy.login('alice@example.com', 'password123')
        cy.get('[data-cy="user-menu"]').click()
        cy.get('[data-cy="logout"]').click()
        cy.url().should('include', '/login')
    })

    it('Errore con credenziali errate', () => {
        cy.get('input[name="email"]').type('alice@example.com')
        cy.get('input[name="password"]').type('wrongpass')
        cy.get('button[type="submit"]').click()
        cy.contains('Credenziali non valide').should('exist')
    })
})
