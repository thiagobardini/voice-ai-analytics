# HumanTruths Interview Platform

Voice interview analytics dashboard with Retell AI integration.

## Tech Stack

- **Next.js 16** (App Router)
- **Drizzle ORM** + Supabase Postgres
- **shadcn/ui** + Tailwind CSS
- **Zod** validation - [Documentation](https://zod.dev/?id=objects)
- **Retell AI** SDK

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

```env
DATABASE_POSTGRES_URL=postgresql://...
RETELL_API_KEY=your_retell_api_key
```

## Development

```bash
npm run dev
```

## Database

```bash
npm run db:generate   # Generate migrations
npm run db:push       # Push schema to database
npm run db:studio     # Open Drizzle Studio
```

### Drizzle Documentation References

- [Drizzle + Supabase Setup](https://orm.drizzle.team/docs/get-started/supabase-new) - Getting started with Drizzle ORM and Supabase Postgres

## Retell Webhook

Configure in Retell dashboard:
```
POST https://humantruths-interview.vercel.app/api/webhooks/retell
```

### Retell Documentation References

- [Webhook Overview](https://docs.retellai.com/features/webhook-overview) - Understanding webhook events and payload structure
- [Secure Webhook](https://docs.retellai.com/features/secure-webhook) - Signature validation for webhook security
- [Register Webhook](https://docs.retellai.com/features/register-webhook) - How to configure webhooks in Retell dashboard

## Features

- Webhook receiver for Retell AI call events
- Interview analytics dashboard
- Interview detail with transcript view
