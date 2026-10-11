/**
 * Cloudflare Pages Function — POST /api/intake
 *
 * Website Sprint intake: validates the form, checks Turnstile and rate limits,
 * stores the request in D1, generates the AI concept, and emails the private
 * preview link. Generation runs inside the request (no queue); waitUntil keeps
 * it alive briefly if the visitor closes the tab.
 */
import { parseIntake } from '../../shared/concept';
import type { IntakeInput } from '../../shared/concept';
import type { Env } from '../lib/env';
import { DEFAULT_DAILY_CONCEPT_LIMIT, INBOX_EMAIL, SITE_URL, missingConfig, newConceptId } from '../lib/env';
import { json, readJson } from '../lib/http';
import { verifyTurnstile } from '../lib/turnstile';
import { generateConcept } from '../lib/generate';
import { conceptDelayedEmail, conceptReadyEmail, inboxNotificationEmail, sendEmail } from '../lib/email';
import { PROMPT_VERSION } from '../lib/prompt';

const REQUIRED: (keyof Env)[] = ['OPENROUTER_API_KEY', 'OPENROUTER_MODEL', 'RESEND_API_KEY', 'TURNSTILE_SECRET_KEY'];

async function generateAndDeliver(env: Env, id: string, input: IntakeInput, src: string): Promise<'ready' | 'failed'> {
  const result = await generateConcept(env, input);
  const previewUrl = `${SITE_URL}/preview/${id}`;
  const details = {
    Business: input.businessName,
    Contact: input.contactName,
    Email: input.email,
    Website: input.websiteUrl || 'none',
    Offer: input.offer,
    Audience: input.audience,
    Goal: input.pageGoal,
    Source: src || 'direct',
    Preview: previewUrl,
  };

  if (result.ok) {
    await env.ZYVIBE_LEADS.prepare(`UPDATE concepts SET status = 'ready', concept_json = ? WHERE id = ?`)
      .bind(JSON.stringify(result.concept), id)
      .run();
    const sends = await Promise.allSettled([
      sendEmail(env, conceptReadyEmail(input.email, input.contactName, input.businessName, previewUrl)),
      sendEmail(env, inboxNotificationEmail('ready', details)),
    ]);
    if (sends[0].status === 'rejected') {
      console.error('concept email failed', id, String(sends[0].reason));
      await env.ZYVIBE_LEADS.prepare(`UPDATE concepts SET error_code = 'client_email_failed' WHERE id = ?`).bind(id).run();
    }
    return 'ready';
  }

  console.error('concept generation failed', id, result.errorCode);
  await env.ZYVIBE_LEADS.prepare(`UPDATE concepts SET status = 'failed', error_code = ? WHERE id = ?`)
    .bind(result.errorCode, id)
    .run();
  await Promise.allSettled([
    sendEmail(env, conceptDelayedEmail(input.email, input.contactName, input.businessName)),
    sendEmail(env, inboxNotificationEmail('failed', { ...details, Error: result.errorCode })),
  ]);
  return 'failed';
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const missing = missingConfig(env, REQUIRED);
  if (missing.length > 0) {
    console.error('intake disabled, missing config:', missing.join(', '));
    return json({ success: false, error: `Concept requests are paused right now. Email ${INBOX_EMAIL} and we'll help directly.` }, 503);
  }

  const body = await readJson(request);
  if (!body) return json({ success: false, error: 'Invalid request.' }, 400);

  // Honeypot: real visitors never fill this hidden field.
  if (typeof body.company_fax === 'string' && body.company_fax.length > 0) {
    return json({ success: false, error: 'Invalid request.' }, 400);
  }

  const { input, errors } = parseIntake(body);
  if (!input) return json({ success: false, error: 'Please fix the highlighted fields.', fieldErrors: errors }, 422);

  const humanVerified = await verifyTurnstile(env.TURNSTILE_SECRET_KEY as string, body.turnstileToken, request.headers.get('CF-Connecting-IP'));
  if (!humanVerified) return json({ success: false, error: 'Verification failed. Please try again.' }, 403);

  const perEmail = await env.ZYVIBE_LEADS.prepare(
    `SELECT COUNT(*) AS n FROM concepts WHERE email = ? AND created_at > datetime('now', '-1 day')`,
  ).bind(input.email).first<{ n: number }>();
  if ((perEmail?.n ?? 0) > 0) {
    return json({ success: false, error: 'You already requested a concept in the last 24 hours. Check your inbox for the link, or reply to that email for changes.' }, 429);
  }

  const dailyLimit = Number(env.DAILY_CONCEPT_LIMIT) > 0 ? Number(env.DAILY_CONCEPT_LIMIT) : DEFAULT_DAILY_CONCEPT_LIMIT;
  const today = await env.ZYVIBE_LEADS.prepare(
    `SELECT COUNT(*) AS n FROM concepts WHERE created_at > datetime('now', '-1 day')`,
  ).first<{ n: number }>();
  if ((today?.n ?? 0) >= dailyLimit) {
    return json({ success: false, error: `We've hit today's concept limit. Email ${INBOX_EMAIL} and we'll get yours started directly.` }, 429);
  }

  const id = newConceptId();
  const src = typeof body.src === 'string' ? body.src.replace(/[^a-z0-9_-]/gi, '').slice(0, 40) : '';
  await env.ZYVIBE_LEADS.prepare(
    `INSERT INTO concepts (id, status, business_name, contact_name, email, visual_direction, intake_json, prompt_version, src)
     VALUES (?, 'queued', ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(id, input.businessName, input.contactName, input.email, input.visualDirection, JSON.stringify(input), PROMPT_VERSION, src).run();

  const work = generateAndDeliver(env, id, input, src).catch(async (err) => {
    console.error('concept pipeline crashed', id, String(err));
    await env.ZYVIBE_LEADS.prepare(`UPDATE concepts SET status = 'failed', error_code = 'pipeline_crash' WHERE id = ?`).bind(id).run();
    return 'failed' as const;
  });
  context.waitUntil(work);
  const status = await work;

  return json({ success: true, id, status });
};
