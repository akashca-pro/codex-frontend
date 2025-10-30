import path from "path"
import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const certPath = path.resolve(__dirname, '../../localhost+1.pem'); 
const keyPath = path.resolve(__dirname, '../../localhost+1-key.pem');

export default defineConfig({
  plugins: [react(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // host: 'codex.com',
    port: 5173,
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
  }
})
