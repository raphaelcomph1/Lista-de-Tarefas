# App de Tarefas por Voz

App de lista de tarefas mobile cujo objetivo central é **tornar a criação de
tarefas o mais rápida possível**, mesmo capturando vários detalhes (data,
horário, categoria, prioridade), usando voz como caminho principal de
entrada.

O mockup visual de referência (protótipo clicável) está aqui:
https://claude.ai/artifact/L9bbj9ego6sRWwynycXVRL

## Princípio de produto

> Uma etapa para capturar, estruturação em segundo plano.

A pessoa fala ou digita naturalmente ("reunião com o cliente sexta às 10h,
prioridade alta") e a tarefa já é salva estruturada, sem exigir que a pessoa
preencha um formulário. A revisão é sempre **opcional**, nunca bloqueante.

## Stack recomendada

| Camada | Escolha | Por quê |
|---|---|---|
| UI | React (PWA) ou React Native | reaproveita a lógica visual do mockup; PWA é mais rápido para prototipar, RN se quiser publicar nas lojas |
| Voz → texto | Web Speech API (`webkitSpeechRecognition`) no navegador; Whisper API como alternativa mais precisa/multilíngue | Web Speech é grátis e local; Whisper para maior precisão |
| Texto → tarefa estruturada | API da Anthropic (Claude), pedindo saída em JSON estrito | resolve linguagem natural em PT-BR sem regras manuais de parsing |
| Persistência | `localStorage`/IndexedDB no MVP; migrar para backend (Supabase/Firebase) quando precisar sincronizar entre dispositivos | simplicidade no início |

## Extração de tarefas por voz (núcleo do produto)

Fluxo: **fala → transcrição → extração por LLM → tarefa salva → toast com
desfazer → preview editável opcional**.

Chamada de exemplo à API para extração (usar `max_tokens` baixo, resposta só
em JSON, sem preâmbulo):

```
Você recebe uma frase em português falada por alguém adicionando uma tarefa.
Extraia e devolva SOMENTE um JSON com este formato exato, sem texto antes ou
depois:

{"titulo": string, "data": string|null, "horario": string|null,
 "categoria": "Trabalho"|"Pessoal"|"Saúde"|"Casa", "prioridade": "Baixa"|"Média"|"Alta"}

Frase: "<transcrição aqui>"
```

Regras importantes:
- Se a pessoa não mencionar categoria/prioridade, inferir a mais provável
  pelo conteúdo (ex.: "reunião com cliente" → Trabalho) em vez de deixar
  vazio.
- Data relativa ("amanhã", "sexta") deve ser resolvida para uma data real
  usando a data atual como referência (passar a data de hoje no prompt).
- Nunca travar a UI esperando a resposta: salvar a tarefa com um estado
  "processando" e atualizar quando o JSON chegar (ver `ROADMAP.md`, Fase 3).
- A chamada ao Claude passa sempre pelo backend (`POST /api/extract`, em
  `server/apiPlugin.ts`). O navegador nunca recebe a `ANTHROPIC_API_KEY`.

## Design tokens (referência visual)

O mockup usa uma paleta de prototipagem inspirada na identidade Bradesco
Seguros — **apenas para fins de referência/protótipo interno**, não é uma
peça oficial da marca. Se o app for público com essa marca, validar sempre
com o time de marca. Se for um app genérico (recomendado), trocar `brand-red`
por uma cor própria e remover qualquer associação com Bradesco.

```json
{
  "brand-red": "#E3001B",
  "brand-red-dark": "#A3061F",
  "brand-red-tint": "#FBE7EB",
  "ink": "#1B181C",
  "ink-muted": "#5B5757",
  "surface-100": "#FFFFFF",
  "surface-200": "#F5F3F2",
  "surface-300": "#EAE7E6",
  "success": "#1E8E3E",
  "success-tint": "#E9F6EC",
  "focus-ring": "#0B57D0",
  "radius-md": "8px",
  "radius-pill": "999px",
  "shadow-card": "0 1px 3px rgba(34,31,31,0.10), 0 1px 2px rgba(34,31,31,0.06)"
}
```

Tipografia: pilha `-apple-system, 'Segoe UI', Roboto, Helvetica, Arial,
sans-serif` (ou `Inter` via Google Fonts), títulos 700–800, corpo 400,
tamanhos entre 12–28px conforme a hierarquia do mockup.

## Estrutura de pastas sugerida

```
app-tarefas/
  src/
    components/
      TaskList.tsx
      TaskItem.tsx
      MicButton.tsx        # botão de voz com estado "ouvindo"
      Toast.tsx            # confirmação + desfazer
      NewTaskForm.tsx       # tela de detalhes (caminho secundário)
    lib/
      speech.ts             # wrapper da Web Speech API / Whisper
      extractTask.ts        # chamada à API do Claude + parsing do JSON
      storage.ts             # persistência local
    state/
      tasksStore.ts          # estado global (Zustand/Context)
    styles/                  # tokens.css + global.css
    types.ts
    App.tsx
  server/
    apiPlugin.ts             # backend mínimo (/api/*) — guarda a chave da API
  .env.example               # ANTHROPIC_API_KEY=
  README.md
  ROADMAP.md
```

## Rodando com Claude Code

1. `claude` na raiz do projeto (vazio ou já iniciado com `npm create vite@latest`).
2. Cole este README e o `ROADMAP.md` na conversa ou salve-os no repositório —
   Claude Code os lê automaticamente se estiverem na raiz.
3. Siga as fases do `ROADMAP.md` em ordem; cada fase tem critério de pronto
   antes de avançar para a próxima.
