type Gtag = (command: 'event', event: string, params: Record<string, string>) => void;

export function track(event: string, params: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === 'function') gtag('event', event, params);
}
