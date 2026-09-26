import type { Connect, Plugin } from 'vite'

interface ApiOptions {
  anthropicApiKey?: string
}

/**
 * Backend mínimo embutido no servidor do Vite (dev e preview).
 *
 * A chave da Anthropic só existe aqui, no processo Node — o navegador chama
 * `/api/*` e nunca vê a chave. Em produção, portar estes handlers para uma
 * função serverless (Vercel/Netlify/Cloudflare) com a mesma rota.
 */
export function apiPlugin(options: ApiOptions): Plugin {
  const register = (middlewares: Connect.Server) => {
    middlewares.use('/api/health', (_req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true, anthropicKeyConfigured: Boolean(options.anthropicApiKey) }))
    })

    // Fase 3: POST /api/extract — transcrição → JSON da tarefa via Claude.
  }

  return {
    name: 'app-tarefas-api',
    configureServer: (server) => register(server.middlewares),
    configurePreviewServer: (server) => register(server.middlewares),
  }
}
