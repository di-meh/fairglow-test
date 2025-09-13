
import './App.css'
import type { Todo } from './store'
import { useTodoStore } from './store/index.ts'

function App() {
  const todos = useTodoStore((state) => state.todos)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const createTodo = useTodoStore((state) => state.createTodo)
  const deleteAllCompleted = useTodoStore((state) => state.deleteAllCompleted)

  return (
    <>
      <h1 className='text-lg font-bold text-center mb-8'>Fairglow Task Manager</h1>
      <ul className="flex flex-col gap-4 items-center">
        {todos?.map((todo: Todo) => (
          <li key={todo.id} className="flex gap-4 items-center">
            <input 
              type="checkbox" 
              checked={todo.done} 
              onChange={(event) => toggleTodo(todo.id, event.target.checked)} 
            />
            <span className={todo.done ? 'completed' : ''}>{todo.title}</span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form className="mt-8 flex flex-col gap-4 items-center" onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        if (title.trim()) {
          createTodo(title.trim())
          e.currentTarget.reset()
        }
      }}>
        <input 
          type="text" 
          name="title"
          placeholder="Enter new todo..."
          className="px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Todo
        </button>
      </form>
      <button 
        onClick={deleteAllCompleted}
        className="mt-4 mx-auto block px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete All Completed
      </button>
    </>
  )
}

export default App
