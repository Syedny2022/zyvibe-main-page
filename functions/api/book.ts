import { normalizeBooking, validateBooking, type BookingInput } from '../../src/lib/booking';

interface Env {
  ZYVIBE_LEADS: D1Database;
  LEAD_WEBHOOK_URL?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  NOTIFY_EMAIL?: string;
}

const MIN_FILL_MS = 2500;

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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

async function notifyChat(url: string, b: BookingInput): Promise<void> {
  const text = [
    `New Zyvibe booking: ${b.name} (${b.company})`,
    `Email: ${b.email}`,
    `Building: ${b.building}`,
    `Existing: ${b.existing}`,
  ].join('\n');
  // Slack reads `text`, Discord reads `content`; each ignores the other.
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, content: text.slice(0, 2000) }),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
}

async function sendEmail(env: Env, to: string, subject: string, html: string, replyTo?: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
}

function confirmationHtml(b: BookingInput): string {
  const first = escapeHtml(b.name.split(' ')[0]);
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#0A1128">
<p>Hi ${first},</p>
<p>Your free spot with Zyvibe is booked. Thanks for telling us about ${escapeHtml(b.company)}.</p>
<p>Within 24 hours you will receive a link to a working sample landing page built for you. Have a look, then reply and let us know where you want to go from there.</p>
<p>If you want to add anything in the meantime, just reply to this email.</p>
<p><strong>zyvibe</strong><br>zyvibe.com</p>
</div>`;
}

function ownerHtml(b: BookingInput): string {
  const row = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0;color:#555">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`;
  return `<table style="font-family:system-ui,sans-serif;font-size:14px">${row('Name', b.name)}${row('Email', b.email)}${row('Company', b.company)}${row('Building', b.building)}${row('Existing', b.existing)}</table>`;
}

export const onRequestOptions: PagesFunction = async () => new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return json({ success: false, error: 'The form data could not be read. Please refresh the page and try again.' }, 400);
  }

  const elapsed = typeof raw.elapsed_ms === 'number' ? raw.elapsed_ms : 0;
  const honeypot = typeof raw.website_url === 'string' ? raw.website_url : '';
  if (honeypot || elapsed < MIN_FILL_MS) {
    return json({ success: true });
  }

  const booking = normalizeBooking(raw);
  const fields = validateBooking(booking);
  if (Object.keys(fields).length > 0) {
    return json({ success: false, error: 'Some answers need fixing. Check the highlighted fields.', fields }, 422);
  }

  try {
    await env.ZYVIBE_LEADS.prepare(
      'INSERT INTO bookings (name, email, company, building, existing, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
    )
      .bind(booking.name, booking.email, booking.company, booking.building, booking.existing, (request.headers.get('User-Agent') ?? '').slice(0, 300))
      .run();
  } catch (err) {
    console.error('D1 insert error:', err instanceof Error ? err.message : String(err));
    return json({ success: false, error: 'We could not save your booking right now. Please try again in a few minutes.' }, 500);
  }

  const tasks: Promise<void>[] = [];
  if (env.LEAD_WEBHOOK_URL) tasks.push(notifyChat(env.LEAD_WEBHOOK_URL, booking));
  if (env.RESEND_API_KEY && env.EMAIL_FROM) {
    tasks.push(sendEmail(env, booking.email, 'Your free Zyvibe spot is booked', confirmationHtml(booking)));
    if (env.NOTIFY_EMAIL) {
      tasks.push(sendEmail(env, env.NOTIFY_EMAIL, `New booking: ${booking.company}`, ownerHtml(booking), booking.email));
    }
  }
  waitUntil(
    Promise.allSettled(tasks).then((results) => {
      for (const r of results) if (r.status === 'rejected') console.error('notification failed:', String(r.reason));
    }),
  );

  return json({ success: true });
};
