import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Todo = {
    id: number
    title: string
    completed: boolean
}

type TodoStore = {
    todos: Todo[]
    createTodo: (todo: Todo) => void
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      createTodo: (todo: Todo) => set({ todos: [...get().todos, todo] }),

    }),
    {
      name: 'todo-storage',
    },
  ),
)
