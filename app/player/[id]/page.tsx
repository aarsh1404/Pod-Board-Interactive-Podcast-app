"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Clock,
  StickyNote,
  Palette,
  Save,
  Bookmark,
  ChevronRight,
  FolderPlus,
} from "lucide-react"

interface Note {
  id: string
  timestamp: number
  content: string
  type: "text" | "sketch"
  createdAt: string
}

interface Segment {
  id: string
  title: string
  startTime: number
  endTime: number
  description?: string
}

interface MediaData {
  id: string
  title: string
  author: string
  duration: number
  thumbnail: string
  audioUrl: string
  segments: Segment[]
}

interface Board {
  id: string
  title: string
  color: string
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export default function PlayerPage() {
  const params = useParams()
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [mediaData, setMediaData] = useState<MediaData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [activeTab, setActiveTab] = useState("notes")
  const [isDrawing, setIsDrawing] = useState(false)
  const [boards, setBoards] = useState<Board[]>([
    { id: "1", title: "AI & Machine Learning", color: "from-blue-500 to-purple-600" },
    { id: "2", title: "Startup Advice", color: "from-green-500 to-teal-600" },
    { id: "3", title: "Design Inspiration", color: "from-pink-500 to-rose-600" },
  ])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isSaveToBoardOpen, setIsSaveToBoardOpen] = useState(false)

  useEffect(() => {
    setMediaData({
      id: params.id as string,
      title: "The Future of AI in Software Development",
      author: "Tech Talk Podcast",
      duration: 3600,
      thumbnail: "/placeholder.svg?key=player",
      audioUrl: "/placeholder-audio.mp3", // Mock audio URL
      segments: [
        {
          id: "1",
          title: "Introduction & Guest Welcome",
          startTime: 0,
          endTime: 300,
          description: "Host introduces the topic and welcomes Sarah Chen",
        },
        {
          id: "2",
          title: "Current State of AI Tools",
          startTime: 300,
          endTime: 900,
          description: "Discussion about existing AI developer tools and their impact",
        },
        {
          id: "3",
          title: "Future Predictions",
          startTime: 900,
          endTime: 1800,
          description: "Sarah's predictions about where AI development tools are heading",
        },
      ],
    })
  }, [params.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [mediaData])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = time
    setCurrentTime(time)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    seekTo(newTime)
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      timestamp: currentTime,
      content: newNote,
      type: "text",
      createdAt: new Date().toISOString(),
    }

