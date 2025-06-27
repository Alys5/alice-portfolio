const loaded = new Map()

export async function loadLocaleMessages(locale: string) {
  if (loaded.has(locale)) return loaded.get(locale)
  try {
    const messages = await import(/* @vite-ignore */ `./data/i18n.${locale}.ts`)
    loaded.set(locale, messages.default)
    return messages.default
  } catch (e) {
    console.warn(`[i18n] Traduzioni mancanti per locale: ${locale}`)
    loaded.set(locale, {})
    return {}
  }
}
