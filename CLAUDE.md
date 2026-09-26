# App de Tarefas por Voz

Leia `README.md` (produto, prompt de extração, tokens) e `ROADMAP.md` (fases e
critérios de pronto). Faça uma fase por vez.

## Decisões tomadas (Fase 0)

- PWA: Vite + React + TypeScript. Estado global com Zustand (`persist` →
  `localStorage`, chave em `src/lib/storage.ts`).
- A chave da Anthropic fica SÓ no servidor: `server/apiPlugin.ts` registra
  `/api/*` no dev/preview server do Vite. O front chama `/api/extract`; nunca usar
  `VITE_ANTHROPIC_API_KEY`. Em produção, portar para função serverless.
- Identidade visual: manter a paleta vermelha do mockup (protótipo interno).
  Tokens em `src/styles/tokens.css`.
- Modelo de dados em `src/types.ts`, campos em PT-BR iguais ao JSON do LLM.

## Mockup

https://claude.ai/artifact/L9bbj9ego6sRWwynycXVRL — canvas com `project/Main.dc.html`
(lista) e `project/NovaTarefa.dc.html` (detalhes), 390×844. Desvios combinados:

- MicButton ganha o 3º estado "processando" (o mockup só tem parado/ouvindo).
- Prioridade tem 3 níveis; o selo na lista aparece só para "Alta".
- Lista agrupada por data (Atrasadas / Hoje / Amanhã / Próximas / Sem data),
  não só "Hoje".
- Tocar numa tarefa abre a tela de detalhes para editar; excluir fica lá.
- Data/horário usam inputs nativos (`type="date"`/`"time"`).
- Lembrete/sino: fora do MVP (backlog).

## Comandos

- `npm run dev` — app + API local
- `npm run typecheck` / `npm run build`
