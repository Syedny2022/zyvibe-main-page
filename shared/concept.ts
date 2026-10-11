/**
 * Shared between the Pages Functions (server) and the React pages (client).
 * Defines the intake fields, the visual directions a concept can use, and the
 * structured concept the AI must return. The concept is always rendered by our
 * own template; the model never produces HTML.
 */

export const SPRINT_PRICE_LABEL = '$2,999';
export const CARE_PLAN_PRICE_LABEL = '$499/month';
export const SPRINT_REVISION_ROUNDS = 2;
export const PREVIEW_TTL_DAYS = 30;

export const PAGE_GOALS = [
  'Get leads and inquiries',
  'Book calls or appointments',
  'Sell a product or service online',
  'Grow an email list',
  'Explain what we do clearly',
] as const;

export interface Palette {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
}

export interface VisualDirection {
  id: string;
  label: string;
  description: string;
  palette: Palette;
}

export const VISUAL_DIRECTIONS: VisualDirection[] = [
  {
    id: 'bold-dark',
    label: 'Bold & dark',
    description: 'High contrast, confident, modern.',
    palette: { bg: '#0b0b12', surface: '#161622', text: '#ffffff', muted: '#a1a1b5', accent: '#f97316', accentText: '#0b0b12', border: 'rgba(255,255,255,0.10)' },
  },
  {
    id: 'clean-minimal',
    label: 'Clean & minimal',
    description: 'Light, airy, lots of white space.',
    palette: { bg: '#ffffff', surface: '#f5f6f8', text: '#111827', muted: '#4b5563', accent: '#2563eb', accentText: '#ffffff', border: 'rgba(17,24,39,0.10)' },
  },
  {
    id: 'warm-friendly',
    label: 'Warm & friendly',
    description: 'Soft tones, approachable, human.',
    palette: { bg: '#fffaf3', surface: '#fdf0de', text: '#3b2a1a', muted: '#7a5c43', accent: '#c2410c', accentText: '#ffffff', border: 'rgba(59,42,26,0.12)' },
  },
  {
    id: 'corporate-trust',
    label: 'Professional & trustworthy',
    description: 'Calm, structured, credible.',
    palette: { bg: '#f8fafc', surface: '#e8eef6', text: '#0f172a', muted: '#475569', accent: '#0f766e', accentText: '#ffffff', border: 'rgba(15,23,42,0.10)' },
  },
];

export function getVisualDirection(id: string): VisualDirection {
  return VISUAL_DIRECTIONS.find((direction) => direction.id === id) ?? VISUAL_DIRECTIONS[0];
}

export interface IntakeInput {
  businessName: string;
  contactName: string;
  email: string;
  websiteUrl: string;
  offer: string;
  audience: string;
  pageGoal: string;
  visualDirection: string;
  referenceSites: string;
  priceConfirmed: boolean;
}

export interface Concept {
  hero: { eyebrow: string; headline: string; subheadline: string; primaryCta: string; secondaryCta: string };
  valueProps: { title: string; body: string }[];
  howItWorks: { title: string; body: string }[];
  offer: { title: string; body: string; bullets: string[] };
  faq: { question: string; answer: string }[];
  finalCta: { headline: string; body: string; button: string };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

function cleanUrl(value: unknown): string | null {
  const raw = cleanText(value, 300);
  if (!raw) return '';
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Validates and normalizes the intake form. Returns field errors keyed by field name. */
export function parseIntake(body: Record<string, unknown>): { input?: IntakeInput; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const businessName = cleanText(body.businessName, 120);
  const contactName = cleanText(body.contactName, 120);
  const email = cleanText(body.email, 200).toLowerCase();
  const websiteUrl = cleanUrl(body.websiteUrl);
  const offer = cleanText(body.offer, 800);
  const audience = cleanText(body.audience, 500);
  const pageGoal = cleanText(body.pageGoal, 80);
  const visualDirection = cleanText(body.visualDirection, 40);
  const referenceSites = cleanText(body.referenceSites, 600);

  if (businessName.length < 2) errors.businessName = 'Enter your business name.';
  if (contactName.length < 2) errors.contactName = 'Enter your name.';
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (websiteUrl === null) errors.websiteUrl = 'Enter a full website address, or leave it empty.';
  if (offer.length < 10) errors.offer = 'Tell us what you sell or offer (at least a sentence).';
  if (audience.length < 5) errors.audience = 'Tell us who it is for.';
  if (!(PAGE_GOALS as readonly string[]).includes(pageGoal)) errors.pageGoal = 'Choose the main goal for the page.';
  if (!VISUAL_DIRECTIONS.some((direction) => direction.id === visualDirection)) errors.visualDirection = 'Choose a visual direction.';
  if (body.priceConfirmed !== true) errors.priceConfirmed = `Confirm you understand the ${SPRINT_PRICE_LABEL} one-time price.`;

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    input: {
      businessName,
      contactName,
      email,
      websiteUrl: websiteUrl ?? '',
      offer,
      audience,
      pageGoal,
      visualDirection,
      referenceSites,
      priceConfirmed: true,
    },
  };
}

/** Phrases a concept must never contain (spec rules: no unlimited, no guarantees, no placeholders, no invented proof). */
const FORBIDDEN: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bunlimited\b/i, reason: 'uses "unlimited"' },
  { pattern: /\bguarantee(d|s)?\b/i, reason: 'makes a guarantee' },
  { pattern: /\b(#1|number one|top of google|first page of google)\b/i, reason: 'promises rankings' },
  { pattern: /\blorem ipsum\b/i, reason: 'contains filler text' },
  { pattern: /\[[^\]]{1,40}\]/, reason: 'contains a bracket placeholder' },
  { pattern: /\btestimonials?\b/i, reason: 'references testimonials that do not exist' },
];

