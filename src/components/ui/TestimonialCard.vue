<template>
  <div
    class="testimonial-card"
    :class="{ 'is-visible': isVisible }"
  >
    <!-- Rating -->
    <div class="testimonial-rating">
      <div class="stars">
        <span
          v-for="i in 5"
          :key="i"
          class="star"
          :class="{ 'is-filled': i <= props.testimonial.rating }"
        >
          ★
        </span>
      </div>
    </div>

    <!-- Contenuto testimonial -->
    <div class="testimonial-content">
      <blockquote class="testimonial-text">
        "{{ props.testimonial.content }}"
      </blockquote>
    </div>

    <!-- Autore testimonial -->
    <div class="testimonial-author">
      <div class="author-avatar" v-if="props.testimonial.avatar">
        <img
          :src="props.testimonial.avatar"
          :alt="`Foto di ${props.testimonial.name}`"
          loading="lazy"
          @error="handleImageError"
        />
      </div>

      <div class="author-info">
        <h4 class="author-name">{{ props.testimonial.name }}</h4>
        <p class="author-role">{{ props.testimonial.role }}</p>
        <p class="author-company">{{ props.testimonial.company }}</p>
      </div>
    </div>

    <!-- Elemento decorativo -->
    <div class="card-decoration"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props interface
interface Props {
  testimonial: {
    id: string
    name: string
    role: string
    company: string
    content: string
    rating: number
    avatar?: string
  }
}

const props = defineProps<Props>()

// Reactive state
const isVisible = ref(false)

// Event handlers
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholder-avatar.jpg'
}

// Lifecycle
onMounted(() => {
  // Trigger visibility animation
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<style scoped lang="scss">
.testimonial-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(30px);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    border-color: var(--bright-sun);
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    .card-decoration {
      transform: scale(1.2);
      opacity: 0.3;
    }
  }
}

.testimonial-rating {
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &.is-filled {
    color: var(--bright-sun);
    text-shadow: 0 0 10px rgba(255, 201, 64, 0.5);
  }
}

.testimonial-content {
  margin-bottom: 2rem;
}

.testimonial-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  margin: 0;
  position: relative;

  &::before {
    content: '"';
    font-size: 3rem;
    color: var(--bright-sun);
    position: absolute;
    top: -1rem;
    left: -1rem;
    opacity: 0.3;
    font-family: serif;
  }
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--bright-sun);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--bright-sun);
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.author-role {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.125rem;
  line-height: 1.4;
}

.author-company {
  font-size: 0.875rem;
  color: var(--persian-blue);
  font-weight: 600;
  line-height: 1.4;
}

.card-decoration {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--bright-sun) 0%, transparent 70%);
  opacity: 0.1;
  border-radius: 50%;
  transition: all 0.4s ease;
  pointer-events: none;
}

// Responsive design
@media (max-width: 768px) {
  .testimonial-card {
    padding: 2rem;
  }

  .testimonial-text {
    font-size: 1rem;

    &::before {
      font-size: 2rem;
      top: -0.5rem;
      left: -0.5rem;
    }
  }

  .author-avatar {
    width: 50px;
    height: 50px;
  }

  .author-name {
    font-size: 1rem;
  }

  .author-role,
  .author-company {
    font-size: 0.8rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .testimonial-card {
    transition: none;
    opacity: 1;
    transform: none;

    &:hover {
      transform: none;
    }
  }

  .star {
    transition: none;
  }

  .card-decoration {
    transition: none;

    .testimonial-card:hover & {
      transform: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .testimonial-card {
    border-width: 2px;

    &:hover {
      border-width: 3px;
    }
  }

  .author-avatar {
    border-width: 3px;
  }
}
</style>
