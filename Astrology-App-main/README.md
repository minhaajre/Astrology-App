# Astro Synthesis

Cross-system astrology chart synthesizer. Paste data from **Tropical** (Western), **Vedic** (Jyotish), and **Chinese Bazi** (Four Pillars) sources — the app parses them client-side and produces a unified synthesis table mapping shared life themes across all three systems.

No backend. No API calls. Everything runs in the browser.

---

## What it does

1. **Paste or drop chart data** — accepts plain text, images, or PDFs into three panels (Tropical / Vedic / Bazi). You can fill one, two, or all three.
2. **Parses automatically** — the parser normalizes planet names, signs, degrees, houses, and retrograde status across formats and naming conventions (English and Sanskrit).
3. **Synthesizes** — maps planetary placements to universal life themes (Identity, Mind, Love, Career, etc.) and shows what each system says about the same theme side by side.

---

## Supported input formats

### Tropical (Western)
- `Sun in Aries 15°32', in 4th House` — standard AstroSeek / free-text
- `Planet Deg°Min' Sign (House N)` — degree-first format
- `Planet: Sign Deg°` — compact
- `Sign Planet` — reversed
- ASC / MC abbreviations and astrological symbols (☉ ☽ ♂ etc.)

### Vedic (Jyotish)
- `Planet in Sign [Deg°] [Nakshatra [Pada N]] [House N]` — free-text
- AstroSage KP planetary positions table (DDD-MM-SS degrees, columnar)
- Sanskrit names auto-normalized: Surya → Sun, Chandra → Moon, Mangal → Mars, Guru → Jupiter, Shani → Saturn, Rahu → North Node, Ketu → South Node, etc.

### Chinese Bazi (Four Pillars)
- `Year/Month/Day/Hour Pillar: Stem Branch (Element Animal)` — inline
- Columnar table: `Year | Month | Day | Hour` header rows

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | wouter |
| State | React Query (TanStack) |
| Parsing | Custom client-side parser (`client/src/lib/astroParser.ts`) |
| Deploy | Vercel (static, no server) |

---

## Project structure

```
client/
  index.html
  main.tsx
  public/
    favicon.png
  src/
    App.tsx
    index.css
    components/        # UI components (shadcn/ui + custom)
    lib/
      astroParser.ts   # Core parser + synthesizer — all chart logic lives here
      theme.tsx        # Dark/light mode
      utils.ts
    pages/
      Home.tsx         # Main paste + synthesis UI
      Admin.tsx
      not-found.tsx
package.json
vite.config.ts
tailwind.config.ts
tsconfig.json
vercel.json
```

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Deploy

Configured for Vercel. Push to `main` — Vercel builds with `vite build` and serves `dist/public`.

```bash
npm run build      # outputs to dist/public
```

---

## Parser notes

The parser (`astroParser.ts`) works in two passes:

1. **`preprocessText()`** — expands astrological symbols and aliases before any regex runs, so downstream patterns don't need to handle every variant.
2. **Per-line extraction** — sign, degree, house, and retrograde are captured independently (not as one sequential regex), so missing fields don't break the whole line.

Key bugs fixed in April 2026:
- `in 4th House` format (old regex expected `House N` ordering)
- Retrograde entries dropping house numbers (reversed field order)
- Vedic complex pattern failing when degree was absent
- ASC / MC / astrological symbols not recognized
