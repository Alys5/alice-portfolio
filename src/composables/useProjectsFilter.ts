import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// Tipi progetto coerenti con i18n.it.ts
export interface Project {
  title: string
  category: string
  description: string
  results: string
  technologies: string[]
}

/**
 * Composable per filtrare progetti per tag e testo, con input debounced.
 * @param projects Lista di progetti da filtrare
 * @param debounceMs Millisecondi di debounce per la ricerca testo (default: 250)
 */
export function useProjectsFilter(projects: Project[], debounceMs = 250) {
  const tag = ref<string>('Tutti')
  const search = ref<string>('')
  const debouncedSearch = ref<string>('')
  const isFiltering = computed(() => tag.value !== 'Tutti' || !!debouncedSearch.value)

  // Debounce con VueUse
  const updateDebouncedSearch = useDebounceFn((val: string) => {
    debouncedSearch.value = val
  }, debounceMs)

  watch(search, updateDebouncedSearch)

  // Filtro reattivo
  const filteredProjects = computed(() => {
    let filtered = projects
    if (tag.value && tag.value !== 'Tutti') {
      filtered = filtered.filter((p) => p.category === tag.value)
    }
    if (debouncedSearch.value) {
      const q = debouncedSearch.value.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.technologies.some((tech) => tech.toLowerCase().includes(q)),
      )
    }
    return filtered
  })

  function setTag(newTag: string) {
    tag.value = newTag
  }
  function setSearch(newSearch: string) {
    search.value = newSearch
  }

  return {
    filteredProjects,
    tag,
    search,
    setTag,
    setSearch,
    isFiltering,
  }
}
