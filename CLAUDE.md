# zyvibe-main-page

Website for zyvibe.com, Zyvibe's main business: the **Website Sprint** ($1,999 one-time, two weeks, two revision rounds, full refund before kickoff). The Care Plan ($499/month) is optional, offered only after launch and never auto-enrolled. Never write "unlimited", guarantees or invented results.

- Static HTML (`pages/` + `partials/`, assembled by `scripts/build.mjs`), Tailwind v4 CLI, a Cloudflare Pages Function (`functions/api/lead.ts`) and D1 `zyvibe_leads` (binding `ZYVIBE_LEADS`).
- Design: background `#F5F3F0`, white surfaces, dark `#0A0A0A`, accent `#FF5A00`, Inter. The logo is the plain text "Zyvibe".
- Never remove GTM `GT-NNXKN8VR`, GA4 `G-N0FVGWQKJN`, the Search Console verification meta tag, the Cloudflare beacon or the canonical tag.
- `wrangler.toml` `name` must stay `zyvibe-landing-page` (the Pages project name).
- Never touch DNS for zyvibe.com.
- Checks before pushing: `npm run build` and `npm run typecheck`.
