import { useTasksStore, type Filtro } from '../state/tasksStore'
import './FilterChips.css'

const OPCOES: { id: Filtro; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'concluidas', label: 'Concluídas' },
]

export default function FilterChips() {
  const filtro = useTasksStore((s) => s.filtro)
  const setFiltro = useTasksStore((s) => s.setFiltro)

  return (
    <div className="chips" role="group" aria-label="Filtrar tarefas">
      {OPCOES.map((o) => (
        <button
          key={o.id}
          type="button"
          className="chip"
          aria-pressed={filtro === o.id}
          onClick={() => setFiltro(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
