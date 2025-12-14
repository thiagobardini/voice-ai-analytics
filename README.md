# HumanTruths Interview Platform

A mini voice interview platform that receives webhooks from Retell AI, stores interview data, and displays analytics.

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript strict mode)
- **Drizzle ORM** + Supabase Postgres - [Documentation](https://orm.drizzle.team/docs/get-started/supabase-new)
- **shadcn/ui** + Tailwind CSS
- **Zod** validation - [Documentation](https://zod.dev/?id=objects)
- **Retell AI** SDK

---

## Project Structure

```
src/
├── app/
│   ├── api/webhooks/retell/route.ts   → Webhook receiver
│   ├── dashboard/page.tsx              → Analytics
│   └── interview/[callId]/page.tsx     → Detail view
├── db/
│   ├── schema.ts                       → Drizzle schema
│   └── index.ts                        → DB connection
├── lib/
│   └── validations/retell.ts           → Zod schemas
drizzle.config.ts                        → Drizzle config
```

---

## Step 1: Setup

```bash
npm install
cp .env.example .env
```

### Environment Variables

```env
DATABASE_POSTGRES_URL=postgresql://...
RETELL_API_KEY=your_retell_api_key
```

---

## Step 2: Vercel Deployment + Supabase

1. Connect your GitHub repo to Vercel
2. Connect Supabase integration in Vercel:
   - Vercel Dashboard → Your Project → Storage → Connect Database
   - Select Supabase → This auto-populates `DATABASE_POSTGRES_URL`
3. Add remaining environment variable:
   - `RETELL_API_KEY`
4. Deploy

### Supabase Dashboard

View data directly in:
- Supabase Dashboard → Table Editor → `interviews` table

---

## Step 3: Database Schema

`src/db/schema.ts`

Simple schema with Drizzle:
- `callId` as unique identifier
- `participantId`
- `transcript` stored as JSON array
- `duration` in milliseconds
- `completionStatus`
- `timestamps`

Drizzle gives us type inference with `$inferSelect` and `$inferInsert` types.

```bash
npm run db:generate   # Generate migrations
npm run db:push       # Push schema to database
npm run db:studio     # Open Drizzle Studio
```

---

## Step 4: Zod Validation

`src/lib/validations/retell.ts`

The Zod schema matches Retell's nested structure:
- `event` type at the top level (`call_started`, `call_ended`, `call_analyzed`)
- `call` object with all the interview data
- `transcript_object` as an array of messages

---

## Step 5: Webhook Endpoint

`src/app/api/webhooks/retell/route.ts`

The webhook endpoint does 4 things:

1. **Validates signature** using Retell SDK (`Retell.verify()`) - real validation, not mock
2. **Parses and validates** payload with Zod
3. **Calculates duration** from timestamps (`end_timestamp - start_timestamp`)
4. **Saves to database** with Drizzle (check if exists, then insert or update)

### Retell Documentation References

- [Webhook Overview](https://docs.retellai.com/features/webhook-overview) - Webhook events and payload structure
- [Secure Webhook](https://docs.retellai.com/features/secure-webhook) - Signature validation
- [Register Webhook](https://docs.retellai.com/features/register-webhook) - Configure webhooks in dashboard

---

## Step 6: Dashboard

`src/app/dashboard/page.tsx`

The dashboard shows:
- **Total interviews** count
- **Average duration**
- **Completion rate**
- **Question-by-question analytics** - each question, response count, sample answers
- **Recent interviews list**

---

## Step 7: Interview Detail

`src/app/interview/[callId]/page.tsx`

The detail page shows:
- **Metadata** at the top (call ID, duration, status)
- **Complete transcript** formatted as conversation between agent and user

---

## Step 8: Development

```bash
npm run dev
```

### Local Testing with ngrok

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Register in Retell dashboard:
# https://abc123.ngrok-free.app/api/webhooks/retell
```

### Production Webhook URL

```
POST https://humantruths-interview.vercel.app/api/webhooks/retell
```

### Vercel Logs

After a webhook is received, check logs in:
- Vercel Dashboard → Your Project → Logs
- Look for: `✅ Interview saved: [call_id]`

---

## Technical Decisions

1. **Drizzle ORM** - SQL-like API with great TypeScript support
2. **Real signature validation** - Using Retell SDK, not mocking
3. **Zod nested schema** - Matches Retell's actual payload structure
4. **Check then insert/update** - Check if exists first, then insert or update
5. **Server Components** - Dashboard and detail pages fetch data directly

---

## Features

- Webhook receiver for Retell AI call events
- Interview analytics dashboard
- Interview detail with transcript view
