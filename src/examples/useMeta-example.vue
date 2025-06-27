<template>
  <div class="meta-example">
    <h1>Esempio utilizzo useMeta</h1>

    <div class="meta-controls">
      <h2>Controlli Meta Tag</h2>

      <div class="form-group">
        <label for="title">Title:</label>
        <input
          id="title"
          v-model="metaConfig.title"
          type="text"
          placeholder="Titolo della pagina"
        />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          id="description"
          v-model="metaConfig.description"
          placeholder="Descrizione della pagina"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="keywords">Keywords:</label>
        <input
          id="keywords"
          v-model="metaConfig.keywords"
          type="text"
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>

      <div class="form-group">
        <label for="ogImage">OG Image:</label>
        <input
          id="ogImage"
          v-model="metaConfig.ogImage"
          type="url"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div class="buttons">
        <button @click="applyCustomMeta" class="btn btn-primary">
          Applica Meta Tag Personalizzati
        </button>

        <button @click="applyPortfolioMeta" class="btn btn-secondary">Meta Tag Portfolio</button>

        <button @click="applyAboutMeta" class="btn btn-secondary">Meta Tag About</button>

        <button @click="applyContactMeta" class="btn btn-secondary">Meta Tag Contact</button>

        <button @click="resetMeta" class="btn btn-danger">Reset Meta Tag</button>
      </div>
    </div>

    <div class="meta-preview">
      <h2>Anteprima Meta Tag Correnti</h2>
      <pre>{{ JSON.stringify(currentMeta, null, 2) }}</pre>
    </div>

    <div class="blog-post-example">
      <h2>Esempio Post Blog</h2>

      <div class="form-group">
        <label for="postTitle">Titolo Post:</label>
        <input id="postTitle" v-model="blogPost.title" type="text" placeholder="Titolo del post" />
      </div>

      <div class="form-group">
        <label for="postDescription">Descrizione Post:</label>
        <textarea
          id="postDescription"
          v-model="blogPost.description"
          placeholder="Descrizione del post"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="postImage">Immagine Post:</label>
        <input
          id="postImage"
          v-model="blogPost.image"
          type="url"
          placeholder="https://example.com/post-image.jpg"
        />
      </div>

      <div class="form-group">
        <label for="postTags">Tag Post:</label>
        <input
          id="postTags"
          v-model="postTagsInput"
          type="text"
          placeholder="Vue.js, Design, AI"
          @input="updatePostTags"
        />
      </div>

      <button @click="applyBlogPostMeta" class="btn btn-primary">Applica Meta Tag Post Blog</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMeta } from '@/composables/useMeta'

// Composable
const {
  currentMeta,
  setPageMeta,
  setBlogPostMeta,
  setPortfolioMeta,
  setAboutMeta,
  setContactMeta,
  resetMeta,
} = useMeta()

// Configurazione meta tag personalizzati
const metaConfig = reactive({
  title: '',
  description: '',
  keywords: '',
  ogImage: '',
})

// Configurazione post blog
const blogPost = reactive({
  title: '',
  description: '',
  image: '',
  author: 'Alice Mandelli',
  publishedAt: new Date().toISOString().split('T')[0],
  tags: [] as string[],
})

const postTagsInput = ref('')

// Metodi
const applyCustomMeta = () => {
  setPageMeta({
    title: metaConfig.title,
    description: metaConfig.description,
    keywords: metaConfig.keywords,
    ogImage: metaConfig.ogImage,
  })
}

const applyPortfolioMeta = () => {
  setPortfolioMeta()
}

const applyAboutMeta = () => {
  setAboutMeta()
}

const applyContactMeta = () => {
  setContactMeta()
}

const updatePostTags = () => {
  blogPost.tags = postTagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

const applyBlogPostMeta = () => {
  setBlogPostMeta({
    title: blogPost.title,
    description: blogPost.description,
    image: blogPost.image,
    author: blogPost.author,
    publishedAt: blogPost.publishedAt,
    tags: blogPost.tags,
  })
}
</script>

<style scoped lang="scss">
.meta-example {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.meta-controls,
.meta-preview,
.blog-post-example {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.form-group {
  margin-bottom: var(--spacing-md);

  label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
    color: var(--color-text);
  }

  input,
  textarea {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-base);
    background: var(--color-surface);
    color: var(--color-text);

    &:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
}

.buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-lg);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-sm) var(--easing-smooth);

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &--primary {
    background: var(--color-primary);
    color: white;

    &:hover {
      background: var(--color-primary-hover);
    }
  }

  &--secondary {
    background: var(--color-secondary);
    color: white;

    &:hover {
      background: var(--color-secondary-hover);
    }
  }

  &--danger {
    background: var(--color-danger);
    color: white;

    &:hover {
      background: var(--color-danger-hover);
    }
  }
}

.meta-preview pre {
  background: var(--color-surface-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
