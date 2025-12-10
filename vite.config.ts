import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vercel 환경 변수(API_KEY)를 가져옵니다.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // 코드가 process.env.API_KEY를 찾을 때, 실제 키 값을 넣어줍니다.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  }
})
