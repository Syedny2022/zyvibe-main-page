# Kanton Dark Swiss Minimalist — Design System & Implementation Spec (`DESIGN.md`)

## 1. Visual Tone & Atmosphere

The **Kanton Dark Swiss Minimalist** design system adapts 1950s International Typographic Style (Swiss Style) for low-glare nocturnal reading across high-density developer tools, ecosystem directories, and operational dashboards.

### Design Principles
1. **Grid over Decoration:** No rounded containers, drop shadows, gradient cards, or decorative borders. Structure comes strictly from asymmetrical 12-column baseline alignment and hairline rules.
2. **Typography as Structure:** Hierarchical contrast is established through extreme scale jumps (fluid clamps), tracking adjustments, and font family pairing (Neo-Grotesque Sans vs. Tabular Monospace) rather than background shapes.
3. **Low-Glare Obsidian Canvas:** Warm obsidian canvas (`#111214`) prevents eye fatigue while preserving absolute contrast compliance with soft alabaster text (`#edece8`).
4. **Signal Accent Discipline:** Vermilion (`#e05a47`) is reserved exclusively for index counters, primary hover states, brand square, and structural focus. Pulsing emerald green (`#22c55e`) is restricted to live status indicators and evidence verification dots.

---

## 2. Color Palette & Token Definitions

```css
:root {
  /* Surface Tokens */
  --bg-canvas: #111214;        /* Warm obsidian canvas ground */
  --bg-row-hover: #16181b;     /* High-contrast row hover state */
  --bg-elevated: #141619;      /* Input and form container surface */
  --bg-header: rgba(17, 18, 20, 0.92); /* Sticky header backdrop with blur */

  /* Typography Tokens */
  --text-primary: #edece8;      /* Soft alabaster off-white */
  --text-secondary: #9a9da3;    /* Neutral cool gray */
  --text-muted: #666970;        /* Tabular metadata and coordinates */

  /* Signal Accents */
  --accent-signal: #e05a47;     /* Vermilion (Index markers, active tabs) */
  --accent-green: #22c55e;      /* Live dot marquee & verification status */
  --accent-amber: #d99b38;      /* Audit & rechecking warning status */

  /* Structural Hairline Rules */
  --rule-subtle: rgba(237, 236, 232, 0.11);
  --rule-strong: rgba(237, 236, 232, 0.24);

  /* Font Stacks */
  --font-sans: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Layout Constants */
  --container-max: 1180px;
  --gutter: clamp(1.5rem, 5vw, 3.5rem);
  --header-height: 4.5rem;
}
```

---

## 3. Typography & Hierarchy Scale

### Typeface Roles
* **Display & Body Sans (`Inter`):** Headlines, hero leads, row titles, digest copy, and modal headers.
* **Monospace (`IBM Plex Mono`):** Section indices (`01–05`), property tags (`zyvibe.com`), status dots, timestamps, sitemap tags, metadata labels, and raw spec definitions.

### Type Scale & Metrics

| Element | Font Family | Size / Clamp | Weight | Letter Spacing | Line Height |
|---|---|---|---|---|---|
| **Hero Headline** | `--font-sans` | `clamp(2.5rem, 6.2vw, 5.15rem)` | 600 | `-0.038em` | `1.04` |
| **Section Header** | `--font-sans` | `clamp(1.25rem, 2vw, 1.5rem)` | 500 | `-0.02em` | `1.2` |
| **Row Title** | `--font-sans` | `clamp(1.125rem, 1.5vw, 1.3rem)` | 500 | `-0.02em` | `1.3` |
| **Body Lead** | `--font-sans` | `clamp(1.05rem, 1.4vw, 1.22rem)` | 400 | Normal | `1.6` |
| **Body Standard** | `--font-sans` | `0.92rem–0.95rem` | 400 | Normal | `1.65` |
| **Monospace Caps** | `--font-mono` | `0.75rem–0.78rem` | 500 | `+0.06em–0.08em` | `1.4` |
| **Badges & Labels**| `--font-mono` | `0.68rem–0.72rem` | 500 | `+0.05em` | `1.0` |

---

## 4. Layout Architecture & 12-Column Grid

### Outer Container
* **Max Width:** `1180px` centered via `margin-inline: auto`.
* **Responsive Gutter:** `clamp(1.5rem, 5vw, 3.5rem)` on left and right edges.

### 12-Column Grid Definition
```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: clamp(1rem, 2.2vw, 1.75rem);
}
```

