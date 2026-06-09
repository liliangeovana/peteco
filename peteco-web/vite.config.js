import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const RAILWAY = 'https://peteco-production.up.railway.app'

function stripSecureCookie(proxy) {
  proxy.on('proxyRes', (proxyRes) => {
    const cookies = proxyRes.headers['set-cookie']
    if (cookies) {
      proxyRes.headers['set-cookie'] = cookies.map(c =>
        c.replace(/;\s*Secure/gi, '').replace(/;\s*SameSite=[^;]*/gi, '')
      )
    }
  })
}

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5858,
    proxy: {
      '/auth':    { target: RAILWAY, changeOrigin: true, secure: true, configure: stripSecureCookie },
      '/pets':    { target: RAILWAY, changeOrigin: true, secure: true, configure: stripSecureCookie },
      '/analise': { target: RAILWAY, changeOrigin: true, secure: true, configure: stripSecureCookie },
      '/health':  { target: RAILWAY, changeOrigin: true, secure: true, configure: stripSecureCookie },
    },
  },
})
