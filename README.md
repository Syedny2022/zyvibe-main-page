# Agent Use Cases Directory

A clean, fast, zero-database directory of real things people are actually accomplishing with AI agents. Built with Next.js (App Router), Tailwind CSS, and zero backend maintenance.

## Architecture

- **Zero-Database Content:** Every use case is stored as an individual JSON file in `/content/use-cases/`.
- **Automatic Propagation:** Adding or updating a file automatically updates the homepage, `/new` changelog, `/sitemap.xml`, and `/rss.xml`.
- **Autonomous Curation:** Read [`CLAUDE_ROUTINE.md`](./CLAUDE_ROUTINE.md) for the complete handoff instructions for Anthropic Claude's scheduled cloud tasks.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
