import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 1. 모든 환경 변수를 가져옵니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  // 2. Vercel 시스템 변수와 사용자 변수 중 가능한 모든 곳에서 키를 찾습니다.
  const apiKey = process.env.API_KEY || env.API_KEY;

  console.log("Build Key Check:", apiKey ? "Key Found" : "Key Missing"); // 빌드 로그 확인용

  return {
    plugins: [react()],
    define: {
      // 3. 찾은 키를 앱에 주입합니다. (없으면 빈 문자열이라도 넣어서 에러 방지)
      'process.env.API_KEY': JSON.stringify(apiKey || ''),
    },
  }
})
