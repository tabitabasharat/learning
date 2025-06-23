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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function CreateUserPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "user">("user")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await userService.createUser({ name, email, role })
      toast({
        title: "Success",
        description: "User created successfully",
      })
      router.push("/users")
    } catch (error) {
      toast({
        title: "Error",
        description:error instanceof Error ? error.message : "Failed to create user",
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
          <Link href="/users">
            <Button variant="ghost" className="mb-4 cursor-pointer text-black ">
              <ArrowLeft className="mr-2 h-4 w-4 text-black" />
              Back to Users
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create User</h1>
          <p className="text-gray-600">Add a new user to the system</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-black">User Information</CardTitle>
            <CardDescription className="text-black">Enter the details for the new user</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black" >Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-transparent text-black placeholder:text-gray-500 border-black border focus:border-none focus:ring-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                    className="bg-transparent text-black placeholder:text-gray-500 border-black border focus:border-none focus:ring-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-black">Role</Label>
                <Select value={role} onValueChange={(value: "admin" | "user") => setRole(value)}>
                  <SelectTrigger className="bg-transparent text-black border-black border focus:border-none focus:ring-none">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="user" className="text-black">User</SelectItem>
                    <SelectItem value="admin" className="text-black">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="text-black cursor-pointer border border-black" disabled={loading}>
                  {loading ? "Creating..." : "Create User"}
                </Button>
                <Link href="/users">
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
