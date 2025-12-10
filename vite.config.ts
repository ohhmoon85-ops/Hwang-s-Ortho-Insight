import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  // Check available keys (Priority: System Env -> .env file)
  const finalApiKey = process.env.API_KEY || env.API_KEY || '';

  // DEBUG LOGGING for Vercel Build Logs
  console.log("-------------------------------------------------------");
  console.log("BUILD STATUS: Checking for API_KEY...");
  if (finalApiKey) {
    console.log("BUILD STATUS: SUCCESS - API_KEY found (Starts with: " + finalApiKey.substring(0, 4) + "...)");
  } else {
    console.log("BUILD STATUS: FAILURE - API_KEY is missing or empty.");
  }
  console.log("-------------------------------------------------------");

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      // Safely inject the API key into the client-side code
      'process.env.API_KEY': JSON.stringify(finalApiKey)
    }
  };
});