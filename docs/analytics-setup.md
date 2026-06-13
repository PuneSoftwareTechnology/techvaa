# Analytics & Verification — how to get each value

Fill each value into `.env`, then redeploy. All are blank-safe (nothing tracks until set).

---

## 1. `NEXT_PUBLIC_GA_ID` — Google Analytics 4

1. Go to https://analytics.google.com
2. Admin (bottom-left gear) → **Create** → **Property**
3. Enter name "Techvaa", set timezone India, currency INR → Next
4. Pick "Web" platform → enter `https://techvaa.com` → **Create stream**
5. Copy the **Measurement ID** at top right — looks like `G-XXXXXXXXXX`
6. Paste into `.env` → `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

---

## 2. `NEXT_PUBLIC_GSC_VERIFICATION` — Google Search Console

1. Go to https://search.google.com/search-console
2. Add property → choose **URL prefix** → enter `https://techvaa.com`
3. Pick verification method **HTML tag**
4. You'll see `<meta name="google-site-verification" content="XXXX" />`
5. Copy ONLY the `content` value (the `XXXX`)
6. Paste into `.env` → `NEXT_PUBLIC_GSC_VERIFICATION=XXXX`
7. Redeploy, then click **Verify** in Search Console
8. After verified: submit `https://techvaa.com/sitemap.xml` under **Sitemaps**

---

## 3. `NEXT_PUBLIC_BING_VERIFICATION` — Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Sign in → **Add a site** → enter `https://techvaa.com`
   (Tip: you can also "Import from Google Search Console" to skip this.)
3. Choose verification option **2 (Meta tag / HTML)**
4. You'll see `<meta name="msvalidate.01" content="XXXX" />`
5. Copy ONLY the `content` value
6. Paste into `.env` → `NEXT_PUBLIC_BING_VERIFICATION=XXXX`
7. Redeploy, then click **Verify**

---

## 4. `NEXT_PUBLIC_CLARITY_ID` — Microsoft Clarity

1. Go to https://clarity.microsoft.com → sign in
2. **+ New project** → name "Techvaa", site `https://techvaa.com` → Create
3. It shows an install snippet containing `clarity.ms/tag/XXXXXXXX`
4. Copy the ID part (`XXXXXXXX`) — also under **Settings → Overview**
5. Paste into `.env` → `NEXT_PUBLIC_CLARITY_ID=XXXXXXXX`

---

## 5. `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel (ONLY if running Facebook/Instagram ads)

1. Go to https://business.facebook.com → **Events Manager**
2. **Connect data sources** → **Web** → **Meta Pixel** → Connect
3. Name it "Techvaa", enter `https://techvaa.com` → Continue
4. Copy the **Dataset/Pixel ID** (a long number) from the panel
5. Paste into `.env` → `NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXX`

> Skip this one entirely if you're not running paid ads.

---

## After filling values

- Redeploy (env vars are read at build/runtime).
- GA4: check **Realtime** report — open the site, you should appear within ~30s.
- Web Vitals flow into GA automatically once `NEXT_PUBLIC_GA_ID` is set.
- Clarity: recordings appear after a few visits.
