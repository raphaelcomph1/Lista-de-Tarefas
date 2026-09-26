import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { apiPlugin } from './server/apiPlugin.ts'

export default defineConfig(({ mode }) => {
  // Prefixo '' carrega também variáveis sem VITE_. Elas ficam só no lado do
  // servidor (Node) — nunca são injetadas no bundle do navegador.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiPlugin({ anthropicApiKey: env.ANTHROPIC_API_KEY })],
    // Pré-otimiza já no start: descobrir o zustand no meio da sessão faz o Vite
    // reotimizar e carregar duas cópias do React ("Invalid hook call").
    optimizeDeps: { include: ['react', 'react-dom/client', 'zustand', 'zustand/middleware'] },
  }
})
