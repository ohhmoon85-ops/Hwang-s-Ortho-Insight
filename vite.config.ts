import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = process.env.API_KEY || env.API_KEY;

  // 빌드 로그에 키 확인용 메시지 출력 (Vercel 로그에서 확인 가능)
  console.log("----------------------------------------------------");
  console.log("Build Time Key Check:", apiKey ? "OK (Key Exists)" : "FAIL (Key is Empty)");
  console.log("----------------------------------------------------");

  return {
    plugins: [react()],
    define: {
      // process.env 객체 자체가 없어서 에러나는 것을 방지
      'process.env': {},
      // API_KEY를 안전하게 주입
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
