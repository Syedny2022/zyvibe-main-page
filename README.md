# zyvibe.com

The main Zyvibe site: the founder-led **Website Sprint** ($2,999 one-time, 2 weeks, 2 revision rounds) with a free AI-assisted landing page concept first. No discovery call, no subscription. The optional Care Plan ($499/month) is offered only after launch and is never linked publicly.

Vite + React, deployed on Cloudflare Pages (project `zyvibe-landing-page`) with Pages Functions and the D1 database `zyvibe_leads`.

## Funnel

1. `/start` — intake form (Turnstile-protected) → `POST /api/intake`
2. `/api/intake` validates, rate-limits (1 per email per 24h, daily cap), stores the request in D1, generates the concept through OpenRouter, and emails the private link via Resend (from `hello@mail.zyvibe.com`, replies to `contact@zyvibe.com`).
3. `/preview/:id` — private, noindex concept preview with the Stripe Payment Link and "Request changes" (`POST /api/feedback`). Links expire after 30 days.
4. `/thanks`, `/terms`, `/privacy`.

The AI returns structured JSON validated in `shared/concept.ts` (no "unlimited", no guarantees, no placeholders) and rendered by our own template. The prompt lives in `functions/lib/prompt.ts` (`PROMPT_VERSION`).

## Configuration (Cloudflare Pages → Settings → Environment variables)

| Name | Type | Purpose |
|---|---|---|
| `VITE_TURNSTILE_SITE_KEY` | build variable | Turnstile widget on `/start` |
| `TURNSTILE_SECRET_KEY` | secret | Server-side Turnstile check |
| `OPENROUTER_API_KEY` | secret | Concept generation |
| `OPENROUTER_MODEL` | variable | OpenRouter model id used for concepts |
| `RESEND_API_KEY` | secret | Concept, notification, and change-request emails |
| `DAILY_CONCEPT_LIMIT` | variable, optional | Max concepts per 24h (default 40) |

Missing settings make the endpoints fail closed with a message pointing visitors to `contact@zyvibe.com`.

## Database

`schema.sql` creates `leads` (existing) and `concepts`. Apply once:

```
npx wrangler d1 execute zyvibe_leads --remote --file=./schema.sql
```

## Local development

```
npm ci
npm run lint     # typechecks the app and the Pages Functions
npm run build
npx wrangler d1 execute zyvibe_leads --local --file=./schema.sql
npx wrangler pages dev dist --d1 ZYVIBE_LEADS=5e57c9a1-168a-4a0f-a5f7-a7400f884740
```

## Must not be removed

`index.html` carries Google Tag Manager `GT-NNXKN8VR`, GA4 `G-N0FVGWQKJN`, the Search Console `google-site-verification` meta tag, the Cloudflare Web Analytics beacon, and the canonical URL. Keep them.
