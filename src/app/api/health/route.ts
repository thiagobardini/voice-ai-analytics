import { NextResponse } from 'next/server'
import { db } from '@/db'
import { sql } from 'drizzle-orm'

/**
 * Health check endpoint
 *
 * Purpose: Prevent Supabase Free Tier from auto-pausing after 7 days of inactivity
 *
 * Usage:
 * - Called by Vercel cron job every 6 days
 * - Makes simple DB query to keep connection alive
 * - Returns status and timestamp
 */
export async function GET() {
  try {
    // Simple query to keep DB active
    const result = await db.execute(sql`SELECT 1 as health`)

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      message: 'Supabase connection active',
    })
  } catch (error) {
    console.error('[Health Check] Database connection failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
