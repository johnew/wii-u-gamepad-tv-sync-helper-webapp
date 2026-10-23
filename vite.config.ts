/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages under any repository name
  base: './',
  test: {
    environment: 'node',
  },
})
