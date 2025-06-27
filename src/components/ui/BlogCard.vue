<template>
  <article class="blog-card">
    <div class="blog-card__image" v-if="post.image">
      <img :src="post.image" :alt="post.title" loading="lazy" class="blog-card__img" />
    </div>

    <div class="blog-card__content">
      <div class="blog-card__meta">
        <time :datetime="post.date" class="blog-card__date">
          {{ formatDate(post.date) }}
        </time>
        <span class="blog-card__author">{{ post.author }}</span>
      </div>

      <h2 class="blog-card__title">
        <router-link :to="`/blog/${post.slug}`" class="blog-card__link">
          {{ post.title }}
        </router-link>
      </h2>

      <p class="blog-card__excerpt">{{ post.description }}</p>

      <div class="blog-card__tags">
        <span v-for="tag in post.tags" :key="tag" class="blog-card__tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPostMeta } from '@/utils/markdown'
import { formatDate } from '@/utils/markdown'

interface Props {
  post: BlogPostMeta
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.blog-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    transform var(--duration-md) var(--easing-smooth),
    box-shadow var(--duration-md) var(--easing-smooth);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &__image {
    height: 200px;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--duration-md) var(--easing-smooth);
  }

  &:hover .blog-card__img {
    transform: scale(1.05);
  }

  &__content {
    padding: var(--spacing-lg);
  }

  &__meta {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  &__date {
    font-style: italic;
  }

  &__title {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-lg);
    font-weight: 600;
    line-height: 1.3;
  }

  &__link {
    color: var(--color-text);
    text-decoration: none;
    transition: color var(--duration-sm) var(--easing-smooth);

    &:hover {
      color: var(--color-primary);
    }
  }

  &__excerpt {
    color: var(--color-text-muted);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  &__tag {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    font-weight: 500;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .blog-card,
  .blog-card__img {
    transition: none;
  }
}
</style>
