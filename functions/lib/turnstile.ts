/** Verifies a Cloudflare Turnstile token server-side. */
export async function verifyTurnstile(secret: string, token: unknown, remoteIp: string | null): Promise<boolean> {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (remoteIp) form.append('remoteip', remoteIp);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
