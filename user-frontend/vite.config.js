import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    // Enable SPA fallback for client-side routing
    historyApiFallback: true,
  },
  preview: {
    // Also enable for preview mode
    historyApiFallback: true,
  }
})
