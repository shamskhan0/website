import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
                if (id.includes('react')) {
                return 'vendor-react'
              }
              return 'vendor'
            }
            if (id.includes('src/admin')) {
              return 'admin-panel'
            }
            if (id.includes('src/pages')) {
              return 'legal-pages'
            }
          },
        },
      },
    },
    envPrefix: ['VITE_'],
  }
})
