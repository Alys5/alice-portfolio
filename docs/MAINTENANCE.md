# 🛠️ Sistema Manutenzione - Alice Mandelli Portfolio

Sistema completo per gestire la modalità manutenzione del portfolio di Alice Mandelli, con ambienti separati per produzione e sviluppo.

## 🎯 Panoramica

Il sistema permette di:

- ✅ Attivare/disattivare la modalità manutenzione solo in produzione
- ✅ Mantenere un ambiente di sviluppo sempre accessibile
- ✅ Gestire form di contatto durante la manutenzione
- ✅ Deploy automatici con configurazioni separate

## 🏗️ Architettura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Production    │    │   Development   │    │   Maintenance   │
│                 │    │                 │    │                 │
│ • Sito completo │    │ • Sito completo │    │ • Pagina        │
│ • URL principale│    │ • URL preview   │    │   manutenzione  │
│ • Vercel prod   │    │ • Vercel dev    │    │ • Form contatto │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Attivare Modalità Manutenzione

```bash
# Deploy con manutenzione attiva
npm run deploy:maintenance

# Oppure direttamente
./deploy-maintenance.sh
```

### 2. Disattivare Modalità Manutenzione

```bash
# Deploy in modalità normale
npm run deploy:normal

# Oppure direttamente
./deploy-normal.sh
```

### 3. Creare Ambiente di Sviluppo

```bash
# Crea ambiente di sviluppo separato
npm run deploy:dev

# Oppure direttamente
./create-development-env.sh
```

## 📁 Struttura File

```
├── src/views/MaintenanceView.vue     # Pagina di manutenzione
├── api/maintenance-toggle.js         # API per toggle manutenzione
├── deploy-maintenance.sh             # Script deploy manutenzione
├── deploy-normal.sh                  # Script deploy normale
├── create-development-env.sh         # Script crea ambiente dev
├── vercel.json                       # Configurazione Vercel
└── README-MAINTENANCE.md             # Questa documentazione
```

## 🔧 Configurazione

### Variabili d'Ambiente

```bash
# Produzione con manutenzione
VITE_MAINTENANCE_MODE=true

# Produzione normale
VITE_MAINTENANCE_MODE=false

# Sviluppo locale
VITE_MAINTENANCE_MODE=false
```

### Vercel Configuration

Il sistema utilizza configurazioni Vercel separate:

- **Produzione**: `vercel.json` (configurazione principale)
- **Manutenzione**: Configurazione temporanea con `VITE_MAINTENANCE_MODE=true`
- **Sviluppo**: Ambiente separato con URL dedicato

## 🎨 Pagina di Manutenzione

### Caratteristiche

- ✅ **Design Glassmorphism** con palette Alice Mandelli
- ✅ **Form di contatto** completo per preventivi
- ✅ **Accessibilità WCAG 2.2+** con skip links e screen reader
- ✅ **Responsive design** ottimizzato per tutti i dispositivi
- ✅ **Micro-animazioni** fluide e performanti
- ✅ **Analytics tracking** per monitoraggio conversioni

### Form di Contatto

Il form include:

- Nome completo
- Email
- Tipo di richiesta (preventivo, progetto, consulenza)
- Budget stimato
- Messaggio dettagliato
- Privacy policy

### Validazione e Feedback

- ✅ Validazione client-side
- ✅ Messaggi di errore accessibili
- ✅ Loading states
- ✅ Conferma invio
- ✅ Analytics tracking

## 🔄 Workflow di Deploy

### 1. Deploy Manutenzione

```bash
# 1. Backup configurazione
cp vercel.json vercel.json.backup

# 2. Configura manutenzione
export VITE_MAINTENANCE_MODE=true

# 3. Build
npm run build

# 4. Deploy
vercel deploy --prod --yes

# 5. Ripristina configurazione
mv vercel.json.backup vercel.json
```

### 2. Deploy Normale

```bash
# 1. Backup configurazione
cp vercel.json vercel.json.backup

# 2. Configura normale
export VITE_MAINTENANCE_MODE=false

# 3. Build
npm run build

# 4. Deploy
vercel deploy --prod --yes

# 5. Ripristina configurazione
mv vercel.json.backup vercel.json
```

