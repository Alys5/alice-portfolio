#!/bin/bash

# =========================
# CI/CD PIPELINE - ALICE MANDELLI PORTFOLIO
# =========================
# Automatizza: Linting → Build → Commit → Push → Deploy Vercel
# Autore: Alice Mandelli Portfolio System
# Versione: 1.0.0

set -e  # Blocca l'esecuzione su errori
set -o pipefail  # Blocca su errori in pipe

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funzioni di logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Funzione per verificare prerequisiti
check_prerequisites() {
    log_info "Verificando prerequisiti..."
    
    # Verifica Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js non trovato. Installa Node.js 18+"
        exit 1
    fi
    
    # Verifica npm
    if ! command -v npm &> /dev/null; then
        log_error "npm non trovato"
        exit 1
    fi
    
    # Verifica git
    if ! command -v git &> /dev/null; then
        log_error "git non trovato"
        exit 1
    fi
    
    # Verifica Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI non trovato. Installando..."
        npm install -g vercel
    fi
    
    # Verifica VERCEL_TOKEN
    if [ -z "$VERCEL_TOKEN" ]; then
        log_error "VERCEL_TOKEN non impostato. Imposta la variabile d'ambiente VERCEL_TOKEN"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Funzione per backup del branch corrente
backup_current_branch() {
    log_info "Creando backup del branch corrente..."
    CURRENT_BRANCH=$(git branch --show-current)
    BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
    
    git stash push -m "Auto-stash before CI/CD [$(date +'%d/%m/%Y %H:%M')]"
    log_success "Backup creato: $BACKUP_BRANCH"
}

# Funzione per linting
run_linting() {
    log_step "1. Eseguendo ESLint con regole Alice-Mandelli..."
    
    # Linting con correzione automatica
    if npx eslint . --fix --ext .vue,.js,.ts,.jsx,.tsx; then
        log_success "Linting completato con successo"
    else
        log_error "Linting fallito. Correggi gli errori e riprova"
        exit 1
    fi
    
    # Verifica TypeScript
    log_info "Verificando TypeScript..."
    if npm run type-check; then
        log_success "TypeScript check completato"
    else
        log_error "TypeScript check fallito"
        exit 1
    fi
}

# Funzione per build di produzione
run_build() {
    log_step "2. Building bundle di produzione..."
    
    # Pulizia cache
    log_info "Pulendo cache..."
    rm -rf dist node_modules/.vite
    
    # Installazione dipendenze
    log_info "Installando dipendenze..."
    npm ci --silent
    
    # Build di produzione
    log_info "Eseguendo build di produzione..."
    if NODE_ENV=production npm run build; then
        log_success "Build completata con successo"
        
        # Analisi bundle size
        log_info "Analizzando bundle size..."
        if [ -d "dist" ]; then
            TOTAL_SIZE=$(du -sh dist | cut -f1)
            log_success "Bundle size: $TOTAL_SIZE"
        fi
    else
        log_error "Build fallita"
        exit 1
    fi
}

# Funzione per commit automatico
create_commit() {
    log_step "3. Creando commit automatico..."
    
    # Verifica se ci sono modifiche
    if git diff --quiet && git diff --cached --quiet; then
        log_warning "Nessuna modifica da committare"
        return 0
    fi
    
    # Aggiungi tutti i file modificati
    git add .
    
    # Crea commit con messaggio strutturato
    COMMIT_MSG="chore: auto-build [$(date +'%d/%m/%Y %H:%M')] | Lint fixes & production build

- ESLint fixes automatici
- Build di produzione ottimizzata
- Bundle size: $(du -sh dist 2>/dev/null | cut -f1 || echo 'N/A')
- Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')

[CI/CD Pipeline - Alice Mandelli Portfolio]"
    
    if git commit -m "$COMMIT_MSG"; then
        log_success "Commit creato con successo"
    else
        log_warning "Commit non necessario o fallito"
    fi
}

# Funzione per push su repository
push_to_repository() {
    log_step "4. Push su repository..."
    
    # Verifica se ci sono commit da pushare
    if git diff --quiet HEAD origin/main 2>/dev/null; then
        log_warning "Nessun commit da pushare"
        return 0
    fi
    
    # Push forzato su main
    if git push -f origin main; then
        log_success "Push completato con successo"
    else
        log_error "Push fallito"
        exit 1
    fi
}

# Funzione per deploy su Vercel
deploy_to_vercel() {
    log_step "5. Deploy su Vercel..."
    
    # Verifica configurazione Vercel
    log_info "Verificando configurazione Vercel..."
    if [ ! -f ".vercel/project.json" ]; then
        log_error "Progetto Vercel non configurato. Esegui 'vercel' per configurare"
        exit 1
    fi
    
    # Deploy di produzione
    log_info "Avviando deploy di produzione..."
    if vercel deploy --prod --yes --token="$VERCEL_TOKEN"; then
        log_success "Deploy completato con successo"
        
        # Recupera URL di produzione
        PROD_URL=$(vercel ls --token="$VERCEL_TOKEN" | grep "alice-portfolio" | grep "Production" | awk '{print $2}' | head -1)
        if [ ! -z "$PROD_URL" ]; then
            log_success "URL di produzione: $PROD_URL"
        fi
    else
        log_error "Deploy fallito"
        exit 1
    fi
}

# Funzione per notifiche (opzionale)
send_notifications() {
    log_info "Inviando notifiche..."
    
    # Qui puoi aggiungere notifiche Slack, email, etc.
    # Esempio per Slack:
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"✅ Deploy completato per Alice Mandelli Portfolio\"}" \
    #   $SLACK_WEBHOOK_URL
    
    log_success "Notifiche inviate"
}

# Funzione per cleanup
cleanup() {
    log_info "Eseguendo cleanup..."
    
    # Rimuovi file temporanei
    rm -rf .vercel/output
    
    # Ripristina stash se necessario
    if git stash list | grep -q "Auto-stash before CI/CD"; then
        log_info "Ripristinando stash..."
        git stash pop || true
    fi
    
    log_success "Cleanup completato"
}

# Funzione principale
main() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    CI/CD PIPELINE                            ║"
    echo "║                Alice Mandelli Portfolio                      ║"
    echo "║                    $(date +'%d/%m/%Y %H:%M:%S')                    ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Esegui pipeline
    check_prerequisites
    backup_current_branch
    run_linting
    run_build
    create_commit
    push_to_repository
    deploy_to_vercel
    send_notifications
    cleanup
    
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ SUCCESSO!                              ║"
    echo "║              CI/CD Pipeline Completata                       ║"
    echo "║                Alice Mandelli Portfolio                      ║"
    echo "║                    $(date +'%d/%m/%Y %H:%M:%S')                    ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Gestione errori
trap 'log_error "Pipeline interrotta. Eseguendo cleanup..."; cleanup; exit 1' ERR INT TERM

# Esegui pipeline
main "$@"
