import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist', // Explicitly set output directory
    },
    define: {
      // Polyfill process.env.API_KEY so it works in the browser after build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});