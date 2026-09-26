import { createJSONStorage } from 'zustand/middleware'

/** Chave versionada: se o formato de `Task` mudar, subir a versão e migrar. */
export const STORAGE_KEY = 'app-tarefas:v1'

/** Persistência local do MVP. Trocar por Supabase/Firebase no pós-MVP. */
export const taskStorage = createJSONStorage(() => localStorage)
