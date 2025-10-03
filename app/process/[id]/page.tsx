"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, User, Calendar, ArrowRight, Sparkles } from "lucide-react"

interface MediaMetadata {
  title: string
  description: string
  duration: number
  thumbnail: string
  author: string
  publishedAt: string
}

interface Segment {
  id: string
  title: string
  startTime: number
  endTime: number
  description?: string
}

interface ProcessingResult {
  id: string
  url: string
  metadata: MediaMetadata
  transcript?: string
  segments: Segment[]
  status: "processing" | "completed" | "error"
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export default function ProcessingPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<ProcessingResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate processing progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Mock result for demo
          setResult({
            id: params.id as string,
            url: "https://example.com/podcast",
            metadata: {
              title: "The Future of AI in Software Development",
              description:
                "A deep dive into how AI is transforming the way we build software, featuring insights from industry leaders.",
              duration: 3600,
              thumbnail: "/podcast-thumbnail.png",
              author: "Tech Talk Podcast",
              publishedAt: "2024-01-15T10:00:00Z",
            },
            transcript: "Welcome to Tech Talk Podcast...",
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
              {
                id: "4",
                title: "Challenges and Limitations",
                startTime: 1800,
                endTime: 2700,
                description: "Exploring the current limitations of AI in software development",
              },
              {
                id: "5",
                title: "Q&A and Closing",
                startTime: 2700,
                endTime: 3600,
                description: "Audience questions and final thoughts",
              },
            ],
            status: "completed",
          })
          setLoading(false)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [params.id])

  const handleContinue = () => {
    router.push(`/player/${result?.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

        <div className="relative z-10 px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full glass mx-auto mb-8 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Processing Your Content</h1>
            <p className="text-muted-foreground mb-8">
              We're extracting metadata, generating transcripts, and creating smart segments...
            </p>

            <Card className="frosted p-8">
              <Progress value={progress} className="mb-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {progress < 30
                    ? "Extracting metadata..."
                    : progress < 60
                      ? "Generating transcript..."
                      : progress < 90
                        ? "Creating segments..."
                        : "Finalizing..."}
                </span>
                <span>{progress}%</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="frosted p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-6">The content you're looking for doesn't exist or has expired.</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto mb-6 flex items-center justify-center">
              <Play className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Content Ready!</h1>
            <p className="text-muted-foreground">
              Your content has been processed and is ready for interactive exploration.
            </p>
          </div>

          <Card className="frosted p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={result.metadata.thumbnail || "/placeholder.svg"}
                alt={result.metadata.title}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{result.metadata.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">{result.metadata.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {result.metadata.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(result.metadata.duration)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(result.metadata.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="frosted p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold">AI-Generated Segments</h3>
              <Badge variant="secondary">{result.segments.length} segments</Badge>
            </div>

            <div className="space-y-4">
              {result.segments.map((segment, index) => (
                <div key={segment.id} className="glass p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
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
                  </div>
                  {segment.description && <p className="text-sm text-muted-foreground ml-11">{segment.description}</p>}
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center">
            <Button size="lg" onClick={handleContinue} className="px-8">
              Start Taking Notes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
