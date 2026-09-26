export const CATEGORIAS = ['Trabalho', 'Pessoal', 'Saúde', 'Casa'] as const
export const PRIORIDADES = ['Baixa', 'Média', 'Alta'] as const

export type Categoria = (typeof CATEGORIAS)[number]
export type Prioridade = (typeof PRIORIDADES)[number]

/** Nomes de campo em PT-BR para bater com o JSON devolvido pelo LLM (ver README). */
export interface Task {
  id: string
  titulo: string
  descricao: string
  /** ISO `YYYY-MM-DD` ou null. */
  data: string | null
  /** `HH:mm` ou null. */
  horario: string | null
  categoria: Categoria
  prioridade: Prioridade
  lembrete: boolean
  concluida: boolean
  /** `processando` enquanto a extração por LLM não voltou (Fase 3). */
  status: 'pronta' | 'processando'
  criadaEm: string
}
