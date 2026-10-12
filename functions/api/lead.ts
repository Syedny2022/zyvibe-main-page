/**
 * Cloudflare Pages Function: POST /api/lead
 *
 * Website Sprint request flow:
 *   validate required fields → sanitize optional fields → rate limit → save to D1 (sprint_requests)
 *   → Resend confirmation email to the customer → Telegram alert → { success: true }
 *
 * The request is saved before any notification is sent, so a Resend or Telegram outage never loses a lead;
 * the outcome of each notification is recorded on the row (email_status, telegram_status).
 *
 * Bindings and variables (see wrangler.toml and README.md):
 *   ZYVIBE_LEADS        D1 database zyvibe_leads
 *   FROM_EMAIL          sender address on mail.zyvibe.com
 *   REPLY_TO_EMAIL      inbox that receives customer replies
 *   RESEND_API_KEY      secret
 *   TELEGRAM_BOT_TOKEN  secret (@ZyvibeLeadBot)
 *   TELEGRAM_CHAT_ID    secret
 */

interface Env {
  ZYVIBE_LEADS: D1Database;
  FROM_EMAIL?: string;
  REPLY_TO_EMAIL?: string;
  RESEND_API_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

type RequiredField = 'name' | 'email' | 'businessName' | 'industry' | 'description' | 'requirements';
type OptionalField = 'phone' | 'website' | 'targetCustomers' | 'notes';

const REQUIRED: Record<RequiredField, { label: string; min: number; max: number }> = {
  name: { label: 'Full name', min: 2, max: 100 },
  email: { label: 'Email', min: 3, max: 254 },
  businessName: { label: 'Business name', min: 2, max: 120 },
  industry: { label: 'Industry', min: 2, max: 100 },
  description: { label: 'Business description', min: 2, max: 2000 },
  requirements: { label: 'What you need', min: 2, max: 2000 },
};

const OPTIONAL: Record<OptionalField, { max: number; fallback: string }> = {
  phone: { max: 40, fallback: 'Not provided' },
  website: { max: 300, fallback: 'Not provided' },
  targetCustomers: { max: 1000, fallback: 'Not provided' },
  notes: { max: 2000, fallback: 'None' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_REQUESTS_PER_IP_PER_HOUR = 5;
const DEFAULT_FROM = 'ZYVIBE <hello@mail.zyvibe.com>';
const DEFAULT_REPLY_TO = 'contact@zyvibe.com';
const CONFIRMATION_SUBJECT = '✅ Request Received — Your Website Sprint Review Starts Now';

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  // Drop control characters except newlines and tabs, normalise line endings, trim.
  return value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function confirmationHtml(name: string): string {
  return `<h1>Thanks for Reaching Out</h1>
<p>Hi ${escapeHtml(name)},</p>
<p>Your Website Sprint request has been received.</p>
<p>We're reviewing your information and preparing a custom website preview for your business.</p>
<p>You can expect an update within 24 hours.</p>
<p>No payment is required at this stage.</p>
<p>Once your preview is ready, we'll send you a private review link.</p>
<p>Thank you for considering ZYVIBE.</p>
<p>
Best Regards,<br>
ZYVIBE
</p>`;
}

function confirmationText(name: string): string {
  return `Hi ${name},

Your Website Sprint request has been received.

We're reviewing your information and preparing a custom website preview for your business.
You can expect an update within 24 hours.
No payment is required at this stage.
Once your preview is ready, we'll send you a private review link.

Thank you for considering ZYVIBE.

Best Regards,
ZYVIBE`;
}

function telegramText(lead: Record<RequiredField | OptionalField, string>): string {
  return `🚀 NEW ZYVIBE LEAD

Name: ${lead.name}
Business: ${lead.businessName}
Email: ${lead.email}
Phone: ${lead.phone}
Website: ${lead.website}
Industry: ${lead.industry}

Description:
${lead.description}

Requirements:
${lead.requirements}

Target Customers:
${lead.targetCustomers}

Additional Notes:
${lead.notes}`;
}

async function sendConfirmation(env: Env, to: string, name: string): Promise<string> {
  if (!env.RESEND_API_KEY) return 'not_configured';
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.FROM_EMAIL || DEFAULT_FROM,
        to: [to],
        reply_to: env.REPLY_TO_EMAIL || DEFAULT_REPLY_TO,
        subject: CONFIRMATION_SUBJECT,
        html: confirmationHtml(name),
        text: confirmationText(name),
      }),
    });
    if (res.ok) return 'sent';
    console.error('Resend error', res.status, (await res.text()).slice(0, 500));
    return `failed_${res.status}`;
  } catch (err) {
    console.error('Resend request failed', err instanceof Error ? err.message : String(err));
    return 'failed_network';
  }
}

