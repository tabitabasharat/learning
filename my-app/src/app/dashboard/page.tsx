"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { userService, todoService } from "@/lib/auth"
import { Users, CheckSquare, UserCheck, Clock } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, todos] = await Promise.all([userService.getUsers(), todoService.getTodos()])

        setStats({
          totalUsers: users.length,
          totalTodos: todos.length,
          completedTodos: todos.filter((t) => t.completed).length,
          pendingTodos: todos.filter((t) => !t.completed).length,
        })
      } catch (error) {
        console.error("Failed to load stats:", error)
      }
    }

    loadStats()
  }, [])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your application today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground text-black">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Total Todos</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.totalTodos}</div>
              <p className="text-xs text-muted-foreground text-black">All todo items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Completed</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.completedTodos}</div>
              <p className="text-xs text-muted-foreground text-black">Completed todos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats.pendingTodos}</div>
              <p className="text-xs text-muted-foreground text-black">Pending todos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Quick Actions</CardTitle>
              <CardDescription className="text-black">Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/users/create" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-black">Create New User</div>
                <div className="text-sm text-gray-600 ">Add a new user to the system</div>
              </a>
              <a href="/todos/create" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-black">Create New Todo</div>
                <div className="text-sm text-gray-600">Add a new todo item</div>
              </a>
              <a href="/users" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-black">Manage Users</div>
                <div className="text-sm text-gray-600">View and edit user accounts</div>
              </a>
              <a href="/todos" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-black">Manage Todos</div>
                <div className="text-sm text-gray-600">View and edit todo items</div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">System Information</CardTitle>
              <CardDescription className="text-black">Current system status and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-black">Your Role:</span>
                <span className="text-sm capitalize text-black">{user.role}</span>
              </div>
              <div className="flex justify-between ">
                <span className="text-sm font-medium text-black ">Account Created:</span>
                <span className="text-sm text-black">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-black">Status:</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
