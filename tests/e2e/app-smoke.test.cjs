module.exports = {
    '@tags': ['smoke', 'home'],

    'Home page carica e mostra header, hero e footer': async function (browser) {
        await browser.url('http://localhost:5173/')
            .waitForElementVisible('body', 1000)
            .assert.containsText('header', 'AM')
            .assert.containsText('main', 'Alice Mandelli')
            .assert.containsText('footer', 'Alice Mandelli')
    },

    'Switch lingua EN e verifica traduzioni': async function (browser) {
        await browser.url('http://localhost:5173/')
            .waitForElementVisible('body', 1000)
            .click('.lang-btn:not(.active)')
            .pause(500)
            .assert.containsText('main', 'I specialize in')
            .assert.containsText('footer', 'All rights reserved.')
    },

    after: function (browser) {
        browser.end()
    }
} 