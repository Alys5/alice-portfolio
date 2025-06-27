// Sass Migrator Configuration
// Per migrare da @import deprecato a @use/@forward
module.exports = {
  // Configurazione per il migratore Sass
  rules: {
    // Regole per la migrazione
    'import-to-use': 'error',
    'import-to-forward': 'warn',
    'no-deprecated-import': 'error'
  },

  // Percorsi da escludere
  exclude: [
    'node_modules/**',
    'dist/**',
    '.git/**'
  ],

  // Configurazione per i moduli
  modules: {
    // Namespace per le variabili
    variables: {
      namespace: 'vars',
      path: '@/styles/variables'
    },

    // Namespace per le animazioni
    animations: {
      namespace: 'anim',
      path: '@/styles/animations'
    }
  },

  // Configurazione per il forward
  forward: {
    // File che devono essere forwardati
    files: [
      '@/styles/variables',
      '@/styles/animations'
    ]
  }
}
