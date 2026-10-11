/**
 * Cloudflare Pages Function — POST /api/lead
 *
 * Accepts: { name?: string, email: string, source_page?: string }
 * Inserts a row into the D1 `leads` table.
 * Binding: ZYVIBE_LEADS  (see wrangler.toml)
 */

interface Env {
  ZYVIBE_LEADS: D1Database;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://zyvibe.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON' }, 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source_page =
    typeof body.source_page === 'string' ? body.source_page.trim().slice(0, 64) : 'hero';

  // Validate (name is optional so email-only forms such as the newsletter can use this endpoint)
  if (name && name.length < 2) {
    return json({ success: false, error: 'Name must be at least 2 characters' }, 422);
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRe.test(email)) {
    return json({ success: false, error: 'A valid email is required' }, 422);
  }

  // Insert
  try {
    await env.ZYVIBE_LEADS.prepare(
      `INSERT INTO leads (name, email, source_page) VALUES (?, ?, ?)`
    )
      .bind(name, email, source_page)
      .run();
  } catch (err) {
    // Duplicate email is acceptable — treat as success
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes('UNIQUE constraint')) {
      console.error('D1 insert error:', msg);
      return json({ success: false, error: 'Database error' }, 500);
    }
  }

  return json({ success: true });
};
