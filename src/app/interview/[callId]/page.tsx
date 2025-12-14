import { db } from '@/db'
import { interviews } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PageProps {
  params: Promise<{ callId: string }>
}

export default async function InterviewDetailPage({ params }: PageProps) {
  const { callId } = await params

  const [interview] = await db
    .select()
    .from(interviews)
    .where(eq(interviews.callId, callId))
    .limit(1)

  if (!interview) {
    notFound()
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${seconds}s`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              ← Back to Dashboard
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold">Interview Details</h1>
            <Badge variant={getStatusVariant(interview.completionStatus)} className="w-fit">
              {interview.completionStatus}
            </Badge>
          </div>
        </div>

        {/* Metadata Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Call ID</p>
                <p className="font-mono text-sm break-all">{interview.callId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Participant</p>
                <p className="text-sm">{interview.participantId || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                <p className="text-sm font-medium">{formatDuration(interview.duration)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                <p className="text-sm">
                  {interview.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  <span className="text-muted-foreground ml-2">
                    {interview.createdAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcript Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Transcript</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!interview.transcript || interview.transcript.length === 0 ? (
              <p className="text-muted-foreground px-6 pb-6">No transcript available.</p>
            ) : (
              <ScrollArea className="h-[60vh] max-h-[600px]">
                <div className="space-y-4 px-6 pb-6">
                  {interview.transcript.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                          message.role === 'agent'
                            ? 'bg-muted rounded-tl-sm'
                            : 'bg-primary text-primary-foreground rounded-tr-sm'
                        }`}
                      >
                        <p className={`text-xs font-medium mb-1 ${
                          message.role === 'agent' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                        }`}>
                          {message.role === 'agent' ? 'Agent' : 'User'}
                        </p>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
