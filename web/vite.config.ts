import { defineConfig } from 'vite';

// 开发期把接口与媒体请求代理到 Go 服务（默认 :8080）。
export default defineConfig({
  // GitHub Pages 部署在 /<repo>/ 子路径下，由工作流传入 VITE_BASE
  base: process.env.VITE_BASE || '/',
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8080', changeOrigin: true },
      '/media': { target: 'http://127.0.0.1:8080', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2019',
  },
});
