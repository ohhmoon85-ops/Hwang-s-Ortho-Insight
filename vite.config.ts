import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. Vercel 환경과 로컬 환경(.env) 모두에서 변수를 가져옵니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  // 2. process.env(서버) 또는 env(파일) 중 어디서든 API_KEY를 찾습니다.
  const apiKey = process.env.API_KEY || env.API_KEY;

  // 3. 빌드 로그에 키를 찾았는지 기록합니다. (보안상 값은 숨김)
  console.log("------------------------------------------------");
  console.log("BUILD API KEY CHECK:", apiKey ? "SUCCESS (Key Found)" : "FAILED (Key Missing)");
  console.log("------------------------------------------------");

  return {
    plugins: [react()],
    define: {
      // 4. 코드가 process.env.API_KEY를 찾을 때, 찾아낸 실제 값을 강제로 넣어줍니다.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
