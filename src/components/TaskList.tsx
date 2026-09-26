import { useTasksStore } from '../state/tasksStore'
import { GRUPOS, grupoDe, todayISO } from '../lib/dates'
import TaskItem from './TaskItem'
import './TaskList.css'

export default function TaskList() {
  const tasks = useTasksStore((s) => s.tasks)
  const filtro = useTasksStore((s) => s.filtro)

  const visiveis = tasks.filter((t) => {
    if (filtro === 'pendentes') return !t.concluida
    if (filtro === 'concluidas') return t.concluida
    return true
  })

  if (visiveis.length === 0) {
    const semNada = tasks.length === 0
    return (
      <div className="list list--empty">
        <p className="list__empty-title">{semNada ? 'Nenhuma tarefa ainda' : 'Nada por aqui'}</p>
        <p className="list__empty-text">
          {semNada ? 'Digite uma tarefa abaixo para começar.' : 'Nenhuma tarefa neste filtro.'}
        </p>
      </div>
    )
  }

  const hoje = todayISO()
  const secoes = GRUPOS.map((g) => ({
    ...g,
    tasks: visiveis.filter((t) => grupoDe(t.data, hoje) === g.id),
  })).filter((s) => s.tasks.length > 0)

  return (
    <div className="list">
      {secoes.map((s) => (
        <section key={s.id} className="list__section" aria-labelledby={`grupo-${s.id}`}>
          <div className="list__heading">
            <h2 id={`grupo-${s.id}`}>{s.titulo}</h2>
            <span className="list__count">{s.tasks.length}</span>
          </div>
          <ul className="list__items">
            {s.tasks.map((t) => (
              <TaskItem key={t.id} task={t} grupo={s.id} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
