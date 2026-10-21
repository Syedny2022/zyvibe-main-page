# zyvibe.com

Source for the Zyvibe website: high-end website design and development, with a free sample site within 24 hours of booking.

## Run locally
1. `npm install`
2. `npm run dev`

To test the booking endpoint locally, run `npm run build` then `npx wrangler pages dev dist` with a `.dev.vars` file (see `.env.example`).

## Deploy
Cloudflare Pages builds with `npm run build` and serves `dist/`.

The `bookings` table must exist once in D1:
`npx wrangler d1 execute zyvibe_leads --remote --file=./migrations/0001_bookings.sql`