async function sendTelegram(env: Env, text: string): Promise<string> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return 'not_configured';
  try {
    // Plain text on purpose: no parse_mode, so customer input can't break or restyle the message.
    const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: text.slice(0, 4096), disable_web_page_preview: true }),
    });
    if (res.ok) return 'sent';
    console.error('Telegram error', res.status, (await res.text()).slice(0, 500));
    return `failed_${res.status}`;
  } catch (err) {
    console.error('Telegram request failed', err instanceof Error ? err.message : String(err));
    return 'failed_network';
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ success: false, error: 'Invalid request.' }, 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company_website === 'string' && body.company_website.trim() !== '') {
    return json({ success: false, error: 'Invalid request.' }, 400);
  }

  // 1. Validate required fields.
  const lead = {} as Record<RequiredField | OptionalField, string>;
  for (const [field, rule] of Object.entries(REQUIRED) as [RequiredField, (typeof REQUIRED)[RequiredField]][]) {
    const raw = typeof body[field] === 'string' ? (body[field] as string).trim() : '';
    if (raw.length > rule.max) {
      return json({ success: false, field, error: `${rule.label} must be ${rule.max} characters or fewer.` }, 422);
    }
    const value = clean(raw, rule.max);
    if (value.length < rule.min) {
      return json({ success: false, field, error: `${rule.label} is required.` }, 422);
    }
    lead[field] = value;
  }
  lead.email = lead.email.toLowerCase();
  if (!EMAIL_RE.test(lead.email)) {
    return json({ success: false, field: 'email', error: 'Please enter a valid email address.' }, 422);
  }

  // 2. Sanitize optional fields.
  for (const [field, rule] of Object.entries(OPTIONAL) as [OptionalField, (typeof OPTIONAL)[OptionalField]][]) {
    lead[field] = clean(body[field], rule.max) || rule.fallback;
  }

  // 3. Rate limit per IP (hashed with the day so raw IPs are never stored).
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ipHash = await sha256Hex(`${ip}|${new Date().toISOString().slice(0, 10)}|zyvibe-sprint`);
  const db = env.ZYVIBE_LEADS;
  try {
    const recent = await db
      .prepare(`SELECT COUNT(*) AS n FROM sprint_requests WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')`)
      .bind(ipHash)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= MAX_REQUESTS_PER_IP_PER_HOUR) {
      return json({ success: false, error: 'Too many requests. Please try again later or email contact@zyvibe.com.' }, 429);
    }
  } catch (err) {
    console.error('D1 rate-limit query failed', err instanceof Error ? err.message : String(err));
    return json({ success: false, error: 'We could not save your request. Please email contact@zyvibe.com.' }, 500);
  }

  // 4. Save the request.
  let id: number;
  try {
    const row = await db
      .prepare(
        `INSERT INTO sprint_requests
           (name, email, business_name, industry, description, requirements, phone, website, target_customers, notes, ip_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id`,
      )
      .bind(
        lead.name,
        lead.email,
        lead.businessName,
        lead.industry,
        lead.description,
        lead.requirements,
        lead.phone,
        lead.website,
        lead.targetCustomers,
        lead.notes,
        ipHash,
      )
      .first<{ id: number }>();
    if (!row) throw new Error('insert returned no row');
    id = row.id;
  } catch (err) {
    console.error('D1 insert failed', err instanceof Error ? err.message : String(err));
    return json({ success: false, error: 'We could not save your request. Please email contact@zyvibe.com.' }, 500);
  }

  // 5 + 6. Customer confirmation email and Telegram alert, in parallel.
  const [emailStatus, telegramStatus] = await Promise.all([
    sendConfirmation(env, lead.email, lead.name),
    sendTelegram(env, telegramText(lead)),
  ]);

  try {
    await db
      .prepare(`UPDATE sprint_requests SET email_status = ?, telegram_status = ? WHERE id = ?`)
      .bind(emailStatus, telegramStatus, id)
      .run();
  } catch (err) {
    console.error('D1 status update failed', err instanceof Error ? err.message : String(err));
  }

  // 7. Success: the frontend redirects to /thank-you.
  return json({ success: true });
};

