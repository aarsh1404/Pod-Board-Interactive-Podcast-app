"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Sparkles, BookOpen, Users, ArrowRight, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function LandingPage() {
  const [url, setUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTrialDialog, setShowTrialDialog] = useState(false)
  const [trialText, setTrialText] = useState("No sign-up required for your first try")
  const router = useRouter()
  const { user, signOut, canProcessPodcast, incrementTrialUsage } = useAuth()

  useEffect(() => {
    const updateTrialText = () => {
      if (!user) {
        if (typeof window !== "undefined") {
          const guestTrials = Number.parseInt(localStorage.getItem("podboard_guest_trials") || "0")
          setTrialText(
            guestTrials === 0 ? "No sign-up required for your first try" : "Sign up for 3 more free podcasts",
          )
        }
      } else {
        const remaining = 3 - user.freeTrialsUsed
        setTrialText(`${remaining} free podcast${remaining !== 1 ? "s" : ""} remaining`)
      }
    }

    updateTrialText()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    if (!canProcessPodcast()) {
      setShowTrialDialog(true)
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const result = await response.json()
        incrementTrialUsage()
        router.push(`/process/${result.id}`)
      } else {
        console.error("Processing failed")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Error:", error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.7_0.15_240_/_0.1),transparent_50%)]" />

      <div className="absolute top-20 left-20 w-32 h-32 rounded-full glass opacity-30 animate-pulse" />
      <div className="absolute top-40 right-32 w-24 h-24 rounded-full frosted opacity-20 animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/3 w-40 h-40 rounded-full glass opacity-25 animate-pulse delay-2000" />

      <div className="relative z-10">
        <header className="p-6">
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Play className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">PodBoard</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/boards">
                    <Button variant="ghost" className="glass-hover glass rounded-full">
                      My Boards
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                    <Button variant="ghost" size="icon" onClick={signOut} className="w-8 h-8">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="ghost" className="glass-hover glass rounded-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full frosted mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Transform any podcast into knowledge</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Turn Podcasts Into
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Interactive Knowledge
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 text-pretty max-w-2xl mx-auto">
              Attach notes, sketches, and AI-generated segments to exact timestamps. Organize everything into beautiful
              boards that make sense.
            </p>

            <Card className="frosted p-8 max-w-2xl mx-auto mb-16">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="url"
                  placeholder="Paste your podcast, YouTube, or reel link here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 glass border-0 text-lg py-6"
                  disabled={isProcessing}
                />
                <Button type="submit" size="lg" className="px-8 py-6 text-lg" disabled={isProcessing || !url.trim()}>
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Try Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-4">{trialText}</p>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="glass glass-hover p-6 text-left">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Timestamped Notes</h3>
                <p className="text-muted-foreground">
                  Take notes and sketches that sync perfectly with audio timestamps. Click any note to jump right back
                  to that moment.
                </p>
              </Card>

              <Card className="glass glass-hover p-6 text-left">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Segments</h3>
                <p className="text-muted-foreground">
                  Automatically detect topic changes and generate smart segments. Or import existing chapters from
                  YouTube and podcasts.
                </p>
              </Card>

              <Card className="glass glass-hover p-6 text-left">
                <div className="w-12 h-12 rounded-lg bg-chart-4/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Organized Boards</h3>
                <p className="text-muted-foreground">
                  Create Pinterest-style boards to organize your notes and clips by theme. Build your personal knowledge
                  library.
                </p>
              </Card>
            </div>
          </div>
        </main>

        <footer className="px-6 py-12 border-t border-border/50">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground">Built with ❤️ for podcast lovers and knowledge seekers</p>
          </div>
        </footer>
      </div>

      <Dialog open={showTrialDialog} onOpenChange={setShowTrialDialog}>
        <DialogContent className="frosted">
          <DialogHeader>
            <DialogTitle>Free Trial Limit Reached</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {user
                ? "You've used all 3 of your free podcast processing credits."
                : "You've used your free trial. Sign up to get 3 more free podcasts!"}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTrialDialog(false)} className="flex-1">
                Cancel
              </Button>
              {user ? (
                <Button className="flex-1" disabled>
                  Upgrade (Coming Soon)
                </Button>
              ) : (
                <Link href="/auth/signup" className="flex-1">
                  <Button className="w-full">Sign Up Free</Button>
                </Link>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
