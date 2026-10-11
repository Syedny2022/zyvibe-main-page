/**
 * Runtime configuration for the Website Sprint funnel.
 * Secrets are set in Cloudflare Pages → Settings → Environment variables; never in the repo.
 */
export interface Env {
  ZYVIBE_LEADS: D1Database;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  DAILY_CONCEPT_LIMIT?: string;
}

export const SITE_URL = 'https://zyvibe.com';
export const EMAIL_FROM = 'Zyvibe <hello@mail.zyvibe.com>';
export const INBOX_EMAIL = 'contact@zyvibe.com';
/** Live Stripe Payment Link for the $2,999 one-time Website Sprint (never a subscription). */
export const SPRINT_PAYMENT_LINK = 'https://buy.stripe.com/aFa14m8pz4xjeNvfAMdZ600';
export const DEFAULT_DAILY_CONCEPT_LIMIT = 40;
export const MAX_FEEDBACK_PER_CONCEPT = 5;

/** Names of required settings that are missing, so a request can fail closed with a clear log line. */
export function missingConfig(env: Env, keys: (keyof Env)[]): string[] {
  return keys.filter((key) => !env[key]);
}

export function sprintPaymentUrl(conceptId: string, email: string): string {
  const params = new URLSearchParams({ client_reference_id: conceptId, prefilled_email: email });
  return `${SPRINT_PAYMENT_LINK}?${params.toString()}`;
}

export function newConceptId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const CONCEPT_ID_RE = /^[a-f0-9]{32}$/;
