const VOTED_KEY = "zyvibe_upvoted_ids";
const SAVED_KEY = "zyvibe_saved_ids";

// Older builds used namespaced keys. Read them once so existing toggles survive.
const LEGACY_VOTED_KEY = "zyvibe:voted:v1";
const LEGACY_SAVED_KEY = "zyvibe:saved:v1";

export const ENGAGEMENT_EVENT = "zyvibe:engagement";

function readList(key: string, legacyKey?: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null && legacyKey) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy !== null) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem(legacyKey);
        return parseList(legacy);
      }
    }
    return parseList(raw);
  } catch {
    return [];
  }
}

function parseList(raw: string | null): string[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeList(key: string, values: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Storage can be disabled; the UI still reflects the in-memory toggle.
  }
}

function emit() {
  window.dispatchEvent(new Event(ENGAGEMENT_EVENT));
}

export function readVoted(): string[] {
  return readList(VOTED_KEY, LEGACY_VOTED_KEY);
}

export function readSaved(): string[] {
  return readList(SAVED_KEY, LEGACY_SAVED_KEY);
}

export function isVoted(slug: string): boolean {
  return readVoted().includes(slug);
}

export function isSaved(slug: string): boolean {
  return readSaved().includes(slug);
}

/**
 * Toggles the browser's upvote. The vote lives only in localStorage under
 * zyvibe_upvoted_ids, so a reload, a second view of the same record, or a
 * filter change shows +1 once and -1 once; there is no server counter that
 * could count the same visitor a second time.
 */
export function toggleVote(slug: string): boolean {
  const voted = readVoted();
  const isOn = voted.includes(slug);
  writeList(VOTED_KEY, isOn ? voted.filter((item) => item !== slug) : [...voted, slug]);
  emit();
  return !isOn;
}

export function toggleSave(slug: string): boolean {
  const saved = readSaved();
  const isOn = saved.includes(slug);
  writeList(SAVED_KEY, isOn ? saved.filter((item) => item !== slug) : [...saved, slug]);
  emit();
  return !isOn;
}

/** True when the record was added within the last seven days. */
export function isNewThisWeek(addedOn: string): boolean {
  const added = new Date(`${addedOn}T00:00:00Z`).getTime();
  if (Number.isNaN(added)) return false;
  return Date.now() - added <= 7 * 86_400_000;
}
