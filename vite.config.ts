import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      // Safely inject the API key. Prioritize process.env (Vercel) over loaded .env file
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || '')
    }
  };
});