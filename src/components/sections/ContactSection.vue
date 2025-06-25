<template>
  <section class="contact-section">
    <h2>{{ $t('contact.title') }}</h2>
    <h3>{{ $t('contact.subtitle') }}</h3>
    <p>{{ $t('contact.description') }}</p>
    <form class="contact-form">
      <label>
        {{ $t('contact.form.name') }}
        <input type="text" name="name" />
      </label>
      <label>
        {{ $t('contact.form.email') }}
        <input type="email" name="email" />
      </label>
      <label>
        {{ $t('contact.form.company') }}
        <input type="text" name="company" />
      </label>
      <label>
        {{ $t('contact.form.budget') }}
        <input type="text" name="budget" />
      </label>
      <label>
        {{ $t('contact.form.message') }}
        <textarea name="message"></textarea>
      </label>
      <button type="submit">{{ $t('contact.form.submit') }}</button>
    </form>
    <div class="contact-info">
      <span>{{ $t('contact.info.email') }}</span>
      <span>{{ $t('contact.info.phone') }}</span>
      <span>{{ $t('contact.info.location') }}</span>
      <span>{{ $t('contact.info.availability') }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
// Nessuna logica JS per ora, solo rendering dati i18n
</script>

<style scoped>
.contact-section {
  padding: var(--space-xl) 0;
  max-width: 700px;
  margin: 0 auto;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin: var(--space-md) 0;
}
.contact-form label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: var(--color-secondary);
}
.contact-form input,
.contact-form textarea {
  margin-top: 0.3em;
  padding: 0.7em 1em;
  border-radius: 1em;
  border: 1px solid var(--color-light-gray);
  background: var(--color-white);
  box-shadow: var(--shadow-soft);
  font-size: 1rem;
  resize: none;
}
.contact-form button {
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: 2em;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.7em 2em;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.contact-form button:hover {
  box-shadow: var(--shadow-medium);
  transform: scale(1.04);
}
.contact-info {
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  color: var(--color-medium-gray);
  font-size: 1rem;
}
</style>