### 3. Ambiente di Sviluppo

```bash
# 1. Crea ambiente separato
vercel deploy --yes

# 2. Crea alias permanente
vercel alias set [preview-url] alice-portfolio-dev.vercel.app

# 3. Salva URL per riferimento
echo "[preview-url]" > .development-url
```

## 📊 Monitoraggio

### Analytics

Il sistema traccia automaticamente:

- Visite alla pagina di manutenzione
- Invii del form di contatto
- Errori e performance

### Logs

```bash
# Verifica status manutenzione
curl https://alice-portfolio.vercel.app/api/maintenance-toggle

# Verifica ambiente sviluppo
curl https://alice-portfolio-dev.vercel.app/api/maintenance-toggle
```

## 🔒 Sicurezza

### API Protection

- ✅ Secret key per toggle manutenzione
- ✅ CORS configurato correttamente
- ✅ Rate limiting implicito Vercel
- ✅ Headers di sicurezza

### Environment Variables

```bash
# Vercel Dashboard → Settings → Environment Variables
MAINTENANCE_SECRET=your-secret-key-here
VERCEL_TOKEN=your-vercel-token
```

## 🛠️ Script Disponibili

```bash
# Deploy
npm run deploy:maintenance    # Deploy con manutenzione
npm run deploy:normal         # Deploy normale
npm run deploy:dev           # Crea ambiente sviluppo

# Build
npm run build:maintenance    # Build con manutenzione
npm run build:normal         # Build normale

# Sviluppo
npm run dev                  # Server locale
npm run preview              # Preview build
```

## 🔍 Troubleshooting

### Problemi Comuni

1. **Deploy fallisce**

   ```bash
   # Verifica token
   echo $VERCEL_TOKEN

   # Verifica configurazione
   cat vercel.json
   ```

2. **Manutenzione non si attiva**

   ```bash
   # Verifica variabile ambiente
   echo $VITE_MAINTENANCE_MODE

   # Rebuild con variabile
   VITE_MAINTENANCE_MODE=true npm run build
   ```

3. **Form non funziona**
   ```bash
   # Verifica console browser
   # Controlla network tab
   # Verifica CORS headers
   ```

### Debug

```bash
# Modalità debug
DEBUG=1 ./deploy-maintenance.sh

# Log dettagliati
VERCEL_TOKEN=xxx VERBOSE=1 ./deploy-normal.sh
```

## 📈 Performance

### Ottimizzazioni

- ✅ **Bundle splitting** per manutenzione
- ✅ **Lazy loading** componenti
- ✅ **Image optimization** automatica
- ✅ **Cache headers** configurati
- ✅ **CDN** Vercel Edge Network

### Core Web Vitals

Target per pagina manutenzione:

- 🎯 **LCP**: < 1.5s
- 🎯 **FID**: < 50ms
- 🎯 **CLS**: < 0.05

## 🔄 Automazione

### GitHub Actions

Il sistema si integra con CI/CD esistente:

```yaml
# .github/workflows/maintenance.yml
name: Maintenance Mode
on:
  workflow_dispatch:
    inputs:
      action:
        description: 'Azione manutenzione'
        required: true
        type: choice
        options:
          - enable
          - disable
```

### Webhook Integration

```bash
# Toggle via webhook
curl -X POST https://alice-portfolio.vercel.app/api/maintenance-toggle \
  -H "Content-Type: application/json" \
  -d '{"action":"enable","secret":"your-secret"}'
```

## 📞 Supporto

### Contatti

Per problemi o domande:

1. Controlla questa documentazione
2. Verifica logs Vercel
3. Controlla configurazione ambiente
4. Contatta team di sviluppo

### Risorse

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 📖 [Vue.js Guide](https://vuejs.org/guide)
- 📖 [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Autore**: Alice Mandelli Portfolio System  
**Versione**: 1.0.0  
**Ultimo aggiornamento**: $(date +'%d/%m/%Y')

## 🎉 Status

![Maintenance Mode](https://img.shields.io/badge/Maintenance-Ready-green)
![Development Environment](https://img.shields.io/badge/Development-Available-blue)
![Security](https://img.shields.io/badge/Security-Protected-red)
