# Componenti UI - VMarkdownEditor

## VMarkdownEditor

Un editor markdown completo e accessibile con supporto per upload immagini, preview in tempo reale e salvataggio locale.

### Caratteristiche

- ✨ **Editor markdown avanzato** con toolbar completa
- 🖼️ **Upload immagini** con drag & drop e paste
- 👀 **Preview in tempo reale** del contenuto renderizzato
- 💾 **Salvataggio automatico** con localStorage
- 🎨 **Modalità schermo intero** per editing immersivo
- ♿ **Accessibilità completa** con supporto screen reader
- 📱 **Responsive design** per mobile e desktop
- ⚡ **Performance ottimizzate** con debouncing

### Utilizzo

```vue
<template>
  <VMarkdownEditor
    v-model="content"
    placeholder="Scrivi il tuo contenuto..."
    :autosave="true"
    :autosave-delay="3000"
    @save="handleSave"
    @image-upload="handleImageUpload"
  />
</template>

<script setup>
import VMarkdownEditor from '@/components/ui/VMarkdownEditor.vue'

const content = ref('')

const handleSave = (savedContent) => {
  console.log('Contenuto salvato:', savedContent)
}

const handleImageUpload = (files) => {
  console.log('Immagini caricate:', files)
}
</script>
```

### Props

| Prop            | Tipo      | Default                                    | Descrizione                          |
| --------------- | --------- | ------------------------------------------ | ------------------------------------ |
| `modelValue`    | `string`  | `''`                                       | Contenuto markdown                   |
| `placeholder`   | `string`  | `'Scrivi il tuo contenuto in markdown...'` | Placeholder per l'editor             |
| `autosave`      | `boolean` | `true`                                     | Abilita il salvataggio automatico    |
| `autosaveDelay` | `number`  | `2000`                                     | Delay per l'autosave in millisecondi |

### Events

| Event               | Payload    | Descrizione                              |
| ------------------- | ---------- | ---------------------------------------- |
| `update:modelValue` | `string`   | Emesso quando il contenuto cambia        |
| `save`              | `string`   | Emesso quando il contenuto viene salvato |
| `image-upload`      | `FileList` | Emesso quando vengono caricate immagini  |

### Toolbar

L'editor include una toolbar completa con i seguenti strumenti:

- **Grassetto** (Ctrl+B) - `**testo**`
- **Corsivo** (Ctrl+I) - `*testo*`
- **Titolo** - `# Titolo`
- **Link** - `[testo](url)`
- **Immagine** - `![alt](url)`
- **Lista** - `- elemento`
- **Codice** - `` `codice` ``
- **Citazione** - `> citazione`

### Upload Immagini

L'editor supporta il caricamento di immagini tramite:

1. **Drag & Drop** - Trascina le immagini nell'editor
2. **Paste** - Incolla immagini dalla clipboard (Ctrl+V)
3. **Toolbar** - Clicca sull'icona immagine nella toolbar

Le immagini vengono inserite automaticamente nel formato markdown:

```markdown
![nome-immagine](/uploads/nome-immagine.jpg)
```

### Accessibilità

- ✅ **Navigazione tastiera** completa
- ✅ **Screen reader** support
- ✅ **Focus management** appropriato
- ✅ **ARIA labels** e descrizioni
- ✅ **Live regions** per annunci dinamici
- ✅ **Reduced motion** support

### Stili

L'editor utilizza le variabili CSS del design system:

```scss
:root {
  --color-primary: hsl(220, 85%, 60%);
  --color-surface: hsl(0, 0%, 100%);
  --color-text: hsl(220, 15%, 15%);
  --spacing-md: 1rem;
  --radius-md: 0.5rem;
  // ... altre variabili
}
```

### Esempi Avanzati

#### Editor con validazione personalizzata

```vue
<template>
  <VMarkdownEditor v-model="content" @save="validateAndSave" />
</template>

<script setup>
const validateAndSave = (content) => {
  if (content.length < 100) {
    alert('Il contenuto deve essere di almeno 100 caratteri')
    return
  }

  // Salva il contenuto
  saveToServer(content)
}
</script>
```

#### Editor con upload immagini personalizzato

```vue
<template>
  <VMarkdownEditor v-model="content" @image-upload="handleCustomUpload" />
</template>

<script setup>
const handleCustomUpload = async (files) => {
  for (const file of files) {
    try {
      const uploadedUrl = await uploadToCloud(file)
      const imageMarkdown = `![${file.name}](${uploadedUrl})\n`
      content.value += imageMarkdown
    } catch (error) {
      console.error('Errore upload:', error)
    }
  }
}
</script>
```

### Integrazione con Blog

L'editor è perfettamente integrato con il sistema blog esistente:

```vue
<template>
  <div class="blog-editor">
    <!-- Metadati post -->
    <div class="post-metadata">
      <input v-model="post.title" placeholder="Titolo" />
      <textarea v-model="post.description" placeholder="Descrizione" />
    </div>

    <!-- Editor markdown -->
    <VMarkdownEditor v-model="post.content" @save="savePost" />
  </div>
</template>
```

### Performance

- **Debouncing** per l'autosave (evita troppi salvataggi)
- **Lazy loading** per componenti pesanti
- **Memory management** per le immagini caricate
- **Efficient rendering** con Vue 3 reactivity

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Note di Sviluppo

- Utilizza `marked` per il rendering markdown
- `@vueuse/core` per utilities reattive
- Supporto completo per TypeScript
- Testato con axe-core per accessibilità
