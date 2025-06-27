// API client per il portfolio
// Configurazione base per le chiamate API

// Interceptor per gestire le richieste
const handleRequest = (config: any) => {
  // Aggiungi headers di default
  config.headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  }
  return config
}

// Interceptor per gestire le risposte
const handleResponse = (response: any) => response

const handleError = (error: any) => {
  console.error('API Error:', error)
  return Promise.reject(error)
}

// Export delle funzioni API
export const apiClient = {
  get: async (url: string) => {
    const config = handleRequest({ url, method: 'GET' })
    try {
      const response = await fetch(url, config)
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },

  post: async (url: string, data: any) => {
    const config = handleRequest({
      url,
      method: 'POST',
      body: JSON.stringify(data),
    })
    try {
      const response = await fetch(url, config)
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
}

export default apiClient
