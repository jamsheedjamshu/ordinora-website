import { defineConfig } from 'vite';
import { resolve } from 'path';

function investmentOpportunityRewrite() {
  const rewrite = (req, res, next) => {
    if (req && req.url && /^\/investment-opportunities\/[^/]+\/?$/.test(req.url.split('?')[0])) {
      req.url = '/investment-opportunities/index.html';
    }
    next();
  };

  return {
    name: 'investment-opportunity-rewrite',
    enforce: 'pre',
    configureServer: (server) => { server.middlewares.use(rewrite); },
    configurePreviewServer: (server) => { server.middlewares.use(rewrite); }
  };
}

export default defineConfig({
  plugins: [investmentOpportunityRewrite()],
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        packages: resolve(__dirname, 'packages.html'),
        insights: resolve(__dirname, 'insights/index.html'),
        insightArticle: resolve(__dirname, 'insights/article.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
