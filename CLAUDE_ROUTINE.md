# CLAUDE_ROUTINE.md: Autonomous Nightly Curation Routine
**Target:** Anthropic Claude Scheduled Cloud Tasks / CI Automation  
**Repository Architecture:** File-Based, Zero-Database, Zero-VPS Static Directory  

---

## 1. System Overview & The Zero-Maintenance Architecture

This repository is designed to be updated autonomously by an AI agent every night without requiring a database, VPS, or manual backend maintenance:

* **Single Source of Truth:** Every use case is stored as a standalone JSON file inside `/content/use-cases/`.
* **Instant Auto-Propagation:** When you commit a new JSON file to `/content/use-cases/`, the entire site automatically updates:
  - The **Homepage** includes the new workflow and updates the category & tool count chips.
  - The **"Discovered Today"** shelf highlights items marked `"discoveredToday": true`.
  - The **Daily Changelog** (`/new`) appends the workflow to today's timeline.
  - **`/sitemap.xml`** and **`/rss.xml`** dynamically add the new canonical URL and feed entry.
* **No Broken States:** If an invalid file is dropped, the build fails before deploying, protecting the live site from broken items.

---

## 2. Target File Location & Naming Conventions

### File Destination
```
/content/use-cases/
```

### File Naming Standard
```
[action-verb]-[core-subject]-[desired-outcome].json
```
* **Rules:** Strictly lowercase, hyphen-separated (kebab-case), descriptive, maximum 60 characters.
* **Good Examples:**
  - `auto-match-invoices-to-bank-statements.json`
  - `screen-resumes-and-draft-custom-interview-questions.json`
  - `summarize-40-page-vendor-contracts-into-risk-briefs.json`
* **Bad Examples:**
  - `use-case-1.json` (uninformative)
  - `claude_code_accounting.json` (wrong casing)
  - `how-to-make-money-fast.json` (hype/clickbait)

---

## 3. Strict JSON Schema & Field Specifications

Every new entry created in `/content/use-cases/` must conform to this schema:

```json
{
  "slug": "auto-match-invoices-to-bank-statements",
  "title": "Clear, Specific Action-Oriented Title (Max 70 chars)",
  "oneLiner": "1-sentence summary describing the problem and specific tangible outcome.",
  "date": "YYYY-MM-DD",
  "discoveredToday": true,
  "category": "Category Name (from approved master list)",
  "categorySlug": "category-slug",
  "role": "Target audience (e.g. Operations, Marketers, Solo Founders)",
  "tool": "Official Tool Name (e.g. Claude Code, ChatGPT, Gemini, Codex)",
  "toolSlug": "tool-slug",
  "difficulty": "Estimated setup time (e.g. 3 mins, 5 mins)",
  "problem": "2-3 sentences explaining the painful, manual bottleneck before AI.",
  "workflow": [
    "Step 1: Exact initial setup or folder structure.",
    "Step 2: How files or data were provided to the agent.",
    "Step 3: What the agent outputted and how it was reviewed."
  ],
  "prompt": "The exact, turnkey prompt template with [BRACKETED_PLACEHOLDERS].",
  "promptPlaceholders": [
    "[BRACKETED_PLACEHOLDER_1]",
    "[BRACKETED_PLACEHOLDER_2]"
  ],
  "realityCheck": {
    "firstTryMistake": "What the AI got wrong or missed on the initial run.",
    "manualCleanupTime": "Exact human review time required (e.g. 2 minutes).",
    "limitations": "Real tool limits, rate caps, or warnings."
  },
  "source": {
    "platform": "Platform name (Reddit / Hacker News / X / GitHub)",
    "author": "Public author handle or username",
    "url": "https://direct-live-link-to-original-post.com",
    "verifiedDate": "YYYY-MM-DD"
  },
  "accountsCount": 3,
  "votes": 15
}
```

---

## 4. The "No Rough Edges" Quality Rules

Before committing any file, Claude must verify that the entry satisfies these 4 non-negotiable standards:

1. **The Practical Test:** The entry must document a real business or everyday chore. Generic ideas (like "write poetry" or "give me advice") must be rejected.
2. **The Source Integrity Rule:** The `source.url` must be a direct, working link to the original discussion or demonstration. Never link to generic homepages or profile roots.
3. **The Reality Check Requirement:** The `realityCheck` block must document actual friction, initial mistakes, and cleanup time. Entries that claim "100% effortless perfection" are considered fake and rejected.
4. **Clean Tagging Rule:** Use only approved categories:
   - `Money & Finance` (`money`)
   - `Hiring & HR` (`hiring`)
   - `Legal & Contracts` (`legal`)
   - `Customer Support` (`support`)
   - `Marketing & SEO` (`marketing`)
   - `Software & DevOps` (`software`)
   - `Life Admin & Operations` (`operations`)

---

## 5. Pre-Publish 7-Point Gatekeeper Checklist

Run this checklist internally for every candidate item:

- [ ] **1. Real Problem:** Explains a concrete, painful bottleneck.
- [ ] **2. Full Recipe:** The prompt is complete, runnable, and has clear bracketed placeholders.
- [ ] **3. Live Source:** Verified primary URL from a real community discussion.
- [ ] **4. Replicable:** A human can follow the steps in under 10 minutes and get results.
- [ ] **5. Reality Check:** Truthfully lists first-try errors and human review requirements.
- [ ] **6. Strict JSON:** Valid JSON syntax matching the schema with zero missing fields.
- [ ] **7. Everyday English:** No empty buzzwords (*"game-changing," "revolutionary"*).

---

## 6. Nightly Execution Routine for Claude

### Step 1: Scan & Scout (03:00 UTC)
- Search community feeds (Reddit `/r/ClaudeAI`, `/r/ChatGPT`, Hacker News, X, GitHub) for posts with demonstrated workflows and prompts.
- Select the **top 3 to 5 highest-signal workflows**.

### Step 2: Format & Validate (03:30 UTC)
- Convert each candidate into a clean `.json` file inside `/content/use-cases/`.
- Ensure all older files have `"discoveredToday": false` while new additions have `"discoveredToday": true`.

### Step 3: Local Compile Verification (03:45 UTC)
Run the local compilation check:
```bash
npm run build
```
* **Pass:** If build exits with code `0`, proceed.
* **Fail:** If build errors occur, inspect the malformed JSON, fix syntax, and re-test.

### Step 4: Commit & Push (04:00 UTC)
Commit with a standardized message:
```bash
git add content/use-cases/
git commit -m "chore(curation): add 3 verified use cases for $(date +'%Y-%m-%d')"
git push origin main
```
*Vercel or Cloudflare Pages will automatically detect the commit, run static compilation, and publish the updated site with zero human intervention.*
