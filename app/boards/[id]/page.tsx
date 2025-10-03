"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, StickyNote, Palette, Play, MoreHorizontal, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

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
  items: BoardItem[]
  createdAt: string
  updatedAt: string
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export default function BoardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [board, setBoard] = useState<Board | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Mock board data - in real app, this would come from API
    setBoard({
      id: params.id as string,
      title: "AI & Machine Learning",
      description: "Insights about artificial intelligence and ML trends",
      color: "from-blue-500 to-purple-600",
      items: [
        {
          id: "1",
          type: "note",
          content:
            "AI will fundamentally change how we approach software architecture. The key is to build systems that can adapt and learn from user behavior.",
          timestamp: 1245,
          mediaTitle: "The Future of AI in Software Development",
          mediaId: "podcast-1",
          createdAt: "2024-01-20T10:30:00Z",
        },
        {
          id: "2",
          type: "segment",
          content:
            "Discussion about machine learning model deployment strategies and best practices for production environments.",
          timestamp: 2100,
          mediaTitle: "ML in Production: Lessons Learned",
          mediaId: "podcast-2",
          createdAt: "2024-01-19T15:45:00Z",
        },
        {
          id: "3",
          type: "note",
          content:
            "Three key principles for AI ethics: transparency, fairness, and accountability. These should guide every AI project.",
          timestamp: 890,
          mediaTitle: "Ethics in AI Development",
          mediaId: "podcast-3",
          createdAt: "2024-01-18T09:15:00Z",
        },
        {
          id: "4",
          type: "sketch",
          content: "/placeholder.svg?key=sketch1",
          timestamp: 1567,
          mediaTitle: "Neural Network Architectures Explained",
          mediaId: "podcast-4",
          createdAt: "2024-01-17T14:20:00Z",
        },
        {
          id: "5",
          type: "note",
          content:
            "The transformer architecture revolutionized NLP. Key insight: attention mechanisms allow models to focus on relevant parts of input.",
          timestamp: 3245,
          mediaTitle: "Deep Dive into Transformers",
          mediaId: "podcast-5",
          createdAt: "2024-01-16T11:00:00Z",
        },
      ],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    })
  }, [params.id])

  const filteredItems =
    board?.items.filter(
      (item) =>
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mediaTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const playFromTimestamp = (mediaId: string, timestamp: number) => {
    router.push(`/player/${mediaId}?t=${timestamp}`)
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.push("/boards")} className="mb-4 glass-hover">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Boards
            </Button>

            <Card className="frosted overflow-hidden">
              {/* Board gradient header */}
              <div className={`h-32 bg-gradient-to-br ${board.color} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-6 right-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{board.title}</h1>
                  <p className="text-white/90">{board.description}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/20">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Board stats */}
              <div className="p-6">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4" />
                    {board.items.length} items
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Updated {new Date(board.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="frosted p-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search items in this board..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-0"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="frosted glass-hover cursor-pointer group"
                onClick={() => playFromTimestamp(item.mediaId, item.timestamp)}
              >
                <div className="p-6">
                  {/* Item type and timestamp */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {item.type === "note" && <StickyNote className="w-4 h-4 text-blue-500" />}
                      {item.type === "sketch" && <Palette className="w-4 h-4 text-purple-500" />}
                      {item.type === "segment" && <Play className="w-4 h-4 text-green-500" />}
                      <Badge variant="secondary" className="text-xs">
                        {formatTime(item.timestamp)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Add item options menu
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Item content */}
                  <div className="mb-4">
                    {item.type === "sketch" ? (
                      <img
                        src={item.content || "/placeholder.svg"}
                        alt="Sketch"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                    ) : (
                      <p className="text-sm line-clamp-4 text-foreground">{item.content}</p>
                    )}
                  </div>

                  {/* Media info */}
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{item.mediaTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      Saved {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <StickyNote className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No items found" : "No items in this board yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start listening to podcasts and save notes or segments to this board"}
              </p>
              {!searchQuery && <Button onClick={() => router.push("/")}>Explore Podcasts</Button>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
