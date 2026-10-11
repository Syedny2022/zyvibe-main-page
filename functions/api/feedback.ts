/**
 * Cloudflare Pages Function — POST /api/feedback
 *
 * "Request changes" from a concept preview. Emails the request to the Zyvibe
 * inbox (reply-to the client) and sends the client a short confirmation.
 */
import { PREVIEW_TTL_DAYS } from '../../shared/concept';
import type { Env } from '../lib/env';
import { CONCEPT_ID_RE, INBOX_EMAIL, MAX_FEEDBACK_PER_CONCEPT, SITE_URL, missingConfig } from '../lib/env';
import { json, readJson } from '../lib/http';
import { feedbackConfirmationEmail, feedbackInboxEmail, sendEmail } from '../lib/email';

interface FeedbackRow {
  business_name: string;
  contact_name: string;
  email: string;
  feedback_count: number;
  expired: number;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (missingConfig(env, ['RESEND_API_KEY']).length > 0) {
    console.error('feedback disabled, missing RESEND_API_KEY');
    return json({ success: false, error: `Reply to your concept email or write to ${INBOX_EMAIL}.` }, 503);
  }

  const body = await readJson(request);
  const id = typeof body?.id === 'string' ? body.id : '';
  const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 2000) : '';
  if (!CONCEPT_ID_RE.test(id)) return json({ success: false, error: 'Not found.' }, 404);
  if (message.length < 10) return json({ success: false, error: 'Tell us what you would like changed (at least a sentence).' }, 422);

  const row = await env.ZYVIBE_LEADS.prepare(
    `SELECT business_name, contact_name, email, feedback_count,
            created_at < datetime('now', ?) AS expired
     FROM concepts WHERE id = ? AND status = 'ready'`,
  ).bind(`-${PREVIEW_TTL_DAYS} days`, id).first<FeedbackRow>();

  if (!row) return json({ success: false, error: 'Not found.' }, 404);
  if (row.expired) return json({ success: false, error: 'This preview has expired. Request a new concept on zyvibe.com.' }, 410);
  if (row.feedback_count >= MAX_FEEDBACK_PER_CONCEPT) {
    return json({ success: false, error: `You've sent several requests already. Reply to your concept email or write to ${INBOX_EMAIL}.` }, 429);
  }

  try {
    await sendEmail(env, feedbackInboxEmail(row.business_name, row.email, `${SITE_URL}/preview/${id}`, message));
  } catch (err) {
    console.error('feedback email failed', id, String(err));
    return json({ success: false, error: `We couldn't send that. Reply to your concept email or write to ${INBOX_EMAIL}.` }, 502);
  }

  await env.ZYVIBE_LEADS.prepare(`UPDATE concepts SET feedback_count = feedback_count + 1 WHERE id = ?`).bind(id).run();
  await sendEmail(env, feedbackConfirmationEmail(row.email, row.contact_name, row.business_name)).catch((err) => {
    console.error('feedback confirmation failed', id, String(err));
  });

  return json({ success: true });
};
