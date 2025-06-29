/// <reference types="vite/client" />

// Google Analytics gtag
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: {
        event_category?: string
        event_label?: string
        value?: number
        service_id?: string
        project_id?: string
        interests?: string
        [key: string]: string | number | undefined
      }
    ) => void
  }

  const gtag: Window['gtag']
}

export {}
