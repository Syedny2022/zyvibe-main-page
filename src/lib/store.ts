import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "content", "data");

async function readArray<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeArray<T>(file: string, rows: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2) + "\n", "utf8");
}

export async function readRecords<T>(file: string): Promise<T[]> {
  return readArray<T>(file);
}

export async function appendRecord<T>(file: string, record: T): Promise<void> {
  const rows = await readArray<T>(file);
  rows.push(record);
  await writeArray(file, rows);
}

export type Subscriber = {
  email: string;
  sourceDomain: string;
  sourcePath: string;
  consentText: string;
  createdAt: string;
  verified: boolean;
};

export type Submission = {
  id: string;
  title: string;
  sourceUrl: string;
  goal: string;
  agentName: string;
  harness: string;
  evidence: string;
  summary: string;
  steps: string[];
  configSnippet: string;
  limitations: string;
  contactEmail: string;
  status: "pending_review";
  createdAt: string;
};

export type PlacementRecord = {
  id: string;
  placement: string;
  projectName: string;
  projectUrl: string;
  builderName: string;
  email: string;
  stripeSessionId: string | null;
  amountTotal: number | null;
  currency: string | null;
  status: "active" | "needs_review";
  urlCheck: { ok: boolean; status: number | null; finalUrl: string | null; reason: string } | null;
  activatedAt: string | null;
  createdAt: string;
};

export async function findSubscriber(email: string): Promise<Subscriber | undefined> {
  const rows = await readArray<Subscriber>("subscribers.json");
  return rows.find((row) => row.email.toLowerCase() === email.toLowerCase());
}

/**
 * Idempotency guard for Stripe webhook events.
 * Returns false when the event id has already been processed.
 */
export async function markEventProcessed(eventId: string): Promise<boolean> {
  const rows = await readArray<{ id: string; at: string }>("stripe-events.json");
  if (rows.some((row) => row.id === eventId)) return false;
  rows.push({ id: eventId, at: new Date().toISOString() });
  await writeArray("stripe-events.json", rows.slice(-500));
  return true;
}
