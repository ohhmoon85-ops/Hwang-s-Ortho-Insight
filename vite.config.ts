import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 1. Vercel 및 로컬 환경 변수를 모두 불러옵니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  // 2. API_KEY 또는 VITE_API_KEY 중 있는 것을 찾습니다.
  const apiKey = process.env.API_KEY || process.env.VITE_API_KEY || env.API_KEY || env.VITE_API_KEY;

  console.log("------------------------------------------------");
  console.log("BUILD KEY CHECK:", apiKey ? "Key Found!" : "Key Missing..."); 
  console.log("------------------------------------------------");

  return {
    plugins: [react()],
    define: {
      // 3. [핵심] 코드가 'process.env.API_KEY'를 찾으면, 실제 키 값을 줍니다.
      'process.env.API_KEY': JSON.stringify(apiKey),
      // 4. process.env 자체가 없어서 나는 에러를 방지합니다.
      'process.env': {}
    },
  }
})
