# zyvibe.com

The website for **Zyvibe**, a founder-led web design studio. It sells one offer, the **Website Sprint**: a custom business website in two weeks, for $1,999 one-time, with two revision rounds and a full refund before kickoff. The optional Care Plan ($499/month) is offered only after launch.

- Production: https://zyvibe.com
- Hosting: Cloudflare Pages, project `zyvibe-landing-page` (the project name is fixed; the GitHub repo was renamed to `zyvibe-main-page`)
- Production branch: `main`. Every other branch gets a preview at `<branch>.zyvibe-landing-page.pages.dev`.

## How it works

```
Visitor → /website-sprint form → POST /api/lead
  → validate required fields → sanitize optional fields → rate limit (5/hour per IP)
  → save to D1 (sprint_requests)
  → Resend confirmation email to the customer (from hello@mail.zyvibe.com)
  → Telegram alert (@ZyvibeLeadBot)
  → /thank-you
```

The request is saved before any notification is sent, so an email or Telegram outage never loses a lead. Each row records `email_status` and `telegram_status`.

## Stack

- Static HTML pages in `pages/`, wrapped by `scripts/build.mjs` in the shared `partials/` (head with GTM, GA4, Search Console verification, Cloudflare Web Analytics, canonical, Open Graph and JSON-LD; header; footer). There is no framework.
- Tailwind CSS v4, compiled by the Tailwind CLI into `dist/assets/css/site.css`. Design tokens live in `assets/css/input.css`.
- Cloudflare Pages Function `functions/api/lead.ts`, with D1 binding `ZYVIBE_LEADS` → database `zyvibe_leads`.

```
pages/        index, website-sprint, about, contact, faq, thank-you, 404 (page bodies)
partials/     head.html, header.html, footer.html
assets/       css/input.css, js/site.js, js/form.js, images/
static/       robots.txt, sitemap.xml, _headers, favicon.ico, apple-touch-icon.png (copied to dist root)
functions/    api/lead.ts
scripts/      build.mjs
schema.sql    D1 tables (safe to re-run)
```

## Local development

```bash
npm install
npx wrangler@3 d1 execute zyvibe_leads --local --file=./schema.sql
npm run dev          # builds, then serves dist/ with the Pages Function on http://localhost:8788 (wrangler default)
npm run typecheck    # type-checks the Pages Function
```

For local email and Telegram tests, put the secrets in a `.dev.vars` file (git-ignored). Without them the form still saves to the local D1 and reports `not_configured` for each notification.

## Deployment

Cloudflare Pages builds automatically on every push.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | from `.nvmrc` (22) |

`wrangler.toml` defines the D1 binding and the non-secret variables (`FROM_EMAIL`, `REPLY_TO_EMAIL`, `WEBSITE_URL`). Its `name` must stay `zyvibe-landing-page`.

### Secrets

Set these in Cloudflare Dashboard → Workers & Pages → `zyvibe-landing-page` → Settings → Variables and Secrets, for both Production and Preview:

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends the customer confirmation email (domain `mail.zyvibe.com` is verified in Resend) |
| `TELEGRAM_BOT_TOKEN` | Token for `@ZyvibeLeadBot` |
| `TELEGRAM_CHAT_ID` | Chat that receives new-lead alerts |

### Database

```bash
npx wrangler d1 execute zyvibe_leads --remote --file=./schema.sql
npx wrangler d1 execute zyvibe_leads --remote --command "SELECT id, created_at, name, business_name, email_status, telegram_status FROM sprint_requests ORDER BY id DESC LIMIT 20"
```

## Tracking (keep on every page)

GTM `GT-NNXKN8VR`, GA4 `G-N0FVGWQKJN`, the `google-site-verification` meta tag, the Cloudflare Web Analytics beacon and the canonical URL all live in `partials/head.html` and `partials/header.html`. GA4 events: `cta_click`, `sprint_form_start`, `sprint_form_step2`, `generate_lead`.
