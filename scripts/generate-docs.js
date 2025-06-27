#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurazione
const SRC_DIR = path.resolve(__dirname, '../src')
const DOCS_DIR = path.resolve(__dirname, '../docs')
const COMPONENTS_DIR = path.join(DOCS_DIR, 'components')
const COMPOSABLES_DIR = path.join(DOCS_DIR, 'composables')

// Parser JSDoc
function parseJSDoc(content, filePath) {
    const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g
    const matches = content.match(jsdocRegex)

    if (!matches) return null

    const jsdoc = matches[0]
    const lines = jsdoc.split('\n')

    const parsed = {
        component: false,
        name: '',
        description: '',
        props: [],
        events: [],
        slots: [],
        examples: [],
        sourceFile: path.relative(SRC_DIR, filePath)
    }

    for (const line of lines) {
        const trimmed = line.trim().replace(/^[\s*\/]+/, '')

        if (trimmed.startsWith('@component')) {
            parsed.component = true
        } else if (trimmed.startsWith('@name')) {
            parsed.name = trimmed.replace('@name', '').trim()
        } else if (trimmed.startsWith('@desc')) {
            parsed.description = trimmed.replace('@desc', '').trim()
        } else if (trimmed.startsWith('@prop')) {
            const propMatch = trimmed.match(/@prop\s*\{([^}]+)\}\s*(\w+)\s*-\s*(.+)/)
            if (propMatch) {
                parsed.props.push({
                    type: propMatch[1].trim(),
                    name: propMatch[2].trim(),
                    description: propMatch[3].trim()
                })
            }
        } else if (trimmed.startsWith('@event')) {
            const eventMatch = trimmed.match(/@event\s*(\w+)\s*-\s*(.+)/)
            if (eventMatch) {
                parsed.events.push({
                    name: eventMatch[1].trim(),
                    description: eventMatch[2].trim()
                })
            }
        } else if (trimmed.startsWith('@slot')) {
            const slotMatch = trimmed.match(/@slot\s*(\w+)\s*-\s*(.+)/)
            if (slotMatch) {
                parsed.slots.push({
                    name: slotMatch[1].trim(),
                    description: slotMatch[2].trim()
                })
            }
        } else if (trimmed.startsWith('@example')) {
            parsed.examples.push(trimmed.replace('@example', '').trim())
        }
    }

    return parsed.component ? parsed : null
}

// Parser per composables
function parseComposable(content, filePath) {
    const functionRegex = /export\s+function\s+(\w+)/g
    const matches = [...content.matchAll(functionRegex)]

    if (!matches.length) return null

    const functionName = matches[0][1]
    const jsdoc = parseJSDoc(content, filePath)

    if (!jsdoc) {
        // Crea JSDoc di base per composable
        return {
            component: false,
            composable: true,
            name: functionName,
            description: `Composable ${functionName} per gestione stato e logica`,
            props: [],
            events: [],
            slots: [],
            examples: [],
            sourceFile: path.relative(SRC_DIR, filePath)
        }
    }

    jsdoc.composable = true
    return jsdoc
}

// Genera frontmatter per VitePress
function generateFrontmatter(parsed, type = 'component') {
    const frontmatter = {
        title: parsed.name,
        description: parsed.description,
        layout: 'doc',
        sidebar: 'auto',
        head: [
            ['link', { rel: 'stylesheet', href: '/styles/docs.css' }]
        ]
    }

    if (parsed.sourceFile) {
        frontmatter.sourceFile = parsed.sourceFile
    }

    return matter.stringify('', frontmatter)
}

// Genera contenuto markdown
function generateMarkdown(parsed, type = 'component') {
    let content = ''

    // Descrizione
    if (parsed.description) {
        content += `# ${parsed.name}\n\n`
        content += `${parsed.description}\n\n`
    }

    // Props
    if (parsed.props.length > 0) {
        content += '## Props\n\n'
        content += '| Prop | Tipo | Default | Descrizione |\n'
        content += '|------|------|---------|-------------|\n'

        for (const prop of parsed.props) {
            content += `| \`${prop.name}\` | \`${prop.type}\` | - | ${prop.description} |\n`
        }
        content += '\n'
    }

    // Events
    if (parsed.events.length > 0) {
        content += '## Events\n\n'
        content += '| Event | Payload | Descrizione |\n'
        content += '|-------|---------|-------------|\n'

        for (const event of parsed.events) {
            content += `| \`${event.name}\` | - | ${event.description} |\n`
        }
        content += '\n'
    }

    // Slots
    if (parsed.slots.length > 0) {
        content += '## Slots\n\n'
        content += '| Slot | Descrizione |\n'
        content += '|------|-------------|\n'

        for (const slot of parsed.slots) {
            content += `| \`${slot.name}\` | ${slot.description} |\n`
        }
        content += '\n'
    }

    // Esempi
    if (parsed.examples.length > 0) {
        content += '## Esempi\n\n'

        for (let i = 0; i < parsed.examples.length; i++) {
            content += `### Esempio ${i + 1}\n\n`
            content += `${parsed.examples[i]}\n\n`
        }
    }

    // Demo interattiva
    content += '## Demo Interattiva\n\n'
    content += '<ClientOnly>\n'
    content += `<ExampleContainer component="${parsed.name}" />\n`
    content += '</ClientOnly>\n\n'

    // Link al codice sorgente
    if (parsed.sourceFile) {
        content += '## Codice Sorgente\n\n'
        content += `📁 [${parsed.sourceFile}](https://github.com/alicemandelli/portfolio/blob/main/src/${parsed.sourceFile})\n\n`
    }

    return content
}

