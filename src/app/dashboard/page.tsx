import { db } from '@/db'
import { interviews } from '@/db/schema'
import { MetricCard, QuestionAnalytics, InterviewList } from '@/components/dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const allInterviews = await db.select().from(interviews)

  const totalInterviews = allInterviews.length
  const avgDuration = totalInterviews > 0
    ? Math.round(allInterviews.reduce((sum, i) => sum + i.duration, 0) / totalInterviews / 1000)
    : 0
  const completedCount = allInterviews.filter(i => i.completionStatus === 'completed').length
  const completionRate = totalInterviews > 0
    ? Math.round((completedCount / totalInterviews) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Interview Dashboard</h1>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard title="Total Interviews" value={totalInterviews} />
          <MetricCard title="Avg Duration" value={avgDuration} suffix="s" />
          <MetricCard title="Completion Rate" value={completionRate} suffix="%" />
        </div>

        {/* Question Analytics */}
        <QuestionAnalytics extractedVariables={allInterviews.map(i => i.extractedVariables)} />

        {/* Recent Interviews */}
        <InterviewList interviews={allInterviews} />
      </div>
    </div>
  )
}
