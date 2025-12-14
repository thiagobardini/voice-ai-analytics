import { z } from 'zod'

// Retell webhook payload schema
// Docs: https://docs.retellai.com/features/webhook-overview

const TranscriptMessageSchema = z.object({
  role: z.enum(['agent', 'user']),
  content: z.string(),
  words: z.array(z.any()).optional(),
})

// Extracted variables from Retell's conversation flow
// When not a woman, is_woman/favorite_food/food_reason fields are absent
const ExtractedVariablesSchema = z.object({
  is_woman: z.literal('true').transform(() => true).optional(),
  favorite_food: z.string().optional(),
  food_reason: z.string().optional(),
  previous_node: z.string().optional(),
  current_node: z.string().optional(),
}).passthrough() // Allow additional dynamic variables

const CallObjectSchema = z.object({
  call_id: z.string(),
  agent_id: z.string().optional(),
  call_status: z.string().optional(),
  call_type: z.string().optional(),
  from_number: z.string().optional(),
  to_number: z.string().optional(),
  direction: z.string().optional(),
  start_timestamp: z.number().optional(),
  end_timestamp: z.number().optional(),
  duration_ms: z.number().optional(),
  transcript: z.string().optional(),
  transcript_object: z.array(TranscriptMessageSchema).optional(),
  disconnection_reason: z.string().optional(),
  call_analysis: z.object({
    call_successful: z.boolean().optional(),
  }).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  collected_dynamic_variables: ExtractedVariablesSchema.optional(),
})

export const RetellWebhookSchema = z.object({
  event: z.enum(['call_started', 'call_ended', 'call_analyzed']),
  call: CallObjectSchema,
})

export type RetellWebhookPayload = z.infer<typeof RetellWebhookSchema>
export type TranscriptMessage = z.infer<typeof TranscriptMessageSchema>