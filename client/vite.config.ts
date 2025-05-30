import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://services.nsuk.edu.ng",
        // target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
})
