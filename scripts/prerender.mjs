import { readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const htmlPath = resolve('dist/index.html');
const serverDir = resolve('dist-server');
const { render, faqJsonLd } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href);

let html = await readFile(htmlPath, 'utf8');
for (const marker of ['<!--app-html-->', '<!--faq-jsonld-->']) {
  if (!html.includes(marker)) throw new Error(`prerender: marker ${marker} missing from dist/index.html`);
}
html = html
  .replace('<!--app-html-->', render())
  .replace('<!--faq-jsonld-->', `<script type="application/ld+json">${faqJsonLd()}</script>`);

await writeFile(htmlPath, html);
await rm(serverDir, { recursive: true, force: true });
console.log('prerender: dist/index.html written');
