/**
 * Local-only checks for POST /api/ingest.
 *
 * Usage (start the dev server with the same secret first):
 *   INGEST_SECRET=local-ingest-secret npx next dev -p 3211
 *   node scripts/test-ingest.ts
 *
 * Optional: BASE_URL, INGEST_SECRET. The script removes only the records it
 * staged, so an existing ingestions.json is preserved.
 */
import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3211";
const SECRET = process.env.INGEST_SECRET ?? "local-ingest-secret";
const ENDPOINT = `${BASE_URL}/api/ingest`;

let failures = 0;
const stagedIds: string[] = [];

function check(name: string, condition: boolean, detail?: unknown) {
  if (condition) {
    console.log(`PASS ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`, detail ?? "");
}

async function post(body: unknown, token: string | null) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  return { status: response.status, json };
}

const suffix = Date.now().toString(36);
const valid = {
  title: `Local ingest check ${suffix}`,
  summary:
    "A staged record written by the local ingestion test to confirm validation and review status.",
  goal: "code-and-repo-automation",
  agent: "test-agent",
  harness: "terminal-cli",
  source_url: `https://example.com/ingest-check-${suffix}`,
  prompt_snippet: "Summarize the repository change and list the tests that should run before merge.",
  slug: `test-ingest-${suffix}`,
};

async function cleanup() {
  if (stagedIds.length === 0) return;
  const file = path.join(process.cwd(), "content", "data", "ingestions.json");
  try {
    const rows = JSON.parse(await readFile(file, "utf8")) as { id?: string }[];
    const kept = rows.filter((row) => !row.id || !stagedIds.includes(row.id));
    if (kept.length === 0) await unlink(file);
    else await writeFile(file, `${JSON.stringify(kept, null, 2)}\n`, "utf8");
  } catch {
    // Nothing staged on disk; nothing to clean.
  }
}

async function main() {
  const unauthorized = await post(valid, null);
  check("rejects a request without a bearer token (401)", unauthorized.status === 401, unauthorized);

  const wrongToken = await post(valid, "not-the-secret");
  check("rejects a wrong bearer token (401)", wrongToken.status === 401, wrongToken);

  const missing = await post({ ...valid, summary: "" }, SECRET);
  check("rejects missing summary (400)", missing.status === 400, missing);

  const badUrl = await post({ ...valid, source_url: "http://example.com/not-https" }, SECRET);
  check("rejects a non-https source_url (400)", badUrl.status === 400, badUrl);

  const badHarness = await post({ ...valid, harness: "not-a-harness" }, SECRET);
  check("rejects an unknown harness (400)", badHarness.status === 400, badHarness);

  const created = await post(valid, SECRET);
  check("stages a valid item (202)", created.status === 202, created);
  check(
    "stages as pending_review",
    created.json?.status === "pending_review",
    created.json
  );
  if (typeof created.json?.id === "string") stagedIds.push(created.json.id);

  const duplicateSlug = await post(valid, SECRET);
  check("deduplicates by slug (409)", duplicateSlug.status === 409, duplicateSlug);
  if (typeof duplicateSlug.json?.id === "string") stagedIds.push(duplicateSlug.json.id);

  const duplicateUrl = await post({ ...valid, slug: `test-ingest-other-${suffix}` }, SECRET);
  check("deduplicates by source_url (409)", duplicateUrl.status === 409, duplicateUrl);
  if (typeof duplicateUrl.json?.id === "string") stagedIds.push(duplicateUrl.json.id);

  await cleanup();
}

main()
  .catch((error) => {
    failures += 1;
    console.error("Test run failed:", error instanceof Error ? error.message : error);
    console.error(`Is ${BASE_URL} running with INGEST_SECRET set?`);
  })
  .finally(async () => {
    await cleanup();
    if (failures > 0) {
      console.error(`${failures} ingest check(s) failed.`);
      process.exit(1);
    }
    console.log("All ingest checks passed.");
  });
