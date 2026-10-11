export const CONTACT_EMAIL = 'contact@zyvibe.com';
export const SEO_URL = 'https://seo.zyvibe.com/?utm_source=zyvibe_home&utm_medium=';
export const BLOG_URL = 'https://blog.zyvibe.com';

export function startUrl(src: string): string {
  return `/start?src=${encodeURIComponent(src)}`;
}

export function track(eventName: string, parameters: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (command: string, event: string, params: Record<string, string>) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', eventName, parameters);
  }
}

/** Sets the page title and, for private pages, a noindex robots tag. */
export function setPageMeta(title: string, noindex = false) {
  document.title = title;
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (noindex) {
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow';
  } else if (robots) {
    robots.remove();
  }
}
