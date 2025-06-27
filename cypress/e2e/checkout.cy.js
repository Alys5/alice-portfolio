/// <reference types="cypress" />

describe('Checkout - Happy Path', () => {
    beforeEach(() => {
        cy.visit('/shop')
    })

    it('Aggiunta prodotto al carrello e checkout', () => {
        cy.get('[data-cy="add-to-cart"]').first().click()
        cy.get('[data-cy="cart-icon"]').click()
        cy.url().should('include', '/cart')
        cy.get('[data-cy="checkout-btn"]').click()
        cy.url().should('include', '/checkout')
        cy.get('input[name="address"]').type('Via Roma 1, Milano')
        cy.get('input[name="payment"]').type('4111111111111111')
        cy.get('button[type="submit"]').click()
        cy.contains('Ordine confermato').should('exist')
    })

    it('Errore checkout con dati mancanti', () => {
        cy.get('[data-cy="add-to-cart"]').first().click()
        cy.get('[data-cy="cart-icon"]').click()
        cy.get('[data-cy="checkout-btn"]').click()
        cy.get('button[type="submit"]').click()
        cy.contains('Compila tutti i campi').should('exist')
    })
})
