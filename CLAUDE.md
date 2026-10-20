# zyvibe-main-page

Marketing site for zyvibe.com: React 19 + Vite + Tailwind v4, deployed on Cloudflare Pages. Pages Functions live in `functions/`; leads go to the D1 database bound as `ZYVIBE_LEADS` (see `wrangler.toml`).

## Commands
- `npm run dev`: local dev server
- `npm run build`: client build, then server render into `dist/index.html` (prerender for crawlers)
- `npm run lint`: type check

## Branding standard: Zero-Asset Plain Text Rule
- Never create, generate or import logo image files (SVG, PNG, ICO) or multi-colour logo spans.
- The brand mark is the plain lowercase text `zyvibe` with `font-bold tracking-tight`, inheriting the surrounding text colour.
- Use the native system font stack only; no web fonts.

## Content rules
- All page copy lives in `src/content/site.ts`; the FAQ there also feeds the FAQPage structured data.
- Do not invent clients, testimonials, statistics or results.
- Keep the canonical URL, Google site verification, GTM `GT-NNXKN8VR`, GA4 `G-N0FVGWQKJN` and the Cloudflare beacon in `index.html`.
