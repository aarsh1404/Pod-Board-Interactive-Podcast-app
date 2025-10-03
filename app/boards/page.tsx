"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Folder, MoreHorizontal, Search, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface BoardItem {
  id: string
  type: "note" | "sketch" | "segment"
  content: string
  timestamp: number
  mediaTitle: string
  mediaId: string
  createdAt: string
}

interface Board {
  id: string
  title: string
  description: string
  color: string
  itemCount: number
  items: BoardItem[]
  createdAt: string
  updatedAt: string
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export default function BoardsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1",
      title: "AI & Machine Learning",
      description: "Insights about artificial intelligence and ML trends",
      color: "from-blue-500 to-purple-600",
      itemCount: 12,
      items: [],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    {
      id: "2",
      title: "Startup Advice",
      description: "Key takeaways from entrepreneurship podcasts",
      color: "from-green-500 to-teal-600",
      itemCount: 8,
      items: [],
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-18T12:00:00Z",
    },
    {
      id: "3",
      title: "Design Inspiration",
      description: "Creative ideas and design principles",
      color: "from-pink-500 to-rose-600",
      itemCount: 15,
      items: [],
      createdAt: "2024-01-05T14:00:00Z",
      updatedAt: "2024-01-22T10:15:00Z",
    },
    {
      id: "4",
      title: "Tech Trends",
      description: "Latest developments in technology",
      color: "from-orange-500 to-red-600",
      itemCount: 6,
      items: [],
      createdAt: "2024-01-12T11:00:00Z",
      updatedAt: "2024-01-19T16:45:00Z",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [newBoardTitle, setNewBoardTitle] = useState("")
  const [newBoardDescription, setNewBoardDescription] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredBoards = boards.filter(
    (board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const createBoard = () => {
    if (!newBoardTitle.trim()) return

    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-pink-500 to-rose-600",
      "from-orange-500 to-red-600",
      "from-indigo-500 to-blue-600",
      "from-yellow-500 to-orange-600",
    ]

    const newBoard: Board = {
      id: Date.now().toString(),
      title: newBoardTitle,
      description: newBoardDescription,
      color: colors[Math.floor(Math.random() * colors.length)],
      itemCount: 0,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setBoards((prev) => [newBoard, ...prev])
    setNewBoardTitle("")
    setNewBoardDescription("")
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <Link href="/">
                <Button variant="ghost" className="mb-4 glass-hover">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold mb-2">My Boards</h1>
              <p className="text-muted-foreground">Organize your notes and clips into themed collections</p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Board
                </Button>
              </DialogTrigger>
              <DialogContent className="frosted">
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Board Title</label>
                    <Input
                      placeholder="Enter board title..."
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      className="glass border-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                    <Input
                      placeholder="Describe what this board is for..."
                      value={newBoardDescription}
                      onChange={(e) => setNewBoardDescription(e.target.value)}
                      className="glass border-0"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={createBoard} disabled={!newBoardTitle.trim()} className="flex-1">
                      Create Board
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="frosted p-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-0"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBoards.map((board) => (
              <Card
                key={board.id}
                className="frosted glass-hover cursor-pointer group overflow-hidden"
                onClick={() => router.push(`/boards/${board.id}`)}
              >
                <div className={`h-24 bg-gradient-to-br ${board.color} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-white/80 hover:text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {board.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {board.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {board.itemCount} items
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updated {new Date(board.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredBoards.length === 0 && (
            <div className="text-center py-16">
              <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">{searchQuery ? "No boards found" : "No boards yet"}</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first board to start organizing your notes and clips"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Board
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
