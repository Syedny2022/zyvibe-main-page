import type { Env } from './env';
import { EMAIL_FROM, INBOX_EMAIL, SITE_URL } from './env';
import { escapeHtml } from './http';
import { CARE_PLAN_PRICE_LABEL, SPRINT_PRICE_LABEL, SPRINT_REVISION_ROUNDS } from '../../shared/concept';

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(env: Env, message: EmailMessage): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo ?? INBOX_EMAIL,
    }),
  });
  if (!res.ok) throw new Error(`resend_http_${res.status}`);
}

function layout(bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f7;font-family:Inter,Arial,sans-serif;color:#1f2937">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:32px">
<tr><td style="font-size:22px;font-weight:800;color:#030014;padding-bottom:20px">Zyvibe</td></tr>
<tr><td style="font-size:15px;line-height:1.6">${bodyHtml}</td></tr>
<tr><td style="padding-top:28px;font-size:12px;color:#6b7280">Zyvibe · <a href="${SITE_URL}" style="color:#6b7280">zyvibe.com</a> · Reply to this email to reach us.</td></tr>
</table></td></tr></table></body></html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${href}" style="background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px;display:inline-block">${escapeHtml(label)}</a></p>`;
}

export function conceptReadyEmail(to: string, contactName: string, businessName: string, previewUrl: string): EmailMessage {
  const name = escapeHtml(contactName);
  const business = escapeHtml(businessName);
  return {
    to,
    subject: `Your landing page concept for ${businessName} is ready`,
    html: layout(`<p>Hi ${name},</p>
<p>Your AI-assisted landing page concept for <strong>${business}</strong> is ready. It shows a possible direction, structure, and message based on what you told us.</p>
${button(previewUrl, 'View your concept')}
<p>From the preview you can start your Website Sprint (${SPRINT_PRICE_LABEL}, one-time, 2 weeks, ${SPRINT_REVISION_ROUNDS} revision rounds) or request changes. You can also just reply to this email.</p>
<p>This link is private and stays active for 30 days.</p>`),
    text: `Hi ${contactName},

Your AI-assisted landing page concept for ${businessName} is ready:
${previewUrl}

From the preview you can start your Website Sprint (${SPRINT_PRICE_LABEL}, one-time, 2 weeks, ${SPRINT_REVISION_ROUNDS} revision rounds) or request changes. You can also reply to this email.

This link is private and stays active for 30 days.

Zyvibe — zyvibe.com`,
  };
}

export function conceptDelayedEmail(to: string, contactName: string, businessName: string): EmailMessage {
  return {
    to,
    subject: `Your concept for ${businessName} is taking a little longer`,
    html: layout(`<p>Hi ${escapeHtml(contactName)},</p>
<p>We received your request, but your concept for <strong>${escapeHtml(businessName)}</strong> didn't generate cleanly on the first pass. We've been notified and will email you the preview link directly.</p>
<p>No action is needed from you. You can reply to this email with anything you'd like to add.</p>`),
    text: `Hi ${contactName},

We received your request, but your concept for ${businessName} didn't generate cleanly on the first pass. We've been notified and will email you the preview link directly.

No action is needed from you. You can reply to this email with anything you'd like to add.

Zyvibe — zyvibe.com`,
  };
}

export function inboxNotificationEmail(kind: 'ready' | 'failed', details: Record<string, string>): EmailMessage {
  const rows = Object.entries(details)
    .map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;vertical-align:top">${escapeHtml(key)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`)
    .join('');
  const subject = kind === 'ready'
    ? `New concept request: ${details['Business'] ?? ''}`
    : `Concept generation FAILED: ${details['Business'] ?? ''}`;
  return {
    to: INBOX_EMAIL,
    subject,
    html: layout(`<p>${kind === 'ready' ? 'A new concept was generated and emailed to the client.' : 'A concept failed to generate after one retry. The client was told we will follow up by email.'}</p><table role="presentation">${rows}</table>`),
    text: `${kind === 'ready' ? 'A new concept was generated and emailed to the client.' : 'A concept failed to generate after one retry. The client was told we will follow up by email.'}\n\n${Object.entries(details).map(([k, v]) => `${k}: ${v}`).join('\n')}`,
    replyTo: details['Email'],
  };
}

export function feedbackInboxEmail(businessName: string, clientEmail: string, previewUrl: string, message: string): EmailMessage {
  return {
    to: INBOX_EMAIL,
    subject: `Change request: ${businessName}`,
    html: layout(`<p><strong>${escapeHtml(businessName)}</strong> requested changes to their concept.</p>
<p style="white-space:pre-wrap;background:#f4f4f7;border-radius:8px;padding:12px">${escapeHtml(message)}</p>
<p>Concept: <a href="${previewUrl}">${previewUrl}</a><br>Reply to this email to answer ${escapeHtml(clientEmail)} directly.</p>`),
    text: `${businessName} requested changes to their concept.\n\n${message}\n\nConcept: ${previewUrl}\nReply to this email to answer ${clientEmail} directly.`,
    replyTo: clientEmail,
  };
}

export function feedbackConfirmationEmail(to: string, contactName: string, businessName: string): EmailMessage {
  return {
    to,
    subject: `We got your change request for ${businessName}`,
    html: layout(`<p>Hi ${escapeHtml(contactName)},</p>
<p>Thanks — your change request for <strong>${escapeHtml(businessName)}</strong> reached us. We'll reply by email.</p>
<p>The Website Sprint is a one-time ${SPRINT_PRICE_LABEL} fee. The optional Care Plan (${CARE_PLAN_PRICE_LABEL}) is only offered after launch.</p>`),
    text: `Hi ${contactName},\n\nThanks — your change request for ${businessName} reached us. We'll reply by email.\n\nThe Website Sprint is a one-time ${SPRINT_PRICE_LABEL} fee. The optional Care Plan (${CARE_PLAN_PRICE_LABEL}) is only offered after launch.\n\nZyvibe — zyvibe.com`,
  };
}
