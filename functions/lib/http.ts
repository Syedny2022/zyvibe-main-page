const baseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: baseHeaders });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