### Column Layout Allocations

#### Hero Block Alignment
* Eyebrow Split: Left Label (`1 / 5`), Right Label (`5 / 13`)
* Hero Headline: Full Span (`1 / 13`)
* Subgrid Split: System Specs/Caption (`1 / 5`), Lead Paragraph & CTAs (`5 / 12`)

#### Feature / Directory Row Alignment (12-Column Tracks)
```text
┌───────┬───────────────────────────┬─────────────────────────────────┬─────────────┐
│ 1 / 2 │          2 / 6            │             6 / 11              │   11 / 13   │
├───────┼───────────────────────────┼─────────────────────────────────┼─────────────┤
│ Index │ Title & Domain Label      │ Description & Direct Action     │ Evidence /  │
│ [01]  │ zyvibe.com                │ Use Case / Guide / Specialist   │ Tag [RIGHT] │
└───────┴───────────────────────────┴─────────────────────────────────┴─────────────┘
```

#### Specification Strip Alignment (3-Column Block)
* Columns split equally into 3 grid items separated by `--rule-subtle` borders or grid gap `clamp(2rem, 4vw, 3.5rem)`.

---

## 5. Right-to-Left Marquee & Animations

### Specifications
* **Direction:** Continuous Right-to-Left (`transform: translate3d(-50%, 0, 0)`).
* **Speed:** 34 to 38 seconds linear loop.
* **Pause Behavior:** Pauses on hover (`:hover .marquee-track { animation-play-state: paused; }`).
* **Separator Dot:** 6px green circular dot (`#22c55e`) with pulsing glow.

### CSS Keyframes
```css
@keyframes marquee-rtl {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

@keyframes blink-green {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.65);
  }
  50% {
    opacity: 0.18;
    transform: scale(0.78);
    box-shadow: 0 0 0 transparent;
  }
}
```

---

## 6. Zyvibe Ecosystem Integration Rules

### 1. The Four Pillar Domains
1. **`zyvibe.com` (Pillar A):** Searchable AI-agent use case directory. Monetized via Builder Showcase & contextual ads.
2. **`blog.zyvibe.com` (Pillar B):** Practical guides & Search Console walkthroughs. Monetized via article ads & Zyvibe Digest sponsorship.
3. **`seo.zyvibe.com` (Pillar C):** Strictly remote solo developers & solo agencies index. Monetized via provider advertising.
4. **`zyvibe.me` (Pillar D):** Syed Moh’s credibility site & digital blueprint catalog. Monetized via digital products.

### 2. Evidence Label Standards
* **`Reported`:** External source claims workflow/result.
* **`Documented`:** Step-by-step requirements and code available.
* **`Reproduced by Zyvibe`:** Tested and verified live by Zyvibe (`#22c55e`).
* **`Needs Rechecking`:** Dependency or API output may be outdated (`#d99b38`).
* **`Profile Ownership Checked`:** Narrow ownership signal verified.
* **`Advertisement`:** Paid commercial placement (`#e05a47`).

### 3. FTC Disclosure Rules
* Place `Advertisement` label directly beside paid items on mobile and desktop.
* Never present paid placements as independent editorial verification or founder endorsements.

---

## 7. Responsive Breakpoint Rules

### Breakpoint `<= 960px` (Tablet & Compact Layouts)
* Header transitions to 2-column layout (`Brand` left, `Nav` right; meta hidden).
* Hero subgrid stacks vertically (`1 / -1`).
* Feature rows shift from 12-column grid to a 2-column track (`3.25rem 1fr`).
* Specification strip collapses from 3 columns to 1 column.

### Breakpoint `<= 560px` (Mobile Small)
* Nav link gap shrinks to `1.25rem` at `0.8rem` font size.
* Marquee separator dot margins contract to `1.25rem`.
* Form elements and action buttons expand to 100% width.
```

I have compiled the complete `DESIGN.md` specification detailing the visual tone, exact CSS color tokens, fluid typography scales, 12-column layout grids, right-to-left marquee animation rules, responsive breakpoints, and Zyvibe ecosystem evidence standards.

### Summary of What Was Built
1. **`DESIGN.md` Document:** Cleanly formatted markdown file containing design tokens, grid geometry, marquee CSS keyframes, and FTC disclosure guidelines.
2. **Implementation Guidance:** Ready for commit or upload into your project repository or Blogger reference notes.

Would you like to customize any specific token values, add additional responsive rules, or generate the corresponding template assets for your workspace?