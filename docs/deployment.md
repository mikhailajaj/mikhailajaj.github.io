# Deployment Guide — GitHub Pages

This project is configured for **static export** (`output: 'export'`) and
deployed to [mikhailajaj.github.io](https://mikhailajaj.github.io).

---

## How It Works

`pnpm build` writes a fully static site to `/out` — no server required.

```js
// next.config.mjs
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // next/image has no optimiser in static mode
  trailingSlash: true,           // /about/index.html rather than /about.html
};
```

`trailingSlash: true` is why every internal link in the codebase ends in `/`
(`/projects/`, `/projects/pulseshare/`). Keep that convention — a link without
the slash costs a redirect.

---

## `.nojekyll` is required

GitHub Pages runs Jekyll over branch-sourced deploys, and **Jekyll silently
drops any directory beginning with an underscore**. The entire Next.js bundle
lives in `_next/`, so without an opt-out the deployed site loads with no CSS and
no JavaScript.

`public/.nojekyll` exists for exactly this reason and is copied into `/out` on
every build. Don't delete it.

---

## Local Development

```bash
pnpm dev              # dev server on http://localhost:3000
pnpm lint             # ESLint
pnpm build            # static export → /out
npx serve out -p 3002 # preview the exported site
```

To test under a sub-path, set `basePath: '/portfolio-v2'` in `next.config.mjs`,
rebuild, and remember to remove it before deploying to the domain root.

---

## Option A — GitHub Actions (in use)

`.github/workflows/deploy.yml` runs on every push to `main`: install → lint →
build → upload `/out` → deploy via the official Pages actions. Nothing is
committed to a `gh-pages` branch, and `actions/deploy-pages` serves the
artifact directly without a Jekyll pass.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub
Actions**.

---

## Option B — Manual copy

```bash
pnpm build
cp -r out/. /path/to/mikhailajaj.github.io/   # note: out/. copies dotfiles
cd /path/to/mikhailajaj.github.io
git add . && git commit -m "Deploy portfolio v2" && git push origin main
```

Use `out/.` rather than `out/*` — the glob skips `.nojekyll` and you get the
broken-styling failure described above.

---

## Constraints of `output: 'export'`

Not available: Server Actions, Route Handlers (`app/api/`), ISR, Middleware,
`dynamic = 'force-dynamic'`, and the `next/image` optimiser.

This portfolio uses none of them. Two consequences worth remembering:

- **Dynamic routes need `generateStaticParams()`.** `app/projects/[slug]` has
  it; any new dynamic route must too.
- **Metadata routes need `export const dynamic = 'force-static'`.**
  `app/sitemap.ts` and `app/robots.ts` both set it; the build fails without it.

---

## Assets

`public/` is copied verbatim to the site root, so anything placed there is
downloaded by visitors whether or not a page references it. Full-resolution
originals therefore live in `assets-src/` (outside `public/`), and only the
optimised derivatives are committed to `public/`.

To add an optimised screenshot:

```bash
cwebp -q 82 -resize 500 0 assets-src/…/shot.png -o public/…/shot.webp
sips -g pixelWidth -g pixelHeight public/…/shot.webp   # record in the data file
```

---

## Custom Domain

Add `public/CNAME` containing the domain, and point the DNS records at GitHub.
