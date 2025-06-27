#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * Analizza il bundle per identificare problemi di performance e dimensioni
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const BUNDLE_ANALYSIS_FILE = 'bundle-analysis.json'
const THRESHOLD_CHUNK_SIZE = 500 * 1024 // 500KB
const THRESHOLD_TOTAL_SIZE = 2 * 1024 * 1024 // 2MB

/**
 * Analizza il bundle con rollup-plugin-visualizer
 */
function analyzeBundle() {
  console.log('🔍 Analizzando il bundle...')

  try {
    // Esegui build con analisi
    execSync('npm run build -- --analyze', { stdio: 'inherit' })

    // Leggi il report di analisi
    const analysisPath = resolve(process.cwd(), 'dist', 'stats.html')
    console.log(`📊 Report generato: ${analysisPath}`)

    return true
  } catch (error) {
    console.error('❌ Errore durante l\'analisi del bundle:', error.message)
    return false
  }
}

/**
 * Analizza le dimensioni dei chunk
 */
function analyzeChunkSizes() {
  console.log('📦 Analizzando dimensioni dei chunk...')

  try {
    const distPath = resolve(process.cwd(), 'dist')
    const files = execSync('find . -name "*.js" -o -name "*.css"', { cwd: distPath })
      .toString()
      .split('\n')
      .filter(Boolean)

    const chunkAnalysis = []

    for (const file of files) {
      const filePath = resolve(distPath, file)
      const stats = execSync(`wc -c < "${filePath}"`).toString().trim()
      const size = parseInt(stats, 10)

      chunkAnalysis.push({
        file,
        size,
        sizeKB: (size / 1024).toFixed(2),
        sizeMB: (size / (1024 * 1024)).toFixed(2),
        isLarge: size > THRESHOLD_CHUNK_SIZE,
      })
    }

    // Ordina per dimensione
    chunkAnalysis.sort((a, b) => b.size - a.size)

    return chunkAnalysis
  } catch (error) {
    console.error('❌ Errore durante l\'analisi dei chunk:', error.message)
    return []
  }
}

/**
 * Identifica chunk problematici
 */
function identifyProblematicChunks(chunkAnalysis) {
  const problems = []

  // Chunk troppo grandi
  const largeChunks = chunkAnalysis.filter(chunk => chunk.isLarge)
  if (largeChunks.length > 0) {
    problems.push({
      type: 'large-chunks',
      severity: 'high',
      message: `${largeChunks.length} chunk(s) superano la soglia di ${THRESHOLD_CHUNK_SIZE / 1024}KB`,
      chunks: largeChunks,
    })
  }

  // Dimensione totale
  const totalSize = chunkAnalysis.reduce((sum, chunk) => sum + chunk.size, 0)
  if (totalSize > THRESHOLD_TOTAL_SIZE) {
    problems.push({
      type: 'total-size',
      severity: 'medium',
      message: `Dimensione totale del bundle (${(totalSize / (1024 * 1024)).toFixed(2)}MB) supera la soglia di ${THRESHOLD_TOTAL_SIZE / (1024 * 1024)}MB`,
      totalSize,
    })
  }

  // Chunk duplicati o simili
  const chunkNames = chunkAnalysis.map(chunk => chunk.file)
  const duplicates = findDuplicateChunks(chunkNames)
  if (duplicates.length > 0) {
    problems.push({
      type: 'duplicate-chunks',
      severity: 'medium',
      message: `Trovati ${duplicates.length} chunk potenzialmente duplicati`,
      duplicates,
    })
  }

  return problems
}

/**
 * Trova chunk potenzialmente duplicati
 */
function findDuplicateChunks(chunkNames) {
  const duplicates = []
  const seen = new Set()

  for (const name of chunkNames) {
    const baseName = name.replace(/\.\d+\.js$/, '')
    if (seen.has(baseName)) {
      duplicates.push(name)
    } else {
      seen.add(baseName)
    }
  }

  return duplicates
}

/**
 * Genera raccomandazioni
 */
