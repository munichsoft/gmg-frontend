import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: !isProduction ? {
          '/api': {
            target: 'http://localhost:4000',
            changeOrigin: true,
            secure: false,
            // keep path as-is so /api -> backend /api
          }
        } : undefined
      },
      preview: {
        port: 4173,
        host: '0.0.0.0',
        allowedHosts: true,
        proxy: {
          '/api': {
            target: 'https://gmg-backend.onrender.com',
            changeOrigin: true,
            secure: true,
            // keep path as-is so /api -> backend /api
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
