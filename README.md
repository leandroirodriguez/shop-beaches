# shop-beaches

Curated OBGYN-approved supplements and wellness products, surfaced from Amazon Associates links. Replaces the Shopify storefront at shop.beachesobgyn.com.

**Stack:** Vite + React + React Router · Tailwind v4 · Supabase (Postgres + Auth + Storage) · Vercel (hosting + serverless functions) · Anthropic Claude API · Amazon PA-API 5.0.

---

## First-time setup

You'll do these once. Most steps are external accounts; the code is already in place.

### 1. Create the Supabase project

1. Go to <https://supabase.com> → **New project**
2. Name it `shop-beaches`
3. Generate a strong DB password and save it in a password manager
4. Region: pick the one closest to you (e.g. `us-east-1` for Florida)
5. Wait ~2 minutes for it to provision

### 2. Run the SQL setup

1. In the Supabase dashboard, click **SQL Editor** in the left sidebar → **New query**
2. Open `supabase-setup.sql` from this repo, copy the entire file, paste into the editor
3. Click **Run** — should say "Success" with no errors
4. Check the **Table Editor**: you should see `categories` (5 rows seeded), `products` (empty), `blog_posts` (empty), `users` (empty)

### 3. Create your admin user

1. Supabase dashboard → **Authentication** → **Users** → **Add user → Create new user**
2. Email: your email · Password: pick one · Auto Confirm: **on**
3. Click **Create user**
4. Go to **Table Editor → users** → find your row → click the `is_admin` cell → flip to `true` → save

### 4. Fill in `.env`

1. Copy `.env.example` to `.env`
2. **Supabase:** dashboard → **Settings → API** → copy "Project URL" → `VITE_SUPABASE_URL`. Copy the **publishable** key (`sb_publishable_...`) → `VITE_SUPABASE_ANON_KEY`. Copy the **secret** key (`sb_secret_...`) → `SUPABASE_SERVICE_ROLE_KEY` (keep this one private).
3. **Anthropic:** <https://console.anthropic.com> → Settings → API Keys → Create Key → paste into `ANTHROPIC_API_KEY`.
4. **Amazon Partner Tag:** <https://affiliate-program.amazon.com> → top-right menu → **Manage Your Tracking IDs**. Copy the tag (looks like `beachesobgyn-20`) into `AMAZON_PARTNER_TAG`. That's all we need from Amazon right now.

### About Amazon API integration

The admin's "Add Product" flow currently uses **manual paste mode**: you paste the Amazon listing's title, bullets, price, and image URLs; Claude rewrites them into the curated voice.

Why not automated? Amazon retired the old Product Advertising API (PA-API) on **May 15, 2026**, replacing it with the **Creators API** which uses OAuth 2.0 (Client ID + Secret instead of Access Key + Secret Key). Integrating the new API is a TODO — when it ships, the admin will accept just the Amazon URL and pull title/images/price/bullets automatically.

### 5. Run locally

```bash
npm install     # only on first checkout
npm run dev     # starts at http://localhost:5173
```

You should see the homepage. If `.env` is filled in correctly and the SQL ran, the "Your Journey" section will list the 5 seeded categories.

---

## Deployment (later)

Vercel auto-deploys on every push to `main` once we link the repo. Same `.env` values need to be set in **Vercel → Project → Settings → Environment Variables** (use `VITE_*` for client, others for server).

The custom domain (`shop.beachesobgyn.com`) gets pointed at Vercel only at the very end, once the new site is verified.

---

## Project layout

```
shop-beaches/
├── api/                       # Vercel serverless functions (server-only)
│   └── (generate-product.js, generate-blog.js, fetch-amazon.js — coming)
├── src/
│   ├── components/            # Header, ProductCard, etc.
│   ├── pages/                 # Route components (HomePage, etc.)
│   ├── hooks/                 # useAuth, useAdminGuard (coming)
│   ├── lib/
│   │   └── supabase.js        # Browser Supabase client
│   ├── App.jsx                # React Router routes
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind v4 @theme tokens from DESIGN.md
├── supabase-setup.sql         # One-time DB setup
├── .env.example               # Copy to .env
└── vite.config.js
```
