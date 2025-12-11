import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수를 가져옵니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  // API_KEY 또는 VITE_API_KEY 중 있는 것을 찾습니다.
  const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || env.VITE_API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // [수정됨] process.env 전체를 건드리지 않고, API_KEY만 콕 집어서 넣어줍니다. (빌드 오류 방지)
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
