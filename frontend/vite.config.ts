import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('react-router-dom')) return 'vendor'
          if (id.includes('react-dom')) return 'vendor'
          if (id.includes('react')) return 'vendor'
          if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('recharts')) return 'charts'
        },
      },
    },
  },
})
