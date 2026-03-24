import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
  },
  server: {
  proxy: {
    '/api/v-status': {
      target: 'https://eu.i.posthog.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/v-status/, ''),
    },
  },
},
})
