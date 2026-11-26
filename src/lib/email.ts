import { SITE } from "./site";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * Transactional mail only, sent from mail.zyvibe.com through Resend.
 * Newsletter broadcasts are intentionally not possible through this helper.
 */
export async function sendTransactionalEmail({
  to,
  subject,
  html,
  replyTo,
}: SendArgs): Promise<{ sent: boolean; dryRun?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Local development and tests never reach Resend. Log only the envelope,
    // never the body, so a receipt can be inspected without sending mail.
    console.log(`[DRY-RUN EMAIL] to=${to} subject=${subject}`);
    return { sent: false, dryRun: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: SITE.emails.transactionalFrom,
        to: [to],
        subject,
        html,
        reply_to: replyTo ?? SITE.emails.contact,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { sent: false, error: `Resend responded ${response.status} ${detail.slice(0, 200)}` };
    }
    return { sent: true };
  } catch (error) {
    return { sent: false, error: error instanceof Error ? error.message : "Unknown send error" };
  }
}

export function placementReceiptEmail(input: {
  builderName: string;
  projectName: string;
  projectUrl: string;
  placementName: string;
  status: string;
  urlReason: string;
}): string {
  return `<div style="font-family:Inter,Helvetica,Arial,sans-serif;background:#111214;color:#edece8;padding:32px">
  <p style="font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9a9da3">Zyvibe · payment receipt</p>
  <h1 style="font-size:22px;font-weight:600;margin:12px 0 20px">Placement received</h1>
  <p style="color:#9a9da3;line-height:1.65">Hi ${escapeHtml(input.builderName)}, your payment for <strong style="color:#edece8">${escapeHtml(
    input.placementName
  )}</strong> was processed by Stripe.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
    <tr><td style="padding:8px 0;color:#9a9da3">Project</td><td style="padding:8px 0">${escapeHtml(
      input.projectName
    )}</td></tr>
    <tr><td style="padding:8px 0;color:#9a9da3">URL</td><td style="padding:8px 0">${escapeHtml(
      input.projectUrl
    )}</td></tr>
    <tr><td style="padding:8px 0;color:#9a9da3">Activation status</td><td style="padding:8px 0">${escapeHtml(
      input.status
    )}</td></tr>
    <tr><td style="padding:8px 0;color:#9a9da3">URL check</td><td style="padding:8px 0">${escapeHtml(
      input.urlReason
    )}</td></tr>
  </table>
  <p style="color:#9a9da3;line-height:1.65">Every placement is labeled <strong style="color:#edece8">Advertisement</strong> wherever it appears. A placement is commercial visibility, not an editorial review or endorsement.</p>
  <p style="color:#666970;font-size:12px;line-height:1.6">Questions: ${SITE.emails.contact}. This is a transactional receipt sent from mail.zyvibe.com; it is not a newsletter.</p>
</div>`;
}

export function placementAlertEmail(input: {
  projectName: string;
  projectUrl: string;
  builderName: string;
  email: string;
  placementId: string;
  sessionId: string;
  status: string;
  urlReason: string;
}): string {
  return `<div style="font-family:Inter,Helvetica,Arial,sans-serif">
  <h2>New placement: ${escapeHtml(input.projectName)} (${escapeHtml(input.status)})</h2>
  <ul>
    <li>Placement: ${escapeHtml(input.placementId)}</li>
    <li>Builder: ${escapeHtml(input.builderName)} &lt;${escapeHtml(input.email)}&gt;</li>
    <li>URL: ${escapeHtml(input.projectUrl)}</li>
    <li>URL check: ${escapeHtml(input.urlReason)}</li>
    <li>Stripe session: ${escapeHtml(input.sessionId)}</li>
  </ul>
  <p>Activate or review this placement in the placements record.</p>
</div>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
