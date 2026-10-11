/**
 * Cloudflare Pages Function — GET /api/concept/:id
 *
 * Returns a concept for its private preview page. The id is a 128-bit random
 * value and is the only access control; links expire after PREVIEW_TTL_DAYS.
 */
import { PREVIEW_TTL_DAYS } from '../../../shared/concept';
import type { Env } from '../../lib/env';
import { CONCEPT_ID_RE, sprintPaymentUrl } from '../../lib/env';
import { json } from '../../lib/http';

interface ConceptRow {
  id: string;
  status: string;
  business_name: string;
  email: string;
  visual_direction: string;
  concept_json: string | null;
  expired: number;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const id = typeof params.id === 'string' ? params.id : '';
  if (!CONCEPT_ID_RE.test(id)) return json({ error: 'Not found' }, 404);

  const row = await env.ZYVIBE_LEADS.prepare(
    `SELECT id, status, business_name, email, visual_direction, concept_json,
            created_at < datetime('now', ?) AS expired
     FROM concepts WHERE id = ?`,
  ).bind(`-${PREVIEW_TTL_DAYS} days`, id).first<ConceptRow>();

  if (!row) return json({ error: 'Not found' }, 404);
  if (row.expired) return json({ status: 'expired' }, 410);

  return json({
    status: row.status,
    businessName: row.business_name,
    visualDirection: row.visual_direction,
    concept: row.status === 'ready' && row.concept_json ? JSON.parse(row.concept_json) : null,
    paymentUrl: row.status === 'ready' ? sprintPaymentUrl(row.id, row.email) : null,
  });
};
