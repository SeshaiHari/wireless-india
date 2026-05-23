# Wireless India

Showcase website for **Wireless India**, an electronics shop in Theni (sound bars,
Bluetooth speakers, multimeters, ICs, cables, pendrives, power strips, tools…).

It's a **catalog + enquiry** site, not a store: every "buy" action is a WhatsApp
or phone enquiry. Cart/checkout is intentionally parked for later.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** for design tokens + CSS Modules per page for layout
- **Sanity** (headless CMS) for the catalog, with an embedded Studio at `/studio`
- Deployable to **Vercel**

## How the data works

All content lives behind one facade — `lib/catalog.ts`. Pages only call
`getProducts()`, `getCategories()`, `getProduct(slug)`, etc.

- **With Sanity configured** (env vars set) → reads from the CMS.
- **Without Sanity** → falls back to the local seed in `lib/data/seed.ts`, so the
  site runs end-to-end out of the box (product images live in `public/products/`).

This seam is what makes "park & pick later" real: swapping the source — or adding
ecommerce reads later — is a one-file change.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000  (runs on the seed catalog)
```

```bash
npm run build && npm start   # production build
npm run lint                 # eslint
```

## Connect Sanity (the editable backend)

1. Create a free project at <https://sanity.io/manage> → note the **Project ID**
   and create a dataset called `production`.
2. Copy `.env.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `SANITY_API_WRITE_TOKEN` — create under **API → Tokens** (Editor) — needed
     only for seeding.
3. In sanity.io/manage → **API → CORS origins**, add `http://localhost:3000`
   (and your production URL) with credentials allowed.
4. **Seed the catalog** (uploads images + creates documents):
   ```bash
   npm run seed
   ```
5. `npm run dev`, open **`/studio`**, log in — the catalog is there to edit.
   Edits appear on the site within ~60s (ISR), or instantly via the webhook below.

### Instant updates on publish (optional)

Set `SANITY_REVALIDATE_SECRET` in `.env.local` (any random string). In
sanity.io/manage → **API → Webhooks**, add a webhook that POSTs on
create/update/delete to:

```
https://<your-site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
```

It purges the cached catalog (tag `catalog`) so changes go live immediately.

## Project map

```
app/
  page.tsx                 Home (bento hero, featured, categories, promo, visit)
  categories/              All-categories grid
  category/[slug]/         Category listing + live brand/price/sort filters
  product/[slug]/          Product detail (gallery, specs, WhatsApp/Call CTAs)
  contact/                 Visit info, map, WhatsApp-prefill enquiry form, FAQ
  studio/[[...tool]]/      Embedded Sanity Studio
  api/revalidate/          Sanity webhook → revalidateTag("catalog")
components/                SiteHeader, SiteFooter, ProductCard, CategoryCard, Icon…
lib/
  catalog.ts               Data facade (Sanity ⟷ seed fallback)
  data/seed.ts             Local catalog (also the seed source)
  sanity/                  client, image, GROQ queries, config
  types.ts  wa.ts  price.ts  jsonld.ts  site.ts
sanity/schemaTypes/        shopSettings, category, brand, product
scripts/seed.ts            One-off: push seed → Sanity
design/                    Original Claude Design handoff (reference only)
```

## Notes for future work

- **Marketing numbers** (category counts like "1380", hero "2,400+ items") are
  editable copy fields in Sanity, *not* computed from real SKUs — by design, so
  the original design's numbers survive. Edit them in Studio.
- **Parked ecommerce UI** — search bar, wishlist hearts, account icon, cart
  badges are present visually but inert in v1. Only browsing + WhatsApp enquiry
  are wired.
- Set `NEXT_PUBLIC_SITE_URL` in production for correct sitemap/JSON-LD URLs.
