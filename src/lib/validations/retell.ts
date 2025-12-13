import { z } from 'zod'

// Retell webhook payload schema
// Docs: https://docs.retellai.com/features/webhook-overview

const TranscriptMessageSchema = z.object({
  role: z.enum(['agent', 'user']),
  content: z.string(),
  words: z.array(z.any()).optional(),
})

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
})

export const RetellWebhookSchema = z.object({
  event: z.enum(['call_started', 'call_ended', 'call_analyzed']),
  call: CallObjectSchema,
})

export type RetellWebhookPayload = z.infer<typeof RetellWebhookSchema>
export type TranscriptMessage = z.infer<typeof TranscriptMessageSchema>