"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, authService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  signin: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  signout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signin = async (email: string, password: string) => {
    const user = await authService.signin(email, password)
    setUser(user)
  }

  const register = async (name: string, email: string, password: string) => {
    const user = await authService.register(name, email, password)
    setUser(user)
  }

  const signout = () => {
    authService.signout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signin, register, signout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
