import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Vercel 환경 변수를 포함한 모든 변수를 강제로 불러옵니다. ('')
  const env = loadEnv(mode, process.cwd(), '');
  
  // 2. process.env(시스템) 또는 env(파일) 중 어디서든 API_KEY를 찾습니다.
  const apiKey = process.env.API_KEY || env.API_KEY;

  // 3. 빌드 로그에 키를 찾았는지 기록합니다. (Vercel 로그에서 확인 가능)
  console.log("------------------------------------------------");
  console.log("BUILD CHECK - API KEY Found:", !!apiKey); 
  console.log("------------------------------------------------");

  return {
    plugins: [react()],
    define: {
      // 4. 브라우저가 'process.env.API_KEY'를 부를 때, 실제 키 값을 쥐어줍니다.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
