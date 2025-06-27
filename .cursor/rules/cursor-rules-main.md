# Cursor Rules – alice-portfolio

## Contesto Progetto

Applicazione Vue 3 + Vite con stack:

- Vue 3.5, Pinia 3, Vue Router 4, Vue I18n 11
- Vitest 3, Cypress 14, Vue Test Utils 2.4
- Vite 6, TypeScript 5.8

## Task Guidati Supportati

1. **Documentazione Automatica**

   - Genera JSDoc per componenti Vue (props, emits, slots)
   - Documenta store Pinia (azioni, getter, state)
   - Descrive route (lazy-loading, meta tags)
   - Fornisce istruzioni per l'uso con i18n

2. **Debugging Guidato**

   - Identifica errori comuni Vue 3 (mutazioni props, reattività)
   - Controlla memory leak (eventi non rimossi in `onUnmounted`)
   - Verifica problemi i18n (chiavi mancanti, formattazione)
   - Segnala conflitti Vue Router (route sovrapposte)

3. **Ottimizzazione Prestazioni**

   - Suggerisce miglioramenti bundle Vite (dynamic imports, code-splitting)
   - Ottimizza reattività Pinia (`storeToRefs`, computate)
   - Suggerisce lazy-loading componenti
   - Ottimizza re-render (v-memo, key strategiche)

4. **Generazione Codice**
   - Riscrive codice in Composition API
   - Genera test Vitest per il componente corrente
   - Crea componenti utility (SkeletonLoader, ErrorBoundary)
   - Implementa funzioni i18n avanzate (formattazione, pluralizzazione)

## Istruzioni Operative

1. Usa `Ctrl+L` per aprire la chat contestuale
2. Incolla il prompt completo
3. Specifica il tipo di task (es: "Documenta questo componente")
4. Per modifiche mirate: seleziona codice → `Ctrl+K` + comando breve

## Comandi Rapidi

- `//doc`: Genera JSDoc per la funzione selezionata
- `//fix`: Corregge errori comuni nel blocco selezionato
- `//test`: Crea test Vitest per il componente corrente
- `//i18n`: Ottimizza funzioni di traduzione

> Consulta anche [docs/structure.md](mdc:docs/structure.md) per convenzioni di struttura e commento.
