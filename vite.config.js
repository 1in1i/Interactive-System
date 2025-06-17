import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),  // keep it commented out to avoid VM229 errors
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Proxy REST API calls
      '/api': {
        target: 'https://localhost:5010',
        changeOrigin: true,
        secure: false,
      },
      // Proxy SignalR negotiate and WebSocket traffic
      '/gameHub': {
        target: 'https://localhost:5010',
        ws: true,
        secure: false,
      },
    }
  }
})