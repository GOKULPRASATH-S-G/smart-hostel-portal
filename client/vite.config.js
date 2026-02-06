import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // This is the guaranteed fix to expose it on your network
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 5173,
    }
  }
})