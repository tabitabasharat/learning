"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { todoService } from "@/lib/auth"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function CreateTodoPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      await todoService.createTodo({
        title,
        description,
        completed,
        userId: user.id,
      })
      toast({
        title: "Success",
        description: "Todo created successfully",
      })
      router.push("/todos")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message :"Failed to create todo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/todos">
            <Button variant="ghost" className="mb-4 text-black cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4 text-black" />
              Back to Todos
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Todo</h1>
          <p className="text-gray-600">Add a new todo item</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-black">Todo Information</CardTitle>
            <CardDescription className="text-black">Enter the details for the new todo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-black">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter todo title"
                  className="bg-transparent text-black placeholder:text-gray-500 border-black border focus:border-none focus:ring-nonoe"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-black">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter todo description (optional)"
                  className="bg-transparent text-black placeholder:text-gray-500 border-black border focus:border-none focus:ring-nonoe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  className="text-black"
                  checked={completed}
                  onCheckedChange={(checked) => setCompleted(checked as boolean)}
                />
                <Label htmlFor="completed" className="text-black
                ">Mark as completed</Label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={loading} className="cursor-pointer border border-black text-black">
                  {loading ? "Creating..." : "Create Todo"}
                </Button>
                <Link href="/todos">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
