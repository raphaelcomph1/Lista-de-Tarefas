import Header from './components/Header'
import FilterChips from './components/FilterChips'
import TaskList from './components/TaskList'
import Composer from './components/Composer'

export default function App() {
  return (
    <main className="app">
      <Header />
      <FilterChips />
      <TaskList />
      <Composer />
    </main>
  )
}
