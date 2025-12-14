'use client'

import Link from 'next/link'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Interview } from '@/lib/types'

interface InterviewListProps {
  interviews: Interview[]
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'completed': return 'default'
    case 'pending': return 'secondary'
    default: return 'outline'
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-muted rounded transition-colors"
      title="Copy Call ID"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  )
}

export function InterviewList({ interviews }: InterviewListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        {interviews.length === 0 ? (
          <p className="text-muted-foreground">No interviews yet.</p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {interviews.map((interview) => (
                <Link
                  key={interview.id}
                  href={`/interview/${interview.callId}`}
                  className="block"
                >
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm">{interview.callId}</p>
                            <CopyButton text={interview.callId} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interview.participantId || 'No participant ID'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusVariant(interview.completionStatus)}>
                            {interview.completionStatus}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(interview.duration / 1000)}s
                          </span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
