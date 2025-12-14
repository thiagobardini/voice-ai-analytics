import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ExtractedVariables } from '@/lib/types'

interface QuestionAnalyticsProps {
  extractedVariables: (ExtractedVariables | null)[]
}

// Process extracted variables for analytics
function processExtractedVariables(variables: (ExtractedVariables | null)[]) {
  let womanYes = 0
  let womanNo = 0
  const foodCounts = new Map<string, { count: number; reasons: string[] }>()

  variables.forEach((vars) => {
    if (!vars) return

    if (vars.is_woman === true) {
      womanYes++
      if (vars.favorite_food) {
        const food = vars.favorite_food.toLowerCase().trim()
        const existing = foodCounts.get(food) || { count: 0, reasons: [] }
        existing.count++
        if (vars.food_reason) {
          existing.reasons.push(vars.food_reason)
        }
        foodCounts.set(food, existing)
      }
    } else if (vars.is_woman === false) {
      womanNo++
    }
  })

  // Sort by count descending
  const sortedFoods = Array.from(foodCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([food, data]) => ({ food, ...data }))

  return { womanYes, womanNo, sortedFoods }
}

export function QuestionAnalytics({ extractedVariables }: QuestionAnalyticsProps) {
  const { womanYes, womanNo, sortedFoods } = processExtractedVariables(extractedVariables)
  const total = womanYes + womanNo
  const hasData = total > 0

  if (!hasData) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Question Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No questions analyzed yet.</p>
        </CardContent>
      </Card>
    )
  }

  const yesPercent = Math.round((womanYes / total) * 100)
  const noPercent = 100 - yesPercent

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Are you a woman? */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Are you a woman?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                {yesPercent > 0 && (
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${yesPercent}%` }}
                  />
                )}
                {noPercent > 0 && (
                  <div
                    className="h-full bg-slate-400"
                    style={{ width: `${noPercent}%` }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Yes: {womanYes} ({yesPercent}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span>No: {womanNo} ({noPercent}%)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Total: {total} responses
          </p>
        </CardContent>
      </Card>

      {/* What's your favorite food and why? */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">What&apos;s your favorite food and why?</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedFoods.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No responses yet (only asked to women)
            </p>
          ) : (
            <ScrollArea className="h-[150px]">
              <div className="space-y-3 pr-4">
                {sortedFoods.map(({ food, count, reasons }) => (
                  <div key={food} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm capitalize">{food}</span>
                      <span className="text-xs text-muted-foreground">
                        {count}x
                      </span>
                    </div>
                    {reasons.length > 0 && (
                      <p className="text-xs text-muted-foreground pl-2 border-l-2 border-muted">
                        {reasons[0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
