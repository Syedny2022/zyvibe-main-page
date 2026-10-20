export type BookingInput = {
  name: string;
  email: string;
  company: string;
  building: string;
  existing: string;
};

export type BookingField = keyof BookingInput;

export const FIELD_LIMITS: Record<BookingField, number> = {
  name: 100,
  email: 254,
  company: 120,
  building: 1000,
  existing: 500,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeBooking(raw: Record<string, unknown>): BookingInput {
  const get = (key: BookingField) =>
    typeof raw[key] === 'string' ? (raw[key] as string).trim().slice(0, FIELD_LIMITS[key]) : '';
  return {
    name: get('name'),
    email: get('email').toLowerCase(),
    company: get('company'),
    building: get('building'),
    existing: get('existing'),
  };
}

export function validateBooking(input: BookingInput): Partial<Record<BookingField, string>> {
  const errors: Partial<Record<BookingField, string>> = {};
  if (input.name.length < 2) errors.name = 'Enter your name.';
  if (!EMAIL_RE.test(input.email)) errors.email = 'Enter a valid email address, like you@company.com.';
  if (input.company.length < 2) errors.company = 'Enter your company or brand name.';
  if (input.building.length < 10) errors.building = 'Tell us a little more, at least a short sentence.';
  if (input.existing.length < 2) errors.existing = 'Add your current website or project link, or write "none yet".';
  return errors;
}
