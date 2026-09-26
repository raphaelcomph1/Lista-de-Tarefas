import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '../types'
import { STORAGE_KEY, taskStorage } from '../lib/storage'
import { todayISO } from '../lib/dates'

export type Filtro = 'todas' | 'pendentes' | 'concluidas'

type TaskPatch = Partial<Omit<Task, 'id' | 'criadaEm'>>

interface TasksState {
  tasks: Task[]
  filtro: Filtro
  addTask: (titulo: string, campos?: TaskPatch) => Task | null
  updateTask: (id: string, patch: TaskPatch) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
  setFiltro: (filtro: Filtro) => void
}

// crypto.randomUUID só existe em contexto seguro (https/localhost); ao testar
// no celular pelo IP da rede local ele não está disponível.
function novoId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set): TasksState => ({
      tasks: [],
      filtro: 'todas',

      addTask: (titulo, campos) => {
        const limpo = titulo.trim()
        if (!limpo) return null
        const task: Task = {
          id: novoId(),
          titulo: limpo,
          descricao: '',
          // Sem extração (Fase 3), tarefa digitada cai em "Hoje", como no mockup.
          data: todayISO(),
          horario: null,
          categoria: 'Pessoal',
          prioridade: 'Média',
          lembrete: false,
          concluida: false,
          status: 'pronta',
          criadaEm: new Date().toISOString(),
          ...campos,
        }
        set((s) => ({
          tasks: [task, ...s.tasks],
          // Nova tarefa é pendente: não deixá-la escondida pelo filtro.
          filtro: s.filtro === 'concluidas' ? 'todas' : s.filtro,
        }))
        return task
      },

      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),

      toggleTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t)) })),

      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      setFiltro: (filtro) => set({ filtro }),
    }),
    {
      name: STORAGE_KEY,
      storage: taskStorage,
      partialize: (state) => ({ tasks: state.tasks }),
    },
  ),
)
