"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  freeTrialsUsed: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signOut: () => void
  canProcessPodcast: () => boolean
  incrementTrialUsage: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("podboard_user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          localStorage.removeItem("podboard_user")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const signOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("podboard_user")
    }
    setUser(null)
  }

  const canProcessPodcast = () => {
    if (!user) {
      // Allow 1 free trial for non-authenticated users
      if (typeof window === "undefined") return false
      const guestTrials = Number.parseInt(localStorage.getItem("podboard_guest_trials") || "0")
      return guestTrials < 1
    }
    // Allow 3 free trials for authenticated users
    return user.freeTrialsUsed < 3
  }

  const incrementTrialUsage = () => {
    if (typeof window === "undefined") return

    if (!user) {
      // Increment guest trials
      const guestTrials = Number.parseInt(localStorage.getItem("podboard_guest_trials") || "0")
      localStorage.setItem("podboard_guest_trials", (guestTrials + 1).toString())
    } else {
      // Increment user trials
      const updatedUser = { ...user, freeTrialsUsed: user.freeTrialsUsed + 1 }
      setUser(updatedUser)
      localStorage.setItem("podboard_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signOut,
        canProcessPodcast,
        incrementTrialUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
