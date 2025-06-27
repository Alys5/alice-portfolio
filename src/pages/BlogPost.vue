<template>
  <div class="blog-post-page">
    <div class="container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner" aria-label="Caricamento post in corso" />
        <p>Caricamento post...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <h1 class="error-title">Post non trovato</h1>
        <p class="error-message">{{ error }}</p>
        <router-link to="/blog" class="back-button"> ← Torna al blog </router-link>
      </div>

      <!-- Post content -->
      <article v-else-if="post" class="blog-post">
        <!-- Header del post -->
        <header class="post-header">
          <div class="post-meta">
            <time :datetime="post.date" class="post-date">
              {{ formatDate(post.date) }}
            </time>
            <span class="post-author">di {{ post.author }}</span>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>

          <p class="post-description">{{ post.description }}</p>

          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">
              {{ tag }}
            </span>
          </div>
        </header>

        <!-- Immagine del post -->
        <div v-if="post.image" class="post-image">
          <img :src="post.image" :alt="post.title" class="post-image__img" loading="eager" />
        </div>

        <!-- Contenuto del post -->
        <div class="post-content">
          <div class="post-body" v-html="post.content" />
        </div>

        <!-- Footer del post -->
        <footer class="post-footer">
          <div class="post-share">
            <h3>Condividi questo post</h3>
            <div class="share-buttons">
              <button
                @click="shareOnTwitter"
                class="share-button share-button--twitter"
                aria-label="Condividi su Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
                Twitter
              </button>

              <button
                @click="shareOnLinkedIn"
                class="share-button share-button--linkedin"
                aria-label="Condividi su LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                LinkedIn
              </button>
            </div>
          </div>

          <router-link to="/blog" class="back-to-blog"> ← Torna al blog </router-link>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlog } from '@/composables/useBlog'
import { useMeta } from '@/composables/useMeta'
import type { BlogPost } from '@/utils/markdown'

// Route
const route = useRoute()

// Composables
const { loading, error, loadPost, formatDate } = useBlog()
const { setBlogPostMeta } = useMeta()

// State
const post = ref<BlogPost | null>(null)

// Computed
const slug = computed(() => route.params.slug as string)

// Methods
const loadPostData = async () => {
  if (slug.value) {
    post.value = await loadPost(slug.value)

    // Imposto i meta tag per il post del blog
    if (post.value) {
      setBlogPostMeta({
        title: post.value.title,
        description: post.value.description,
        image: post.value.image,
        author: post.value.author,
        publishedAt: post.value.date,
        tags: post.value.tags,
      })
    }
  }
}

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value?.title || '')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

const shareOnLinkedIn = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
}

// Lifecycle
onMounted(() => {
  loadPostData()
})

// Watch per cambi di route
watch(slug, () => {
  loadPostData()
})
</script>

<style scoped lang="scss">
.blog-post-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background: var(--color-surface);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.loading-container,
.error-container {
  text-align: center;
  padding: var(--spacing-xxl) 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-title {
  font-size: var(--font-size-xl);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.error-message {
  color: var(--color-danger);
  margin-bottom: var(--spacing-lg);
}

.back-button,
.back-to-blog {
  display: inline-flex;
  align-items: center;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--duration-sm) var(--easing-smooth);

  &:hover {
    color: var(--color-primary-hover);
  }
}

.blog-post {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.post-header {
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  text-align: center;
}

.post-meta {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.post-date {
  font-style: italic;
}

.post-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.post-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.post-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.post-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.post-image {
  width: 100%;
  height: 400px;
  overflow: hidden;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.post-content {
  padding: var(--spacing-xl);
}

.post-body {
  font-size: var(--font-size-base);
  line-height: 1.8;
  color: var(--color-text);

  // Stili per il contenuto markdown
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    color: var(--color-text);
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
    font-weight: 600;
  }

  :deep(h1) {
    font-size: var(--font-size-xl);
  }
  :deep(h2) {
    font-size: var(--font-size-lg);
  }
  :deep(h3) {
    font-size: var(--font-size-base);
  }

  :deep(p) {
    margin-bottom: var(--spacing-md);
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);
  }

  :deep(blockquote) {
    border-left: 4px solid var(--color-primary);
    padding-left: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
    font-style: italic;
    color: var(--color-text-muted);
  }

  :deep(code) {
    background: var(--color-surface-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
  }

  :deep(pre) {
    background: var(--color-surface-secondary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: var(--spacing-lg) 0;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(a) {
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color var(--duration-sm) var(--easing-smooth);

    &:hover {
      border-bottom-color: var(--color-primary);
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: var(--spacing-lg) 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: var(--spacing-lg) 0;
  }

  :deep(th),
  :deep(td) {
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    text-align: left;
  }

  :deep(th) {
    background: var(--color-surface-secondary);
    font-weight: 600;
  }
}

.post-footer {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.post-share {
  h3 {
    font-size: var(--font-size-base);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }
}

.share-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.share-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-sm) var(--easing-smooth);

  &--twitter {
    background: var(--color-twitter);
    color: white;

    &:hover {
      background: var(--color-twitter-hover);
    }
  }

  &--linkedin {
    background: var(--color-linkedin);
    color: white;

    &:hover {
      background: var(--color-linkedin-hover);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

// Responsive
@media (max-width: 768px) {
  .post-header,
  .post-content,
  .post-footer {
    padding: var(--spacing-lg);
  }

  .post-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-image {
    height: 250px;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
}
</style>
