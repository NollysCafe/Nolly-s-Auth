import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      {
        name: 'build-script',
        buildEnd() {
          setTimeout(() => {
            if (command === 'build') {
              console.log('')
              const distDir = path.resolve(__dirname, '../dist')
              if (fs.existsSync(distDir)) {
                const buildDir = path.resolve(distDir, 'frontend')
                if (fs.existsSync(buildDir)) {
                  const htaccessContent = 'RewriteEngine on\nRewriteCond %{REQUEST_FILENAME} -f [OR]\nRewriteCond %{REQUEST_FILENAME} -d\nRewriteRule ^ - [L]\nRewriteRule ^ index.html [L]'.trim()
                  const htaccessPath = path.join(buildDir, '.htaccess')
                  fs.writeFileSync(htaccessPath, htaccessContent, 'utf-8')
                  console.log('Created .htaccess file in dist/frontend')
                }
              }
            }
          }, 2500)
        }
      }
    ],
    publicDir: path.resolve(__dirname, 'public'),
    server: {
      open: true,
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:2341',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    build: {
      emptyOutDir: true,
      outDir: path.resolve(__dirname, '../dist/frontend'),
      sourcemap: true,
      cssMinify: true,
    },
  }
})
