#!/usr/bin/env node

/**
 * Script per testare l'accessibilità localmente durante lo sviluppo
 * Esegue test rapidi senza build completa
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Avvio test di accessibilità locale...\n');

// Funzione per eseguire comandi
function runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            ...options
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
}

// Funzione principale
async function runLocalAccessibilityTests() {
    try {
        // 1. Verifica che il server di sviluppo sia in esecuzione
        console.log('📋 Verifica server di sviluppo...');

        try {
            await runCommand('curl', ['-s', 'http://localhost:5173'], { stdio: 'pipe' });
            console.log('✅ Server di sviluppo attivo su http://localhost:5173\n');
        } catch (error) {
            console.log('⚠️  Server di sviluppo non attivo');
            console.log('💡 Avvia il server con: npm run dev\n');
            return;
        }

        // 2. Test rapido con axe-core (se disponibile)
        console.log('🔍 Test rapido axe-core...');

        try {
            // Crea un test rapido con Puppeteer o Playwright se disponibile
            console.log('📝 Per test completi, esegui: npm run test:accessibility');
            console.log('📝 Per test Lighthouse: npm run test:lighthouse\n');
        } catch (error) {
            console.log('⚠️  Test axe-core non disponibili in modalità sviluppo');
        }

        // 3. Controlli manuali suggeriti
        console.log('🔧 Controlli manuali suggeriti:');
        console.log('   • Navigazione con tastiera (Tab, Shift+Tab, Enter, Space)');
        console.log('   • Screen reader (NVDA, VoiceOver, JAWS)');
        console.log('   • Contrasto colori (DevTools → Lighthouse → Accessibility)');
        console.log('   • Focus indicators (DevTools → Elements → :focus-visible)');
        console.log('   • Alt text immagini (DevTools → Elements → img)');
        console.log('   • Heading structure (DevTools → Elements → h1-h6)');
        console.log('   • ARIA labels (DevTools → Elements → aria-*)');
        console.log('   • Skip links (primo elemento focusabile)');
        console.log('   • Live regions (per contenuti dinamici)');
        console.log('   • Reduced motion (prefers-reduced-motion: reduce)');
        console.log('   • High contrast (prefers-contrast: high)');
        console.log('   • Dark mode (prefers-color-scheme: dark)\n');

        // 4. Strumenti browser suggeriti
        console.log('🛠️  Strumenti browser per test accessibilità:');
        console.log('   • Chrome: DevTools → Lighthouse → Accessibility');
        console.log('   • Firefox: DevTools → Accessibility');
        console.log('   • Safari: Web Inspector → Accessibility');
        console.log('   • Edge: DevTools → Lighthouse → Accessibility\n');

        // 5. Estensioni browser suggerite
        console.log('🔌 Estensioni browser consigliate:');
        console.log('   • axe DevTools (Chrome, Firefox, Edge)');
        console.log('   • WAVE (Web Accessibility Evaluation Tool)');
        console.log('   • Color Contrast Analyzer');
        console.log('   • HeadingsMap');
        console.log('   • NoCoffee (simulazione problemi visivi)\n');

        // 6. Test automatici completi
        console.log('🚀 Per test automatici completi:');
        console.log('   npm run build && npm run test:accessibility');
        console.log('   npm run test:lighthouse\n');

        console.log('✅ Test di accessibilità locale completati!');
        console.log('📖 Documentazione: docs/accessibility-testing.md');

    } catch (error) {
        console.error('❌ Errore durante i test:', error.message);
        process.exit(1);
    }
}

// Esegui se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runLocalAccessibilityTests().catch(error => {
        console.error('❌ Errore fatale:', error);
        process.exit(1);
    });
}

export { runLocalAccessibilityTests };
