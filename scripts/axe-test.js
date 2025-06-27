#!/usr/bin/env node

/**
 * Script per testare l'accessibilità con axe-core
 * Esegue test automatici su tutte le pagine principali
 * Fallisce se il punteggio di accessibilità è < 95
 */

import { JSDOM } from 'jsdom';
import axe from 'axe-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione axe-core
const axeConfig = {
    rules: {
        // Regole WCAG 2.2 AA
        'color-contrast': { enabled: true },
        'document-title': { enabled: true },
        'html-has-lang': { enabled: true },
        'html-lang-valid': { enabled: true },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true },
        'region': { enabled: true },
        'skip-link': { enabled: true },
        'focus-order-semantics': { enabled: true },
        'focus-visible': { enabled: true },
        'target-size': { enabled: true },
        'button-name': { enabled: true },
        'image-alt': { enabled: true },
        'link-name': { enabled: true },
        'list': { enabled: true },
        'listitem': { enabled: true },
        'definition-list': { enabled: true },
        'dlitem': { enabled: true },
        'frame-title': { enabled: true },
        'frame-title-unique': { enabled: true },
        'iframe-title': { enabled: true },
        'form-field-multiple-labels': { enabled: true },
        'label': { enabled: true },
        'label-title-only': { enabled: true },
        'aria-required-attr': { enabled: true },
        'aria-required-children': { enabled: true },
        'aria-required-parent': { enabled: true },
        'aria-roles': { enabled: true },
        'aria-valid-attr-value': { enabled: true },
        'aria-valid-attr': { enabled: true },
        'aria-allowed-attr': { enabled: true },
        'aria-allowed-role': { enabled: true },
        'aria-hidden-body': { enabled: true },
        'aria-hidden-focus': { enabled: true },
        'aria-input-field-name': { enabled: true },
        'aria-toggle-field-name': { enabled: true },
        'aria-treeitem-name': { enabled: true },
        'aria-command-name': { enabled: true },
        'aria-meter-name': { enabled: true },
        'aria-progressbar-name': { enabled: true },
        'aria-slider-name': { enabled: true },
        'aria-spinbutton-name': { enabled: true },
        'aria-switch-name': { enabled: true },
        'aria-tabindex': { enabled: true },
        'aria-unsupported-elements': { enabled: true },
        'aria-valid-attr-value': { enabled: true },
        'aria-valid-attr': { enabled: true },
        'duplicate-id': { enabled: true },
        'duplicate-id-active': { enabled: true },
        'duplicate-id-aria': { enabled: true },
        'heading-order': { enabled: true },
        'meta-viewport': { enabled: true },
        'object-alt': { enabled: true },
        'presentation-role-conflict': { enabled: true },
        'scope-attr-valid': { enabled: true },
        'server-side-image-map': { enabled: true },
        'svg-img-alt': { enabled: true },
        'td-headers-attr': { enabled: true },
        'th-has-data-cells': { enabled: true },
        'valid-lang': { enabled: true },
        'video-caption': { enabled: true },
        'video-description': { enabled: true },
        'autocomplete-valid': { enabled: true },
        'avoid-inline-spacing': { enabled: true },
        'button-name': { enabled: true },
        'bypass': { enabled: true },
        'color-contrast': { enabled: true },
        'document-title': { enabled: true },
        'duplicate-id': { enabled: true },
        'empty-heading': { enabled: true },
        'empty-table-header': { enabled: true },
        'form-field-multiple-labels': { enabled: true },
        'frame-focusable-content': { enabled: true },
        'frame-title-unique': { enabled: true },
        'heading-order': { enabled: true },
        'html-has-lang': { enabled: true },
        'html-lang-valid': { enabled: true },
        'image-alt': { enabled: true },
        'image-redundant-alt': { enabled: true },
        'label': { enabled: true },
        'landmark-one-main': { enabled: true },
        'link-name': { enabled: true },
        'list': { enabled: true },
        'listitem': { enabled: true },
        'marquee': { enabled: true },
        'meta-refresh': { enabled: true },
        'meta-viewport': { enabled: true },
        'object-alt': { enabled: true },
        'page-has-heading-one': { enabled: true },
        'presentation-role-conflict': { enabled: true },
        'region': { enabled: true },
        'scope-attr-valid': { enabled: true },
        'server-side-image-map': { enabled: true },
        'skip-link': { enabled: true },
        'tabindex': { enabled: true },
        'table-duplicate-name': { enabled: true },
        'table-fake-caption': { enabled: true },
        'td-has-header': { enabled: true },
        'td-headers-attr': { enabled: true },
        'th-has-data-cells': { enabled: true },
        'valid-lang': { enabled: true },
        'video-caption': { enabled: true },
        'video-description': { enabled: true }
    }
};

