import fs from 'fs';
import path from 'path';
import { UseCase, BuilderShowcase, SoloService, Subscriber } from './types';

const contentDir = path.join(process.cwd(), 'content');
const useCasesDir = path.join(contentDir, 'use-cases');
const showcaseDir = path.join(contentDir, 'builder-showcase');
const soloServicesDir = path.join(contentDir, 'solo-services');
const dataDir = path.join(contentDir, 'data');
const subscribersFile = path.join(dataDir, 'subscribers.json');
const processedEventsFile = path.join(dataDir, 'processed-events.json');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ---------------- USE CASES ---------------- //
export function getAllUseCases(): UseCase[] {
  ensureDir(useCasesDir);
  const files = fs.readdirSync(useCasesDir).filter(f => f.endsWith('.json'));
  const items: UseCase[] = files.map(file => {
    const raw = fs.readFileSync(path.join(useCasesDir, file), 'utf8');
    const parsed = JSON.parse(raw) as UseCase;
    return {
      ...parsed,
      slug: parsed.slug || file.replace(/\.json$/, ''),
    };
  });
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getUseCasesToday(): UseCase[] {
  return getAllUseCases().filter(i => i.discoveredToday);
}

export function getUseCaseBySlug(slug: string): UseCase | null {
  return getAllUseCases().find(i => i.slug === slug) || null;
}

// ---------------- BUILDER SHOWCASE ---------------- //
export function getAllBuilderShowcases(): BuilderShowcase[] {
  ensureDir(showcaseDir);
  const files = fs.readdirSync(showcaseDir).filter(f => f.endsWith('.json'));
  const items: BuilderShowcase[] = files.map(file => {
    const raw = fs.readFileSync(path.join(showcaseDir, file), 'utf8');
    const parsed = JSON.parse(raw) as BuilderShowcase;
    return {
      ...parsed,
      slug: parsed.slug || file.replace(/\.json$/, ''),
    };
  });
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBuilderShowcaseBySlug(slug: string): BuilderShowcase | null {
  return getAllBuilderShowcases().find(i => i.slug === slug) || null;
}

// ---------------- SOLO SERVICES (Remote Solo Developers & Solo Agencies Only) ---------------- //
export function getAllSoloServices(): SoloService[] {
  ensureDir(soloServicesDir);
  const files = fs.readdirSync(soloServicesDir).filter(f => f.endsWith('.json'));
  const items: SoloService[] = files.map(file => {
    const raw = fs.readFileSync(path.join(soloServicesDir, file), 'utf8');
    const parsed = JSON.parse(raw) as SoloService;
    return {
      ...parsed,
      slug: parsed.slug || file.replace(/\.json$/, ''),
    };
  });
  return items
    .filter(i => i.active)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getSoloServiceBySlug(slug: string): SoloService | null {
  return getAllSoloServices().find(i => i.slug === slug) || null;
}

// ---------------- SUBSCRIBERS ---------------- //
export function getAllSubscribers(): Subscriber[] {
  ensureDir(dataDir);
  if (!fs.existsSync(subscribersFile)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(subscribersFile, 'utf8');
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

export function saveSubscriber(email: string, source: string = 'website'): { success: boolean; message: string; alreadyExists?: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Invalid email address' };
  }

  ensureDir(dataDir);
  const current = getAllSubscribers();
  const exists = current.find(s => s.email.toLowerCase() === cleanEmail);

  if (exists) {
    return { success: true, message: 'Already subscribed', alreadyExists: true };
  }

  const newSub: Subscriber = {
    email: cleanEmail,
    source,
    createdAt: new Date().toISOString(),
    verified: false,
  };

  current.push(newSub);
  fs.writeFileSync(subscribersFile, JSON.stringify(current, null, 2), 'utf8');
  return { success: true, message: 'Subscribed successfully' };
}

// ---------------- IDEMPOTENT STRIPE WEBHOOK EVENT TRACKING ---------------- //
export function isEventProcessed(eventId: string): boolean {
  ensureDir(dataDir);
  if (!fs.existsSync(processedEventsFile)) {
    return false;
  }
  try {
    const raw = fs.readFileSync(processedEventsFile, 'utf8');
    const events = JSON.parse(raw) as string[];
    return events.includes(eventId);
  } catch {
    return false;
  }
}

export function markEventProcessed(eventId: string): void {
  ensureDir(dataDir);
  let events: string[] = [];
  if (fs.existsSync(processedEventsFile)) {
    try {
      events = JSON.parse(fs.readFileSync(processedEventsFile, 'utf8'));
    } catch {
      events = [];
    }
  }
  if (!events.includes(eventId)) {
    events.push(eventId);
    fs.writeFileSync(processedEventsFile, JSON.stringify(events, null, 2), 'utf8');
  }
}

export function activatePromotedListing(record: Partial<BuilderShowcase | SoloService>, type: 'showcase' | 'solo_service'): string {
  const slug = record.slug || (record.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const targetDir = type === 'showcase' ? showcaseDir : soloServicesDir;
  ensureDir(targetDir);

  const filePath = path.join(targetDir, `${slug}.json`);
  const fullRecord = {
    ...record,
    slug,
    active: true,
    verified: true,
    createdAt: record.createdAt || new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(fullRecord, null, 2), 'utf8');
  return slug;
}