function requireText(value: unknown, path: string, min: number, max: number, errors: string[]): string {
  if (typeof value !== 'string') {
    errors.push(`${path} must be a string`);
    return '';
  }
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length < min) errors.push(`${path} is too short (min ${min} characters)`);
  if (text.length > max) errors.push(`${path} is too long (max ${max} characters)`);
  return text.slice(0, max);
}

function requireItems<T>(value: unknown, path: string, count: [number, number], map: (item: Record<string, unknown>, itemPath: string) => T, errors: string[]): T[] {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return [];
  }
  if (value.length < count[0] || value.length > count[1]) errors.push(`${path} must have ${count[0]}–${count[1]} items`);
  return value.slice(0, count[1]).map((item, index) =>
    map(typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {}, `${path}[${index}]`),
  );
}

function requireStrings(value: unknown, path: string, count: [number, number], min: number, max: number, errors: string[]): string[] {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return [];
  }
  if (value.length < count[0] || value.length > count[1]) errors.push(`${path} must have ${count[0]}–${count[1]} items`);
  return value.slice(0, count[1]).map((item, index) => requireText(item, `${path}[${index}]`, min, max, errors));
}

/** Validates the model's JSON against the concept shape and the content rules. */
export function validateConcept(raw: unknown): { concept?: Concept; errors: string[] } {
  const errors: string[] = [];
  const root = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const hero = typeof root.hero === 'object' && root.hero !== null ? (root.hero as Record<string, unknown>) : {};
  const offer = typeof root.offer === 'object' && root.offer !== null ? (root.offer as Record<string, unknown>) : {};
  const finalCta = typeof root.finalCta === 'object' && root.finalCta !== null ? (root.finalCta as Record<string, unknown>) : {};

  const concept: Concept = {
    hero: {
      eyebrow: requireText(hero.eyebrow, 'hero.eyebrow', 2, 60, errors),
      headline: requireText(hero.headline, 'hero.headline', 8, 90, errors),
      subheadline: requireText(hero.subheadline, 'hero.subheadline', 20, 240, errors),
      primaryCta: requireText(hero.primaryCta, 'hero.primaryCta', 2, 32, errors),
      secondaryCta: requireText(hero.secondaryCta, 'hero.secondaryCta', 2, 32, errors),
    },
    valueProps: requireItems(root.valueProps, 'valueProps', [3, 3], (item, p) => ({
      title: requireText(item.title, `${p}.title`, 2, 60, errors),
      body: requireText(item.body, `${p}.body`, 20, 220, errors),
    }), errors),
    howItWorks: requireItems(root.howItWorks, 'howItWorks', [3, 3], (item, p) => ({
      title: requireText(item.title, `${p}.title`, 2, 60, errors),
      body: requireText(item.body, `${p}.body`, 15, 200, errors),
    }), errors),
    offer: {
      title: requireText(offer.title, 'offer.title', 4, 80, errors),
      body: requireText(offer.body, 'offer.body', 20, 300, errors),
      bullets: requireStrings(offer.bullets, 'offer.bullets', [3, 5], 3, 100, errors),
    },
    faq: requireItems(root.faq, 'faq', [3, 3], (item, p) => ({
      question: requireText(item.question, `${p}.question`, 8, 120, errors),
      answer: requireText(item.answer, `${p}.answer`, 20, 300, errors),
    }), errors),
    finalCta: {
      headline: requireText(finalCta.headline, 'finalCta.headline', 8, 90, errors),
      body: requireText(finalCta.body, 'finalCta.body', 10, 200, errors),
      button: requireText(finalCta.button, 'finalCta.button', 2, 32, errors),
    },
  };

  const allText = JSON.stringify(concept);
  for (const rule of FORBIDDEN) {
    if (rule.pattern.test(allText)) errors.push(`content ${rule.reason}`);
  }

  return errors.length > 0 ? { errors } : { concept, errors };
}
