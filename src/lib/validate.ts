const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^\[?::1\]?$/,
  /\.local$/i,
  /\.internal$/i,
];

export class ValidationError extends Error {}

export function normalisePublicUrl(raw: unknown): string {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new ValidationError("A project URL is required.");
  }
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new ValidationError("That project URL is not a valid absolute URL.");
  }
  if (url.protocol !== "https:") {
    throw new ValidationError("Project URLs must use https.");
  }
  if (url.username || url.password) {
    throw new ValidationError("Project URLs cannot contain credentials.");
  }
  if (PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname))) {
    throw new ValidationError("Project URLs must point at a public host.");
  }
  if (!url.hostname.includes(".")) {
    throw new ValidationError("Project URLs must include a public domain name.");
  }
  url.hash = "";
  return url.toString();
}

export function isEmail(raw: unknown): raw is string {
  return typeof raw === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}

export function cleanText(raw: unknown, max: number): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanLines(raw: unknown, max: number, maxLine: number): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, max)
    .map((line) => line.slice(0, maxLine));
}

export type UrlCheckResult = {
  url: string;
  ok: boolean;
  status: number | null;
  finalUrl: string | null;
  reason: string;
};

export async function checkUrlReachable(target: string): Promise<UrlCheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(target, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "ZyvibePlacementCheck/1.0 (+https://zyvibe.com/methodology)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    const ok = response.status >= 200 && response.status < 400;
    return {
      url: target,
      ok,
      status: response.status,
      finalUrl: response.url || target,
      reason: ok ? "Reachable" : `Responded with HTTP ${response.status}`,
    };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "Timed out after 10 seconds"
        : "Could not be reached";
    return { url: target, ok: false, status: null, finalUrl: null, reason };
  } finally {
    clearTimeout(timer);
  }
}