// Pagine da testare
const pages = [
    { name: 'Home', path: '/', file: 'index.html' },
    { name: 'Blog', path: '/blog', file: 'blog.html' },
    { name: 'Portfolio', path: '/portfolio', file: 'portfolio.html' },
    { name: 'Contact', path: '/contact', file: 'contact.html' }
];

// Funzione per calcolare il punteggio di accessibilità
function calculateAccessibilityScore(results) {
    const totalViolations = results.violations.length;
    const totalPasses = results.passes.length;
    const totalIncomplete = results.incomplete.length;

    // Calcolo punteggio: (passes / (passes + violations)) * 100
    const totalChecks = totalPasses + totalViolations;
    const score = totalChecks > 0 ? (totalPasses / totalChecks) * 100 : 100;

    return {
        score: Math.round(score),
        violations: totalViolations,
        passes: totalPasses,
        incomplete: totalIncomplete
    };
}

// Funzione per testare una singola pagina
async function testPage(page) {
    console.log(`\n🔍 Testando accessibilità: ${page.name} (${page.path})`);

    try {
        // Leggi il file HTML buildato
        const distPath = path.join(__dirname, '..', 'dist', page.file);

        if (!fs.existsSync(distPath)) {
            console.log(`⚠️  File non trovato: ${distPath}`);
            return { score: 0, violations: [], passes: [], incomplete: [] };
        }

        const html = fs.readFileSync(distPath, 'utf8');
        const dom = new JSDOM(html);

        // Inizializza axe-core
        axe.configure(axeConfig);

        // Esegui il test
        const results = await axe.run(dom.window.document);
        const score = calculateAccessibilityScore(results);

        console.log(`📊 Punteggio accessibilità: ${score.score}/100`);
        console.log(`✅ Pass: ${score.passes}`);
        console.log(`❌ Violazioni: ${score.violations}`);
        console.log(`⏳ Incomplete: ${score.incomplete}`);

        if (score.violations > 0) {
            console.log('\n🚨 Violazioni trovate:');
            results.violations.forEach((violation, index) => {
                console.log(`  ${index + 1}. ${violation.id}: ${violation.description}`);
                console.log(`     Impact: ${violation.impact}`);
                console.log(`     Help: ${violation.help}`);
                if (violation.nodes && violation.nodes.length > 0) {
                    console.log(`     Elementi: ${violation.nodes.length}`);
                }
            });
        }

        return {
            page: page.name,
            path: page.path,
            ...score,
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete
        };

    } catch (error) {
        console.error(`❌ Errore nel testare ${page.name}:`, error.message);
        return {
            page: page.name,
            path: page.path,
            score: 0,
            violations: [],
            passes: [],
            incomplete: [],
            error: error.message
        };
    }
}

// Funzione principale
async function runAccessibilityTests() {
    console.log('🚀 Avvio test di accessibilità con axe-core...');
    console.log('📋 Configurazione WCAG 2.2 AA attiva');

    const results = [];
    let totalScore = 0;
    let totalPages = 0;

    for (const page of pages) {
        const result = await testPage(page);
        results.push(result);

        if (result.score > 0) {
            totalScore += result.score;
            totalPages++;
        }
    }

    const averageScore = totalPages > 0 ? Math.round(totalScore / totalPages) : 0;

    console.log('\n📈 RISULTATI FINALI');
    console.log('==================');
    console.log(`🎯 Punteggio medio: ${averageScore}/100`);
    console.log(`📄 Pagine testate: ${totalPages}`);

    // Riepilogo per pagina
    results.forEach(result => {
        const status = result.score >= 95 ? '✅' : '❌';
        console.log(`${status} ${result.page}: ${result.score}/100`);
    });

    // Controllo soglia minima
    if (averageScore < 95) {
        console.log('\n❌ TEST FALLITO: Punteggio accessibilità < 95');
        console.log('🔧 Correggere le violazioni prima del deploy');
        process.exit(1);
    } else {
        console.log('\n✅ TEST SUPERATO: Punteggio accessibilità ≥ 95');
        console.log('🎉 L\'applicazione rispetta gli standard WCAG 2.2 AA');
    }

    return results;
}

// Esegui i test se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runAccessibilityTests().catch(error => {
        console.error('❌ Errore fatale:', error);
        process.exit(1);
    });
}

export { runAccessibilityTests, testPage, calculateAccessibilityScore };
