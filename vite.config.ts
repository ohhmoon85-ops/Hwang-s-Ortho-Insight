import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '');
  
  // Vercel 환경 변수에서 키 찾기 (VITE_API_KEY 우선)
  const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || env.VITE_API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    // [중요] 빌드 결과물이 나올 폴더를 명확히 지정
    build: {
      outDir: 'dist',
    },
    define: {
      // [수정됨] 전체를 덮어쓰지 않고, 필요한 API Key만 콕 집어서 넣어줍니다.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
