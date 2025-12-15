import { pgTable, text, integer, timestamp, json } from 'drizzle-orm/pg-core'

// Type for extracted variables from Retell's conversation flow
export type ExtractedVariables = {
  is_woman: boolean
  favorite_food?: string
  food_reason?: string
  previous_node?: string
  current_node?: string
  [key: string]: string | boolean | undefined
}

export const interviews = pgTable('interviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  callId: text('call_id').notNull().unique(),
  participantId: text('participant_id'),
  transcript: json('transcript').$type<{ role: 'user' | 'agent'; content: string }[]>().default([]),
  extractedVariables: json('extracted_variables').$type<ExtractedVariables>(),
  duration: integer('duration').notNull().default(0), // milliseconds
  completionStatus: text('completion_status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Interview = typeof interviews.$inferSelect
export type NewInterview = typeof interviews.$inferInsert
