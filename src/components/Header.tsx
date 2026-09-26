import { useTasksStore } from '../state/tasksStore'
import { formatarCabecalho } from '../lib/dates'
import './Header.css'

export default function Header() {
  const tasks = useTasksStore((s) => s.tasks)
  const total = tasks.length
  const concluidas = tasks.filter((t) => t.concluida).length
  const pct = total ? Math.round((concluidas / total) * 100) : 0

  return (
    <header className="header">
      <div className="header__body">
        <div className="header__titles">
          <p className="header__date">{formatarCabecalho()}</p>
          <h1 className="header__title">Minhas tarefas</h1>
        </div>
        <div className="header__progress">
          <div className="header__progress-label">
            <span>
              {concluidas} de {total} concluídas
            </span>
            <span>{pct}%</span>
          </div>
          <div
            className="header__bar"
            role="progressbar"
            aria-label="Progresso das tarefas"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div className="header__bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <svg className="header__wave" viewBox="0 0 390 26" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H390 V12 C300 30 170 -2 0 22 Z" fill="var(--brand-red-dark)" />
        <path d="M0 0 H390 V5 C290 22 160 -6 0 14 Z" fill="var(--brand-red)" />
      </svg>
    </header>
  )
}
