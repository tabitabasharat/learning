"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { todoService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}
export default function EditTodoPage({ params }: PageProps) {
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const loadTodo = useCallback(async () => {
    try {
      const todoData = await todoService.getTodoById(params.id);
      if (todoData) {
        setTodo({
          title: todoData.title,
          description: todoData.description,
          completed: todoData.completed,
        });
      } else {
        toast({
          title: "Error",
          description: "Todo not found",
          variant: "destructive",
        });
        router.push("/todos");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load todo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id, router, toast]);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await todoService.updateTodo(params.id, {
        ...todo,
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
      router.push("/todos");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Link href="/users">
            <Button variant="ghost" className="mb-4 text-black cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4 text-black" />
              Back to Users
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Update user information</p>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-black">Edit Todo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-black">
              Title
            </Label>
            <Input
              id="title"
              className="bg-transparent text-black placeholder:text-gray-500 border-black border focus:border-none focus:ring-none"
              value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-black">
              Description
            </Label>
            <Textarea
              id="description"
              className="bg-transparent text-black placeholder:text-gray-500 border-black border focus:border-none focus:ring-none"
              value={todo.description}
              onChange={(e) =>
                setTodo({ ...todo, description: e.target.value })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={todo.completed}
              className="text-black"
              onCheckedChange={(checked) =>
                setTodo({ ...todo, completed: !!checked })
              }
            />
            <Label htmlFor="completed" className="text-black">
              Completed
            </Label>
          </div>
          <div className="flex space-x-4">
         <Button type="submit" disabled={loading} className="text-black cursor-pointer border border-black">
                  {loading ? "Updating..." : "Update Todo"}
                </Button>
            <Link href="/users">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
