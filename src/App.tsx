import { useEffect, useMemo, useState } from 'react'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todos:v1'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Todo[]) : []
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed)
      case 'completed':
        return todos.filter(t => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const activeCount = useMemo(() => todos.filter(t => !t.completed).length, [todos])
  const completedCount = todos.length - activeCount

  function addTodo() {
    const value = text.trim()
    if (!value) return
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: value,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos(prev => [newTodo, ...prev])
    setText('')
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addTodo()
  }

  return (
    <div className="app-root">
      <main className="container">
        <header className="header">
          <h1>Todos</h1>
        </header>

        <form className="composer" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Add a task..."
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn" aria-label="Add todo" disabled={!text.trim()}>
            Add
          </button>
        </form>

        <ul className="list" role="list">
          {visibleTodos.map(todo => (
            <li key={todo.id} className="item">
              <label className="item-main">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'text done' : 'text'}>{todo.text}</span>
              </label>
              <button className="icon-btn" aria-label="Delete" onClick={() => deleteTodo(todo.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>

        <footer className="footer">
          <div className="filters" role="tablist" aria-label="Filter todos">
            <button
              className={filter === 'all' ? 'chip active' : 'chip'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'active' ? 'chip active' : 'chip'}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={filter === 'completed' ? 'chip active' : 'chip'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          <div className="counts">
            <span>{activeCount} left</span>
            {completedCount > 0 && (
              <button className="link" onClick={clearCompleted}>
                Clear completed ({completedCount})
              </button>
            )}
          </div>
        </footer>
      </main>
    </div>
  )
}


