import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useQuery } from '@tanstack/react-query'

export type Todo = {
    id: string
    title: string
    done: boolean
}

type TodoStore = {
    todos: Todo[]
    createTodo: (title: string) => void,
    toggleTodo: (id: string, done: boolean) => void,
    deleteTodo: (id: string) => void,
    fetchTodos: () => void,
    deleteAllCompleted: () => void,
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      createTodo: async (title: string) => {
        try {
          const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: title}),
          })
          if (!response.ok) {
            throw new Error('Erreur lors de la création du todo')
          }
          const createdTodo = await response.json()
          set({ todos: [...get().todos, createdTodo] })
        } catch (error) {
          console.error(error)
        }
      },
      toggleTodo: async (id: string, done: boolean = false) => {
        try {
          const todo = get().todos.find((t) => t.id === id)
          if (!todo) {
            throw new Error('Todo not found')
          }
          const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ done: done }),
          })
          if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du todo')
          }
          const updatedTodo = await response.json()
          set({
            todos: get().todos.map((t) =>
              t.id === id ? updatedTodo : t
            ),
          });
        } catch (error) {
          console.error(error)
        }
      },
      deleteTodo: async (id: string) => {
        try {
          const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
          })
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression du todo')
          }
        } catch (error) {
          console.error(error)
          return
        }
        set({
          todos: get().todos.filter((t) => t.id !== id),
        });
      },
      fetchTodos: async () => {
        try {
          const response = await fetch(`${API_URL}/todos`)
          if (!response.ok) {
            throw new Error('Erreur lors du chargement des todos')
          }
          const todos = await response.json()
          set({ todos })
        } catch (error) {
          console.error(error)
        }
      },
      deleteAllCompleted: async () => {
        try {
          const response = await fetch(`${API_URL}/todos/completed`, {
            method: 'DELETE',
          })
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression des todos complétés')
          }
          await response.json()
          set({
            todos: get().todos.filter((t) => !t.done),
          });
        } catch (error) {
          console.error(error)
        }
      },
    }),
    {
      name: 'todo-storage',
      onRehydrateStorage: () => (state) => {
        state?.fetchTodos()
      },
    },
  ),
)
