import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Vercel 환경 변수와 .env 파일의 변수를 모두 가져옵니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  // 2. process.env 또는 loadEnv로 가져온 객체에서 API_KEY를 찾습니다.
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // 3. 코드가 process.env.API_KEY를 찾을 때, 찾아낸 실제 값을 넣어줍니다.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
