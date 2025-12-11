import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Vercel 환경 변수를 불러옵니다.
  const env = loadEnv(mode, process.cwd(), '');

  // 2. VITE_API_KEY(새로 만든 것)를 우선적으로 찾고, 없으면 API_KEY를 찾습니다.
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.VITE_API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // 3. 코드(App.tsx 등)에서 process.env.API_KEY를 찾을 때, 우리가 찾은 값을 쥐어줍니다.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