    setNotes((prev) => [...prev, note])
    setNewNote("")
  }

  const jumpToNote = (timestamp: number) => {
    seekTo(timestamp)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const saveSketch = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL()
    const note: Note = {
      id: Date.now().toString(),
      timestamp: currentTime,
      content: dataURL,
      type: "sketch",
      createdAt: new Date().toISOString(),
    }

    setNotes((prev) => [...prev, note])

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const saveToBoard = (boardId: string) => {
    if (!selectedNote) return

    console.log(`Saving note ${selectedNote.id} to board ${boardId}`)
    setIsSaveToBoardOpen(false)
    setSelectedNote(null)
  }

  if (!mediaData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading player...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Media info */}
              <Card className="frosted p-6">
                <div className="flex gap-4">
                  <img
                    src={mediaData.thumbnail || "/placeholder.svg"}
                    alt={mediaData.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{mediaData.title}</h1>
                    <p className="text-muted-foreground">{mediaData.author}</p>
                  </div>
                </div>
              </Card>

              {/* Audio player */}
              <Card className="frosted p-6">
                <audio ref={audioRef} src={mediaData.audioUrl} />

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div
                    className="w-full h-2 bg-muted rounded-full cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const percent = (e.clientX - rect.left) / rect.width
                      seekTo(percent * duration)
                    }}
                  >
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => skip(-15)} className="glass-hover">
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button size="icon" onClick={togglePlay} className="w-12 h-12">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>

                  <Button variant="ghost" size="icon" onClick={() => skip(15)} className="glass-hover">
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Volume2 className="w-4 h-4" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => {
                        const newVolume = Number.parseFloat(e.target.value)
                        setVolume(newVolume)
                        if (audioRef.current) {
                          audioRef.current.volume = newVolume
                        }
                      }}
                      className="w-20"
                    />
                  </div>
                </div>
              </Card>

              {/* Segments */}
              <Card className="frosted p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Segments
                </h3>
                <div className="space-y-3">
                  {mediaData.segments.map((segment, index) => (
                    <div
                      key={segment.id}
                      className={`glass p-4 rounded-lg cursor-pointer transition-all hover:bg-accent/10 ${
                        currentTime >= segment.startTime && currentTime < segment.endTime ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => seekTo(segment.startTime)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{segment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="frosted p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes" className="flex items-center gap-2">
                      <StickyNote className="w-4 h-4" />
                      Notes
                    </TabsTrigger>
                    <TabsTrigger value="sketch" className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Sketch
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="space-y-4">
                    {/* Add note */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Current time: {formatTime(currentTime)}
                      </div>
                      <Textarea
                        placeholder="Add a note at this timestamp..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="glass border-0"
                        rows={3}
                      />
                      <Button onClick={addNote} disabled={!newNote.trim()} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Note
                      </Button>
                    </div>

                    {/* Notes list */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notes
                        .filter((note) => note.type === "text")
                        .map((note) => (
                          <div
                            key={note.id}
                            className="glass p-3 rounded-lg cursor-pointer hover:bg-accent/10 group"
                            onClick={() => jumpToNote(note.timestamp)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {formatTime(note.timestamp)}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedNote(note)
                                  setIsSaveToBoardOpen(true)
                                }}
                              >
                                <FolderPlus className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-sm">{note.content}</p>
                          </div>
                        ))}
                      {notes.filter((note) => note.type === "text").length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-8">
                          No notes yet. Start taking notes as you listen!
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="sketch" className="space-y-4">
                    {/* Drawing canvas */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Current time: {formatTime(currentTime)}
                      </div>
                      <div className="glass p-4 rounded-lg">
                        <canvas
                          ref={canvasRef}
                          width={300}
                          height={200}
                          className="w-full border border-border rounded cursor-crosshair"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            const ctx = canvasRef.current?.getContext("2d")
                            if (ctx && canvasRef.current) {
                              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                            }
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Clear
                        </Button>
                        <Button onClick={saveSketch} className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Save Sketch
                        </Button>
                      </div>
                    </div>

                    {/* Sketches list */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notes
                        .filter((note) => note.type === "sketch")
                        .map((note) => (
                          <div
                            key={note.id}
                            className="glass p-3 rounded-lg cursor-pointer hover:bg-accent/10 group"
                            onClick={() => jumpToNote(note.timestamp)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {formatTime(note.timestamp)}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedNote(note)
                                  setIsSaveToBoardOpen(true)
                                }}
                              >
                                <FolderPlus className="w-3 h-3" />
                              </Button>
                            </div>
                            <img
                              src={note.content || "/placeholder.svg"}
                              alt="Sketch"
                              className="w-full rounded border border-border"
                            />
                          </div>
                        ))}
                      {notes.filter((note) => note.type === "sketch").length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-8">
                          No sketches yet. Draw something while you listen!
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isSaveToBoardOpen} onOpenChange={setIsSaveToBoardOpen}>
        <DialogContent className="frosted">
          <DialogHeader>
            <DialogTitle>Save to Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a board to save this {selectedNote?.type === "sketch" ? "sketch" : "note"} to:
            </p>
            <div className="space-y-2">
              {boards.map((board) => (
                <Button
                  key={board.id}
                  variant="outline"
                  className="w-full justify-start glass-hover bg-transparent"
                  onClick={() => saveToBoard(board.id)}
                >
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${board.color} mr-3`} />
                  {board.title}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
