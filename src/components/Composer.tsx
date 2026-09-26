import { useState, type FormEvent } from 'react'
import { useTasksStore } from '../state/tasksStore'
import './Composer.css'

/** Rodapé de captura. Fase 2 adiciona o MicButton abaixo do campo. */
export default function Composer() {
  const addTask = useTasksStore((s) => s.addTask)
  const [rascunho, setRascunho] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (addTask(rascunho)) setRascunho('')
  }

  return (
    <footer className="composer">
      <form className="composer__row" onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor="nova-tarefa">
          Nova tarefa
        </label>
        <input
          id="nova-tarefa"
          className="composer__input"
          type="text"
          placeholder="Ou digite uma tarefa…"
          autoComplete="off"
          enterKeyHint="send"
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
        />
      </form>
    </footer>
  )
}
