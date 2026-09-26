import { useState, type KeyboardEvent } from 'react'
import type { Task } from '../types'
import { useTasksStore } from '../state/tasksStore'
import { formatarDataCurta, type Grupo } from '../lib/dates'
import './TaskItem.css'

interface Props {
  task: Task
  grupo: Grupo
}

export default function TaskItem({ task, grupo }: Props) {
  const toggleTask = useTasksStore((s) => s.toggleTask)
  const updateTask = useTasksStore((s) => s.updateTask)
  const removeTask = useTasksStore((s) => s.removeTask)

  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState(task.titulo)

  // Edição inline provisória; na Fase 4 tocar na tarefa abre a tela de detalhes.
  const iniciarEdicao = () => {
    setRascunho(task.titulo)
    setEditando(true)
  }

  const salvar = () => {
    const titulo = rascunho.trim()
    if (titulo && titulo !== task.titulo) updateTask(task.id, { titulo })
    setEditando(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') salvar()
    if (e.key === 'Escape') setEditando(false)
  }

  // Data explícita só onde o grupo não a deixa óbvia.
  const mostrarData = task.data && (grupo === 'atrasadas' || grupo === 'proximas')

  return (
    <li className={`task${task.concluida ? ' task--done' : ''}`}>
      <button
        type="button"
        className="task__check"
        aria-label={`${task.concluida ? 'Desmarcar' : 'Concluir'}: ${task.titulo}`}
        aria-pressed={task.concluida}
        onClick={() => toggleTask(task.id)}
      >
        <span className="task__check-circle">
          {task.concluida && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </span>
      </button>

      <div className="task__content">
        {editando ? (
          <div className="task__edit">
            <label className="visually-hidden" htmlFor={`edit-${task.id}`}>
              Editar título
            </label>
            <input
              id={`edit-${task.id}`}
              className="task__edit-input"
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={salvar}
              enterKeyHint="done"
              autoFocus
            />
            <button
              type="button"
              className="task__delete"
              aria-label={`Excluir: ${task.titulo}`}
              // mousedown dispara antes do blur do input, que desmontaria este botão.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => removeTask(task.id)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
              </svg>
            </button>
          </div>
        ) : (
          <button type="button" className="task__title" onClick={iniciarEdicao} aria-label={`Editar: ${task.titulo}`}>
            {task.titulo}
          </button>
        )}

        <div className="task__meta">
          {mostrarData && <span className="task__when">{formatarDataCurta(task.data!)}</span>}
          {task.horario && (
            <span className="task__when">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {task.horario}
            </span>
          )}
          <span className="tag">{task.categoria}</span>
          {task.prioridade === 'Alta' && !task.concluida && <span className="tag tag--alta">Prioridade alta</span>}
        </div>
      </div>
    </li>
  )
}