// Scansiona directory ricorsivamente
function scanDirectory(dir, extensions = ['.vue', '.ts', '.js']) {
    const files = []

    function scan(currentDir) {
        const items = fs.readdirSync(currentDir)

        for (const item of items) {
            const fullPath = path.join(currentDir, item)
            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {
                scan(fullPath)
            } else if (extensions.some(ext => item.endsWith(ext))) {
                files.push(fullPath)
            }
        }
    }

    scan(dir)
    return files
}

// Crea directory se non esiste
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

// Genera documentazione per componenti
function generateComponentDocs() {
    console.log('🔍 Scansionando componenti...')

    const componentFiles = scanDirectory(path.join(SRC_DIR, 'components'))

    for (const file of componentFiles) {
        const content = fs.readFileSync(file, 'utf-8')
        const parsed = parseJSDoc(content, file)

        if (!parsed) continue

        const relativePath = path.relative(path.join(SRC_DIR, 'components'), file)
        const docPath = path.join(COMPONENTS_DIR, relativePath.replace(/\.vue$/, '.md'))

        ensureDir(path.dirname(docPath))

        const frontmatter = generateFrontmatter(parsed, 'component')
        const markdown = generateMarkdown(parsed, 'component')

        fs.writeFileSync(docPath, frontmatter + markdown)
        console.log(`✅ Generato: ${docPath}`)
    }
}

// Genera documentazione per composables
function generateComposableDocs() {
    console.log('🔍 Scansionando composables...')

    const composableFiles = scanDirectory(path.join(SRC_DIR, 'composables'), ['.ts'])

    for (const file of composableFiles) {
        const content = fs.readFileSync(file, 'utf-8')
        const parsed = parseComposable(content, file)

        if (!parsed) continue

        const fileName = path.basename(file, '.ts')
        const docPath = path.join(COMPOSABLES_DIR, `${fileName}.md`)

        ensureDir(path.dirname(docPath))

        const frontmatter = generateFrontmatter(parsed, 'composable')
        const markdown = generateMarkdown(parsed, 'composable')

        fs.writeFileSync(docPath, frontmatter + markdown)
        console.log(`✅ Generato: ${docPath}`)
    }
}

// Genera pagine di panoramica
function generateOverviewPages() {
    // Panoramica componenti
    const componentsOverview = `---
title: Componenti
description: Panoramica dei componenti UI disponibili
layout: doc
---

# Componenti UI

Questa sezione contiene la documentazione di tutti i componenti UI disponibili nel design system.

## Categorie

### Componenti Base
- [ModernButton](/components/ui/ModernButton) - Pulsante con varianti e effetti
- [ModernCard](/components/ui/ModernCard) - Card con animazioni
- [ContactForm](/components/ui/ContactForm) - Form accessibile

### Editor
- [VMarkdownEditor](/components/ui/VMarkdownEditor) - Editor markdown completo
- [ImageUploader](/components/ui/ImageUploader) - Upload immagini

### Layout
- [AppHeader](/components/layout/AppHeader) - Header dell'applicazione
- [AppFooter](/components/layout/AppFooter) - Footer dell'applicazione
- [NavBar](/components/layout/NavBar) - Barra di navigazione
- [BentoGrid](/components/layout/BentoGrid) - Layout a griglia

### Sezioni
- [HeroSection](/components/sections/HeroSection) - Sezione hero
- [AboutSection](/components/sections/AboutSection) - Sezione about
- [PortfolioSection](/components/sections/PortfolioSection) - Sezione portfolio
- [ContactSection](/components/sections/ContactSection) - Sezione contatti
`

    fs.writeFileSync(path.join(COMPONENTS_DIR, 'index.md'), componentsOverview)

    // Panoramica composables
    const composablesOverview = `---
title: Composables
description: Panoramica dei composables Vue 3 disponibili
layout: doc
---

# Composables

Questa sezione contiene la documentazione di tutti i composables Vue 3 disponibili.

## Gestione Tema
- [useTheme](/composables/useTheme) - Gestione temi con transizioni

## Performance
- [usePerformance](/composables/usePerformance) - Monitoraggio Core Web Vitals
- [usePerformanceOptimization](/composables/usePerformanceOptimization) - Ottimizzazioni

## Accessibilità
- [useAccessibilityAnnouncements](/composables/useAccessibilityAnnouncements) - Annunci screen reader
- [useFocusTrap](/composables/useFocusTrap) - Focus management

## UI/UX
- [useIntersectionObserver](/composables/useIntersectionObserver) - Animazioni scroll-triggered
- [useScrollProgress](/composables/useScrollProgress) - Progresso scroll
- [useImageUpload](/composables/useImageUpload) - Upload immagini

## PWA
- [useServiceWorker](/composables/useServiceWorker) - Service worker management

## Utilità
- [useUserPreferences](/composables/useUserPreferences) - Preferenze utente
- [useProjectsFilter](/composables/useProjectsFilter) - Filtri progetti
- [useBlog](/composables/useBlog) - Gestione blog
- [useMeta](/composables/useMeta) - Meta tags dinamici
`

    fs.writeFileSync(path.join(COMPOSABLES_DIR, 'index.md'), composablesOverview)
}

// Funzione principale
function main() {
    console.log('🚀 Generazione documentazione automatica...')

    try {
        generateComponentDocs()
        generateComposableDocs()
        generateOverviewPages()

        console.log('✅ Documentazione generata con successo!')
        console.log('📖 Avvia con: npm run docs:dev')
    } catch (error) {
        console.error('❌ Errore durante la generazione:', error)
        process.exit(1)
    }
}

main()
