import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { faqs } from './content/site';

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export function faqJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }).replace(/</g, '\\u003c');
}
