"use client"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  createdAt: string
}

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

// Mock authentication functions
export const authService = {
  async signin(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "admin@example.com" && password === "password") {
      const user: User = {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("user", JSON.stringify(user))
      return user
    }

    throw new Error("Invalid credentials")
  },

async register(name: string, email: string, password: string): Promise<User> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user: User & { password?: string } = {
    id: Date.now().toString(),
    name,
    email,
    role: "user",
    createdAt: new Date().toISOString(),
    password // Store password (only for demo purposes)
  }

  localStorage.setItem("user", JSON.stringify(user))
  return user
},

  async forgotPassword(email: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Password reset email sent to ${email}`)
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  signout(): void {
    localStorage.removeItem("user")
  },
}

// Mock user service
export const userService = {
  async getUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = localStorage.getItem("users")
    return users
      ? JSON.parse(users)
      : [
          {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            createdAt: new Date().toISOString(),
          },
        ]
  },

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = await this.getUsers()
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedUsers = [...users, newUser]
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    return newUser
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = await this.getUsers()
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) throw new Error("User not found")

    const updatedUser = { ...users[userIndex], ...userData }
    users[userIndex] = updatedUser
    localStorage.setItem("users", JSON.stringify(users))
    return updatedUser
  },

  async deleteUser(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users = await this.getUsers()
    const filteredUsers = users.filter((u) => u.id !== id)
    localStorage.setItem("users", JSON.stringify(filteredUsers))
  },

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find((u) => u.id === id) || null
  },
}

// Mock todo service
export const todoService = {
  async getTodos(): Promise<Todo[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const todos = localStorage.getItem("todos")
    return todos ? JSON.parse(todos) : []
  },

  async createTodo(todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const todos = await this.getTodos()
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedTodos = [...todos, newTodo]
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
    return newTodo
  },

  async updateTodo(id: string, todoData: Partial<Todo>): Promise<Todo> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const todos = await this.getTodos()
    const todoIndex = todos.findIndex((t) => t.id === id)
    if (todoIndex === -1) throw new Error("Todo not found")

    const updatedTodo = {
      ...todos[todoIndex],
      ...todoData,
      updatedAt: new Date().toISOString(),
    }
    todos[todoIndex] = updatedTodo
    localStorage.setItem("todos", JSON.stringify(todos))
    return updatedTodo
  },

  async deleteTodo(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const todos = await this.getTodos()
    const filteredTodos = todos.filter((t) => t.id !== id)
    localStorage.setItem("todos", JSON.stringify(filteredTodos))
  },

  async getTodoById(id: string): Promise<Todo | null> {
    const todos = await this.getTodos()
    return todos.find((t) => t.id === id) || null
  },
}
