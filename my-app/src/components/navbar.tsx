"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { User, LogOut, Users, CheckSquare } from "lucide-react"

export function Navbar() {
  const { user, signout } = useAuth()
  const router = useRouter()

  const handleSignout = () => {
    signout()
    router.push("/auth/signin")
  }

  if (!user) return null

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold">
              Dashboard
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/users" className="flex items-center space-x-2 text-sm font-medium hover:text-primary">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </Link>
              <Link href="/todos" className="flex items-center space-x-2 text-sm font-medium hover:text-primary">
                <CheckSquare className="h-4 w-4" />
                <span>Todos</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