function generateRecommendations(problems, chunkAnalysis) {
  const recommendations = []

  if (problems.some(p => p.type === 'large-chunks')) {
    recommendations.push({
      priority: 'high',
      title: 'Ottimizza chunk grandi',
      description: 'Considera code splitting per chunk che superano 500KB',
      actions: [
        'Implementa lazy loading per componenti pesanti',
        'Usa dynamic imports per route non critiche',
        'Ottimizza immagini e assets',
      ],
    })
  }

  if (problems.some(p => p.type === 'total-size')) {
    recommendations.push({
      priority: 'medium',
      title: 'Riduci dimensione totale',
      description: 'Il bundle totale è troppo grande',
      actions: [
        'Rimuovi dipendenze non utilizzate',
        'Implementa tree shaking',
        'Comprimi assets con algoritmi più efficienti',
      ],
    })
  }

  // Analizza dipendenze
  const vendorChunks = chunkAnalysis.filter(chunk => chunk.file.includes('vendor'))
  if (vendorChunks.length > 0) {
    const vendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.size, 0)
    if (vendorSize > 1024 * 1024) { // 1MB
      recommendations.push({
        priority: 'medium',
        title: 'Ottimizza dipendenze vendor',
        description: `Le dipendenze vendor occupano ${(vendorSize / (1024 * 1024)).toFixed(2)}MB`,
        actions: [
          'Verifica dipendenze non utilizzate',
          'Considera alternative più leggere',
          'Implementa bundle splitting per vendor',
        ],
      })
    }
  }

  return recommendations
}

/**
 * Genera report finale
 */
function generateReport(chunkAnalysis, problems, recommendations) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalChunks: chunkAnalysis.length,
      totalSize: chunkAnalysis.reduce((sum, chunk) => sum + chunk.size, 0),
      largeChunks: chunkAnalysis.filter(chunk => chunk.isLarge).length,
      problems: problems.length,
    },
    chunks: chunkAnalysis,
    problems,
    recommendations,
  }

  // Salva report
  writeFileSync(BUNDLE_ANALYSIS_FILE, JSON.stringify(report, null, 2))

  // Stampa summary
  console.log('\n📋 Riepilogo Analisi Bundle:')
  console.log(`📦 Chunk totali: ${report.summary.totalChunks}`)
  console.log(`📏 Dimensione totale: ${(report.summary.totalSize / (1024 * 1024)).toFixed(2)}MB`)
  console.log(`⚠️  Chunk grandi: ${report.summary.largeChunks}`)
  console.log(`🚨 Problemi identificati: ${report.summary.problems}`)

  if (problems.length > 0) {
    console.log('\n🚨 Problemi trovati:')
    problems.forEach(problem => {
      console.log(`  - ${problem.severity.toUpperCase()}: ${problem.message}`)
    })
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Raccomandazioni:')
    recommendations.forEach(rec => {
      console.log(`  - ${rec.priority.toUpperCase()}: ${rec.title}`)
      console.log(`    ${rec.description}`)
    })
  }

  console.log(`\n📄 Report completo salvato in: ${BUNDLE_ANALYSIS_FILE}`)

  return report
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Avvio analisi bundle...\n')

  // Analizza bundle
  const bundleAnalyzed = analyzeBundle()
  if (!bundleAnalyzed) {
    process.exit(1)
  }

  // Analizza chunk
  const chunkAnalysis = analyzeChunkSizes()
  if (chunkAnalysis.length === 0) {
    console.error('❌ Nessun chunk trovato per l\'analisi')
    process.exit(1)
  }

  // Identifica problemi
  const problems = identifyProblematicChunks(chunkAnalysis)

  // Genera raccomandazioni
  const recommendations = generateRecommendations(problems, chunkAnalysis)

  // Genera report
  const report = generateReport(chunkAnalysis, problems, recommendations)

  // Exit code basato sui problemi
  const hasHighPriorityProblems = problems.some(p => p.severity === 'high')
  process.exit(hasHighPriorityProblems ? 1 : 0)
}

// Esegui se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}