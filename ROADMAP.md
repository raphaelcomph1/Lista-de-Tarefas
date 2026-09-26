# Roteiro de desenvolvimento

Cada fase indica o modelo Claude recomendado (ver justificativa no README) e
um critério de "pronto" antes de seguir para a próxima. Faça uma fase por
sessão do Claude Code sempre que possível — reduz o risco de regressão.

## Fase 0 — Arquitetura e decisões

**Modelo: Opus 5.5** (decisões estruturais compensam o custo maior aqui)

- Escolher PWA vs React Native.
- Definir estado global (Context simples vs Zustand) e onde a lista de
  tarefas vive (local vs backend).
- Criar o scaffold do projeto e a estrutura de pastas do README.
- Configurar `.env` com `ANTHROPIC_API_KEY` (nunca commitar a chave).

**Pronto quando:** projeto roda localmente (`npm run dev`) com uma tela em
branco e a estrutura de pastas criada.

## Fase 1 — Lista de tarefas (CRUD básico)

**Modelo: Sonnet 5**

- Implementar `TaskList` e `TaskItem` replicando o visual do mockup
  (checkbox circular, riscado quando concluída, chips de filtro
  Todas/Pendentes/Concluídas).
- Adicionar/editar/concluir/excluir tarefa via o campo de texto do rodapé
  (sem voz ainda).
- Persistir em `localStorage`.

**Pronto quando:** dá para adicionar, concluir e filtrar tarefas, e elas
sobrevivem a um refresh da página.

## Fase 2 — Voz → texto

**Modelo: Sonnet 5**

- Implementar `MicButton` com os três estados do mockup: parado, ouvindo
  (pulsando), processando.
- Integrar Web Speech API (`webkitSpeechRecognition`) para transcrever a
  fala em texto no navegador.
- Tratar erros: permissão de microfone negada, sem suporte no navegador,
  silêncio/timeout — mostrar mensagem clara, nunca travar o botão.

**Pronto quando:** falar uma frase produz o texto transcrito visível na tela
(ainda sem estruturar em tarefa).

## Fase 3 — Extração por LLM

**Modelo: Sonnet 5, escalar para Opus 5.5 se o parsing errar muito em casos
ambíguos (datas relativas, prioridade implícita)**

- Implementar `extractTask.ts`: envia a transcrição para a API do Claude com
  o prompt do README, recebe o JSON e salva a tarefa.
- A tarefa aparece na lista assim que o JSON volta; até lá, mostrar um
  estado "processando" no lugar do toast.
- Mostrar o toast de confirmação com "Desfazer" (como no mockup) quando a
  tarefa é criada por voz.
- Tratar falha da API (sem internet, erro 500): salvar a transcrição crua
  como título da tarefa em vez de perder a informação.

**Pronto quando:** falar "reunião com cliente sexta às 10h, prioridade alta"
cria uma tarefa com esses quatro campos preenchidos corretamente.

## Fase 4 — Tela de detalhes (caminho secundário)

**Modelo: Sonnet 5**

- Implementar `NewTaskForm` replicando a segunda tela do mockup (título,
  descrição, data, horário, categoria, prioridade, lembrete).
- Usar essa tela também para *editar* uma tarefa criada por voz que saiu
  errada — não só para criar do zero.

**Pronto quando:** uma tarefa criada por voz pode ser aberta nessa tela e
corrigida sem perder os outros campos já preenchidos.

## Fase 5 — Polimento e testes

**Modelo: Opus 5.5** (bom em achar falhas de código e casos de borda)

- Testar em dispositivo real (a Web Speech API se comporta diferente entre
  Chrome mobile, Safari iOS, etc.) — documentar o que não funciona onde.
- Revisar acessibilidade: `aria-label` nos botões de ícone, contraste de
  texto, foco visível (o mockup já usa `:focus-visible`).
- Revisar responsividade além dos 390px do mockup (telas maiores/menores).
- Testar o fluxo de "Desfazer" em sequência rápida (duas tarefas por voz
  antes do toast da primeira sumir).

**Pronto quando:** o app funciona de ponta a ponta em pelo menos dois
navegadores/dispositivos diferentes, com o fluxo de voz como caminho
principal e o texto como alternativa sempre disponível.

## Backlog (pós-MVP)

- Sincronização entre dispositivos (backend real).
- Lembretes/notificações push.
- Suporte a mais idiomas na transcrição.
- Edição em lote e reordenação de tarefas.
