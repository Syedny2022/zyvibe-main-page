# Zyvibe Design System

Single source of truth for Zyvibe surfaces. Swiss-minimalist: flat obsidian canvases,
one vermilion signal, square structure, type doing the work.

## Theme model

Dark is the default. The choice persists in `localStorage` under the key `zyvibe:theme`
(values `"dark"` / `"light"`) and is applied as `data-theme` on `<html>` before first paint.

- No stored value → dark. `<html data-theme="dark">` is the initial attribute.
- Light is opt-in: `data-theme="light"` on `<html>`.
- `color-scheme: dark light`, `theme-color: #111214`.

## Tokens

### Dark theme (default)

| Token | Value |
| --- | --- |
| `--bg-canvas` | `#111214` |
| `--bg-elevated` | `#141619` |
| `--bg-card` | `#181a1e` |
| `--bg-row-hover` | `#16181b` |
| `--text-primary` | `#edece8` |
| `--text-secondary` | `#9a9da3` |
| `--text-muted` | `#82858b` |
| `--rule-subtle` | `#2a2d34` |

### Light theme

| Token | Value |
| --- | --- |
| `--bg-canvas` | `#f4f3ee` |
| `--bg-elevated` | `#fbfaf6` |
| `--text-primary` | `#14161a` |
| `--text-secondary` | `#54575e` |
| `--text-muted` | `#6c6e75` |

All light-theme ink tokens must clear WCAG AA (>= 4.5:1) against `--bg-canvas` and
`--bg-elevated`. Small vermilion text uses `--accent-signal-text` (`#e05a47` dark /
`#c2412c` light) so labels stay readable; `--accent-signal` itself is for marks,
rules and fills, never for small body copy on paper.

### Brand accent

| Token | Value |
| --- | --- |
| `--accent-signal` | `#e05a47` |

Vermilion (`Swiss Vermilion`) is the only accent. It is the wordmark colour and the
primary action colour. Do not introduce a second accent, gradient or tinted surface.

## Typography

- `Inter` for UI, navigation and headings.
- `IBM Plex Mono` for slugs, tags, metrics, keyboard hints and domain labels.
- Container width: `1180px`.
- Structural corners: `0px`. No rounded cards, no shadows, no blur.
- Rules and borders use `--rule-subtle`; structural emphasis is a 1px rule, not a fill.

## Brand assets

Official vector wordmark paths only. Do not redraw, re-letter, add icons, add taglines
or attach badges to the mark.

| Asset | Path | ViewBox | Use |
| --- | --- | --- | --- |
| `zyvibe-wordmark.svg` | `/brand/zyvibe-wordmark.svg` | `122 65 476 133` | Header and compact lockups |
| `zyvibe-avatar.svg` | `/brand/zyvibe-avatar.svg` | `0 0 512 512` | Favicon, app icon, `Organization` logo |
| `zyvibe-banner.svg` | `/brand/zyvibe-banner.svg` | `0 0 1500 500` | Wide profile and social banner |

The wordmark renders inside `.brand` at `height: 22px; width: auto; display: block`
with an accessible name of `Zyvibe`. The avatar is vermilion on `#111214`.

## Rules

1. Every surface colour comes from a token. No raw hex in component CSS except the
   accepted green/tint `rgba()` values.
2. One accent. Vermilion is a signal, not a decoration: marks, one CTA, one rule.
3. No motion beyond a `120ms` colour/border transition.
4. Both themes are first-class: no dark-only surface may show through in light mode.
5. Contrast is a build gate, not a preference: AA for body, AA for small labels.
