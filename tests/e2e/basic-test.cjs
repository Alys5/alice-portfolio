module.exports = {
    '@tags': ['basic', 'smoke'],

    'Verifica caricamento pagina principale': async function (browser) {
        await browser
            .url('http://localhost:5173/')
            .waitForElementVisible('body', 5000)
            .assert.titleContains('Alice Mandelli')
            .assert.visible('#app')
            .assert.visible('header')
            .assert.visible('main')
            .assert.visible('footer')
    },

    'Verifica contenuto hero section': async function (browser) {
        await browser
            .url('http://localhost:5173/')
            .waitForElementVisible('body', 5000)
            .assert.containsText('main', 'Alice Mandelli')
            .assert.containsText('main', 'UI Developer')
            .assert.containsText('main', 'AI Strategist')
    },

    'Verifica navigazione e cambio lingua': async function (browser) {
        await browser
            .url('http://localhost:5173/')
            .waitForElementVisible('body', 5000)
            .waitForElementVisible('[data-testid="lang-switcher"]', 3000)
            .click('[data-testid="lang-switcher"]')
            .pause(1000)
            .assert.containsText('main', 'I transform')
    },

    after: function (browser) {
        browser.end()
    }
}
