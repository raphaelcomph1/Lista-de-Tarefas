/** Datas locais em `YYYY-MM-DD` (sem fuso — comparação direta de strings funciona). */
export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  return toISODate(new Date(y, m - 1, d + days))
}

export type Grupo = 'atrasadas' | 'hoje' | 'amanha' | 'proximas' | 'sem-data'

export const GRUPOS: { id: Grupo; titulo: string }[] = [
  { id: 'atrasadas', titulo: 'Atrasadas' },
  { id: 'hoje', titulo: 'Hoje' },
  { id: 'amanha', titulo: 'Amanhã' },
  { id: 'proximas', titulo: 'Próximas' },
  { id: 'sem-data', titulo: 'Sem data' },
]

export function grupoDe(data: string | null, hoje = todayISO()): Grupo {
  if (!data) return 'sem-data'
  if (data < hoje) return 'atrasadas'
  if (data === hoje) return 'hoje'
  if (data === addDays(hoje, 1)) return 'amanha'
  return 'proximas'
}

/** "Quarta-feira, 23 de setembro" */
export function formatarCabecalho(d = new Date()): string {
  const s = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** "sex., 2 de out." — usado em tarefas fora de Hoje/Amanhã. */
export function formatarDataCurta(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
