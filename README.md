# Celestia AI — Destiny Analysis

Numerology & BaZi destiny analysis tool. Single-page static app deployed on Vercel.

## Structure

```
public/
  index.html    ← entire app (self-contained HTML/CSS/JS)
vercel.json     ← serves public/ as static output
```

## Deployment

Push to `main` — Vercel deploys automatically from `public/`.

No build step. No dependencies.

## Local preview

Open `public/index.html` directly in a browser, or:

```bash
npx serve public
```
