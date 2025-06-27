# Configurazione GitHub Secrets per Lighthouse CI

## Panoramica

Per utilizzare completamente i test di accessibilità con Lighthouse CI, è necessario configurare alcuni secrets nel repository GitHub.

## Secrets Richiesti

### 1. LHCI_GITHUB_APP_TOKEN

**Scopo**: Token per l'integrazione con GitHub App di Lighthouse CI

**Configurazione**:

1. Vai su [Lighthouse CI GitHub App](https://github.com/apps/lighthouse-ci)
2. Clicca "Install"
3. Seleziona il repository `alice-portfolio`
4. Copia il token generato

**Aggiunta al repository**:

1. Vai su `Settings` → `Secrets and variables` → `Actions`
2. Clicca "New repository secret"
3. Nome: `LHCI_GITHUB_APP_TOKEN`
4. Valore: Token copiato dall'App

### 2. Secrets Esistenti (Vercel)

I seguenti secrets sono già configurati per il deploy:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Configurazione Opzionale

### Lighthouse CI Dashboard

Per visualizzare i risultati su dashboard esterna:

1. Vai su [Lighthouse CI](https://lhci.app)
2. Crea un nuovo progetto
3. Copia il token del progetto
4. Aggiungi come secret: `LHCI_TOKEN`

### Notifiche Slack/Discord

Per notifiche automatiche:

1. Crea webhook per il canale
2. Aggiungi come secret: `WEBHOOK_URL`

## Verifica Configurazione

### Test Locale

```bash
# Verifica che i test funzionino
npm run test:accessibility:ci
```

### Test CI

1. Fai push su branch `main` o crea PR
2. Controlla l'action `Accessibility Tests`
3. Verifica che i commenti automatici appaiano su PR

## Troubleshooting

### Errore: "LHCI_GITHUB_APP_TOKEN not found"

**Soluzione**: Aggiungi il secret nel repository

### Errore: "Lighthouse CI failed"

**Possibili cause**:

- Server preview non raggiungibile
- Timeout durante i test
- Problemi di accessibilità < 95%

**Soluzioni**:

1. Controlla i log dell'action
2. Verifica che il build sia corretto
3. Correggi problemi di accessibilità

### Errore: "axe-core tests failed"

**Possibili cause**:

- Violazioni WCAG 2.2 AA
- File HTML non trovati
- Problemi di configurazione

**Soluzioni**:

1. Esegui test locali: `npm run test:accessibility`
2. Correggi violazioni segnalate
3. Verifica configurazione axe-core

## Monitoraggio

### Dashboard Lighthouse CI

- **URL**: https://googlechrome.github.io/lighthouse-ci/viewer/
- **Funzionalità**: Storico test, trend, confronti

### GitHub Actions

- **Logs**: Disponibili in Actions tab
- **Artifacts**: Risultati scaricabili
- **Comments**: Automatici su PR

## Best Practices

### 1. Test Pre-commit

```bash
# Prima del commit
npm run test:accessibility
```

### 2. Monitoraggio Continuo

- Controlla regolarmente i risultati CI
- Monitora trend di performance
- Risolvi problemi rapidamente

### 3. Documentazione

- Aggiorna `docs/accessibility-testing.md`
- Documenta nuove regole WCAG
- Mantieni esempi di correzione

## Contatti

Per problemi con la configurazione:

- **Issues**: GitHub repository
- **Documentazione**: `/docs/github-secrets-setup.md`
- **Lighthouse CI**: [GitHub App](https://github.com/apps/lighthouse-ci)
