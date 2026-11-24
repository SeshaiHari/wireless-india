# Wireless India

Showcase website for **Wireless India**, an electronics shop in Theni (sound bars,
Bluetooth speakers, multimeters, ICs, cables, pendrives, power strips, tools…).

It's a **catalog + WhatsApp ordering** site: customers add products (with
quantities) to a cart, then send the whole order to the shop as one pre-filled
WhatsApp message. There's no online payment; the shop confirms stock and price
on WhatsApp.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** for design tokens + CSS Modules per page for layout
- **Payload CMS** (open source, runs inside this Next.js app) for the catalog, with the admin at `/admin`
- **Postgres** (Neon) for content, **Vercel Blob** for images
- Deployable to **Vercel**

## How the data works

All content lives behind one facade — `lib/catalog.ts`. Pages only call
`getProducts()`, `getCategories()`, `getProduct(slug)`, etc.

- **With `DATABASE_URL` set** → reads from Payload (`lib/payload/queries.ts`).
- **Without it** → falls back to the local seed in `lib/data/seed.ts`, so the
  site runs end-to-end out of the box (product images live in `public/products/`).

Content model (`payload/`): **Products**, **Categories**, **Brands**, **Media**
(images), **Users** (admin logins) and the **Shop settings** global (name,
phone, WhatsApp number used by the cart, address, hours, map, marquee, hero
stats, shop-front photo).

Edits in `/admin` go live immediately: every collection has an `afterChange`
hook that purges the cached catalog (tag `catalog`). There's also a 60s
time-based fallback.

## Run locally

```bash
cp .env.example .env    # fill in DATABASE_URL + PAYLOAD_SECRET (or leave blank for seed mode)
npm install
npm run migrate         # create/upgrade the database tables
npm run seed            # optional: load the sample catalog into Payload
npm run dev             # http://localhost:3000 — admin at /admin
```

```bash
npm run build && npm start   # production build
npm run lint                 # eslint
```

## Deploy (Vercel)

1. Vercel → Storage → create **Neon Postgres** and **Blob**, connect both to the
   project (adds `DATABASE_URL` and `BLOB_STORE_ID` or `BLOB_READ_WRITE_TOKEN`;
   `payload/blobStorage.ts` supports both).
2. Add `PAYLOAD_SECRET` (long random string).
3. Deploy. The `vercel-build` script runs `payload migrate` before `next build`
   (skipped when `DATABASE_URL` is missing, so the site builds on the seed catalog).
4. Open `/admin` and create the first admin user.

## Analytics (Umami)

Visitor analytics uses [Umami](https://umami.is): open source, no cookies, no
personal data, so no consent banner. It is off until a website ID is set.

**Self-hosted (free, on Vercel + Neon):**

1. Neon (or Vercel → Storage → Neon): create a **new, empty database** for Umami.
   Don't reuse the Payload database. Copy its connection string.
2. GitHub: fork `umami-software/umami`.
3. Vercel → Add New → Project → import the fork. Add env vars
   `DATABASE_URL` (the Umami connection string) and, optionally,
   `TRACKER_SCRIPT_NAME=stats` (serves the script as `/stats.js`, which fewer
   ad blockers block). Deploy. The first build creates Umami's tables.
4. Open the Umami site, log in as `admin` / `umami`, and **change the password
   right away** (Settings → Profile).
5. Settings → Websites → Add website (your shop domain) → copy the **Website ID**.
6. In the shop's Vercel project (Production env), set:
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` = the Website ID
   - `NEXT_PUBLIC_UMAMI_SCRIPT_URL` = `https://<your-umami>.vercel.app/stats.js`
     (or `/script.js` if you skipped `TRACKER_SCRIPT_NAME`)
   - `NEXT_PUBLIC_UMAMI_DOMAINS` = your shop domain, e.g. `wirelessindia.in`

   Then redeploy the shop.

**Umami Cloud instead:** sign up at cloud.umami.is (free tier), add the website,
and set only `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_DOMAINS`.

Page views are automatic. Custom events (`lib/analytics.ts`):

| Event | When | Data |
| --- | --- | --- |
| `category_view` | Category page opens | category, products |
| `product_view` | Product page opens | product, sku, brand, category, price |
| `add_to_cart` | Add / Add to cart button | product, qty, value, source, page |
| `whatsapp_click` | Any WhatsApp link or the contact form | kind (`order` / `chat` / `contact_form`), placement, page; orders add product, items, units, value |
| `call_click` | Any phone link | placement, page |

WhatsApp and phone links are caught site-wide by `components/Analytics.tsx`.
To label a new link, add `data-track="where-it-is"` (and `data-track-kind="order"`
plus `data-track-value` etc. if it carries an order).

## Changing the content model

Edit a file in `payload/collections` or `payload/globals`, then:

```bash
npm run migrate:create <name>   # writes a migration to payload/migrations
npm run generate:types          # refresh payload-types.ts
npm run generate:importmap      # only if admin components changed
```

Commit the migration; it runs on the next deploy.

## Project map

```
app/
  (frontend)/              The public site (own root layout)
    page.tsx               Home (bento hero, featured, categories, promo, visit)
    categories/            All-categories grid
    category/[slug]/       Category listing + live brand/price/sort filters
    product/[slug]/        Product detail (gallery, specs, WhatsApp/Call CTAs)
    cart/                  Cart: quantities, totals, "Send order on WhatsApp"
    contact/               Visit info, map, WhatsApp-prefill enquiry form, FAQ
  (payload)/               Payload admin (/admin) + REST API (/api/*)
  api/search/              Search index for the header search
components/                SiteHeader, SiteFooter, ProductCard, CategoryCard, Icon…
lib/
  catalog.ts               Data facade (Payload ⟷ seed fallback)
  data/seed.ts             Local catalog (also the seed source)
  payload/                 Cached Payload queries → app types
  cart.ts                  Cart store (localStorage, ids + qty only) + useCart()
  types.ts  wa.ts  price.ts  jsonld.ts  site.ts
payload.config.ts          Payload config (Postgres, Vercel Blob)
payload/                   collections, globals, hooks, migrations
payload-types.ts           Generated types (npm run generate:types)
scripts/seed.ts            Load seed → Payload
design/                    Original Claude Design handoff (reference only)
```

## Notes for future work

- **Marketing numbers** (category counts like "1380", hero "2,400+ items") are
  editable copy fields in Payload, *not* computed from real SKUs — by design, so
  the original design's numbers survive. Edit them in `/admin`.
- **Cart** — stored in the visitor's browser (`localStorage`, key `wi-cart`).
  Only product ids and quantities are saved; names and prices are always read
  from the catalog, so price edits in Payload show up in existing carts. The
  WhatsApp message is built in `lib/wa.ts` (`orderMessage`). There's no payment
  or stock reservation: the shop confirms on WhatsApp.
- Set `NEXT_PUBLIC_SITE_URL` in production for correct sitemap/JSON-LD URLs.
