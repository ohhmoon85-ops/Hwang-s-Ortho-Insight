import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  // Check available keys (Priority: System Env -> .env file)
  // Now explicitly checking VITE_API_KEY as well per user request
  const finalApiKey = process.env.API_KEY || env.API_KEY || process.env.VITE_API_KEY || env.VITE_API_KEY || '';

  // DEBUG LOGGING for Vercel Build Logs
  console.log("-------------------------------------------------------");
  console.log("BUILD STATUS: Checking for API Key...");
  if (finalApiKey) {
    console.log("BUILD STATUS: SUCCESS - API Key found (Starts with: " + finalApiKey.substring(0, 4) + "...)");
  } else {
    console.log("BUILD STATUS: FAILURE - No API Key found (Checked API_KEY and VITE_API_KEY).");
  }
  console.log("-------------------------------------------------------");

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      // Safely inject the found key into the client-side code as 'process.env.API_KEY'
      // This allows the app code to remain consistent
      'process.env.API_KEY': JSON.stringify(finalApiKey)
    }
  };
});