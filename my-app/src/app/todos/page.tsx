"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { todoService, type Todo } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, CheckSquare } from "lucide-react";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTodos = useCallback(async () => {
    try {
      const todoData = await todoService.getTodos();
      setTodos(todoData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]); // toast is a dependency since it's used in the callback

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);
  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await todoService.updateTodo(id, { completed });
      setTodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)));
      toast({
        title: "Success",
        description: `Todo marked as ${completed ? "completed" : "pending"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todos</h1>
            <p className="text-gray-600">Manage your todo items</p>
          </div>
          <Link href="/todos/create">
            <Button className="text-black border border-black cursor-pointer">
              <Plus className="mr-2 h-4 w-4 text-black" />
              Add Todo
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {todos.map((todo) => (
            <Card key={todo.id}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) =>
                      handleToggleComplete(todo.id, checked as boolean)
                    }
                    className="mt-1 text-black"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-lg font-medium ${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <Badge
                        variant={todo.completed ? "default" : "secondary"}
                        className="bg-black"
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    {todo.description && (
                      <p
                        className={`text-gray-600 ${
                          todo.completed ? "line-through" : ""
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Updated: {new Date(todo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/todos/${todo.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-600 hover:text-red-700 bg-transparent cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 " />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No todos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new todo.
            </p>
            <div className="mt-6">
              <Link href="/todos/create">
                <Button className="text-black border border-black cursor-pointer">
                  <Plus className="mr-2 h-4 w-4 text-black" />
                  Add Todo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
