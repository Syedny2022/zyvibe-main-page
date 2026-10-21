import { useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { CTA_LABEL } from '../content/site';
import { FIELD_LIMITS, normalizeBooking, validateBooking, type BookingField, type BookingInput } from '../lib/booking';
import { track } from '../lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY: BookingInput = { name: '', email: '', company: '', building: '', existing: '' };

const FIELDS: { key: BookingField; label: string; type?: string; autoComplete?: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'name', label: 'Name', autoComplete: 'name', placeholder: 'Jane Smith' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'jane@company.com' },
  { key: 'company', label: 'Company', autoComplete: 'organization', placeholder: 'Acme Studio' },
  { key: 'building', label: 'What are you building?', placeholder: 'A launch page for our new booking app, aimed at independent salons.', multiline: true },
  { key: 'existing', label: 'Existing website or projects', placeholder: 'acme.com, or "none yet"' },
];

export default function BookingForm() {
  const [values, setValues] = useState<BookingInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<BookingField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (key: BookingField, value: string) => {
    if (!startedAt.current) startedAt.current = Date.now();
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors(validateBooking(normalizeBooking(next)));
  };

  const blur = (key: BookingField) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateBooking(normalizeBooking(values)));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = normalizeBooking(values);
    const found = validateBooking(input);
    setTouched({ name: true, email: true, company: true, building: true, existing: true });
    setErrors(found);
    const firstInvalid = FIELDS.find((f) => found[f.key]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#book-${firstInvalid.key}`)?.focus();
      return;
    }

    const honeypot = (formRef.current?.elements.namedItem('website_url') as HTMLInputElement | null)?.value ?? '';
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, website_url: honeypot, elapsed_ms: startedAt.current ? Date.now() - startedAt.current : 0 }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string; fields?: Partial<Record<BookingField, string>> };
      if (res.ok && data.success) {
        setStatus('success');
        track('generate_lead', { method: 'book_spot_form' });
        return;
      }
      if (data.fields) setErrors(data.fields);
      setMessage(data.error ?? 'We could not save your booking. Please try again in a moment.');
      setStatus('error');
    } catch {
      setMessage('Your connection dropped before we received the form. Check your internet and send it again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl border border-line-strong bg-navy-950/85 p-10">
        <CheckCircle2 className="h-9 w-9 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="text-xl font-semibold">Your spot is booked.</h3>
        <p className="max-w-md leading-relaxed">
          Thanks, {values.name.trim().split(' ')[0]}. A confirmation is on its way to {values.email.trim()}. Within 24 hours you will receive a link to your sample site.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative grid gap-7 rounded-2xl border border-line-strong bg-navy-950/85 p-7 shadow-2xl shadow-black/40 backdrop-blur md:p-10" aria-describedby="book-status">
      <div className="flex items-center justify-between border-b border-line pb-5">
        <p className="label">Project brief</p>
        <p className="font-mono text-[11px] text-muted">5 questions · 2 min</p>
      </div>
      {FIELDS.map((f) => {
        const id = `book-${f.key}`;
        const err = touched[f.key] ? errors[f.key] : undefined;
        const common = {
          id,
          name: f.key,
          value: values[f.key],
          placeholder: f.placeholder,
          maxLength: FIELD_LIMITS[f.key],
          required: true,
          'aria-invalid': err ? true : undefined,
          'aria-describedby': err ? `${id}-error` : undefined,
          disabled: status === 'submitting',
          onBlur: () => blur(f.key),
          className: 'field',
        };
        return (
          <div key={f.key} className="grid gap-1">
            <label htmlFor={id} className="text-sm font-semibold text-white">{f.label}</label>
            {f.multiline ? (
              <textarea {...common} rows={3} onChange={(e) => update(f.key, e.target.value)} />
            ) : (
              <input {...common} type={f.type ?? 'text'} autoComplete={f.autoComplete} onChange={(e) => update(f.key, e.target.value)} />
            )}
            {err && <p id={`${id}-error`} className="text-sm text-danger">{err}</p>}
          </div>
        );
      })}

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website_url">Leave this field empty</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <button type="submit" className="btn-primary mt-2 w-full py-4" disabled={status === 'submitting'}>
        {status === 'submitting' ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Booking your spot…</>) : CTA_LABEL}
      </button>

      <p id="book-status" role="status" aria-live="polite" className={status === 'error' ? 'text-sm text-danger' : 'sr-only'}>
        {status === 'error' ? message : status === 'submitting' ? 'Sending your booking.' : ''}
      </p>
      <p className="text-xs text-muted">Free. No payment details. We only use your details to send your sample site.</p>
    </form>
  );
}
