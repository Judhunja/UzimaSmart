'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox
      
      // Add event listeners for service worker updates
      wb.addEventListener('controlling', () => {
        window.location.reload()
      })

      wb.addEventListener('waiting', () => {
        // Show update available notification
        if (confirm('A new version is available. Update now?')) {
          wb.messageSkipWaiting()
        }
      })

      // Register the service worker
      wb.register()
    }
  }, [])

  return null
}
