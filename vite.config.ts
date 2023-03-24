import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import webfontDownload from 'vite-plugin-webfont-dl'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    webfontDownload(),
    Icons({ compiler: 'jsx', jsx: 'react' })
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: './frontend/main.tsx'
    },
    manifest: true,
    sourcemap: true
  }
})
