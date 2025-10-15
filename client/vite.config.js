import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
