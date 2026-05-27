import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
<<<<<<< HEAD
=======
import https from 'https'
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
<<<<<<< HEAD
=======
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:9192',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        agent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    }
  }
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
})
