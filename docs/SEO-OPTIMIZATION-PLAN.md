# SEO Optimization Plan

_Generated 2026-06-16. Source input: SEOptimer audit (overall grade **B**) + code review of `drivebuddies-web`._

## 0. Read this first — the audit tested the wrong domain

SEOptimer crawled **`frabjous-sunshine-8e1a1a.netlify.app`** (the staging/branch deploy), not production **`drivebuddies.ch`**. This single fact explains or distorts several findings:

| Audit finding | Reality |
| --- | --- |
| "No analytics detected" | **False.** Plausible is installed in `Layout.astro` with `data-domain="drivebuddies.ch"`. It just doesn't register hits from the staging hostname. No action needed. |
| "0 backlinks / Domain Strength 0 / Links = F" | Meaningless on a random `*.netlify.app` subdomain. The real backlink profile is whatever points at `drivebuddies.ch` — still likely weak, but the audit number is noise. |
| "Rendered content 2% (LLM readability)" | Almost certainly a staging/measurement artifact — the site is static-rendered Astro with full HTML content. Re-test against production before trusting it. |
| SERP preview shows the netlify.app URL | Cosmetic; canonical correctly points to `drivebuddies.ch`. |

**Action 0 (do this before anything else):** re-run the audit against `https://drivebuddies.ch/` so the baseline is real. Tools: SEOptimer (re-scan), Google Search Console URL Inspection, PageSpeed Insights on the production URL.

**Action 0b (new risk found in code):** staging/deploy-preview builds are **not** `noindex`'d. `netlify.toml` builds deploy-previews and branch-deploys with the same `robots.txt` (`Allow: /`). The page canonical points to production, which mostly protects us, but Google can still index `*.netlify.app` as a duplicate. Add an `X-Robots-Tag: noindex` header for non-production Netlify contexts (see §3).

---

## What's already strong (don't touch)

From code review — the site is in good shape:
- ✅ `src/i18n/routes.ts` single-source route map driving nav, hreflang, sitemap, OG selection.
- ✅ Global `DrivingSchool`+`LocalBusiness` JSON-LD in `SeoHead.astro` (address, geo, hours, areaServed, sameAs).
- ✅ Per-page JSON-LD across ~40 pages (FAQPage, ItemList, Breadcrumb, HowTo, AggregateRating).
- ✅ hreflang de-CH / en / x-default with translated EN slugs; reciprocal in sitemap `serialize()`.
- ✅ Canonical, OG, Twitter cards, branded OG images per section.
- ✅ Lighthouse 100s, HTTP/2, compression, minification, image optimization, viewport, favicon.
- ✅ Plausible (cookieless) analytics + consent banner.
- ✅ 28 legacy cross-locale 301s + 3 blog 301s, sitemap, robots.txt.

---

## Priority 1 — Real on-page wins (quick, high leverage)

### 1.1 Lengthen title tags to 50–60 chars
Home title is **40 chars** (`DriveBuddies – Ihre Fahrschule in Zürich`). Add a keyword-bearing tail. Edit `src/i18n/de.json` / `en.json` (`seo.homeTitle`):
- DE: `DriveBuddies – Ihre moderne Fahrschule in Zürich & Thalwil` (~57)
- EN: `DriveBuddies – Modern Driving School in Zurich & Thalwil` (~55)

Then sweep all pages: the `seo-audit.mjs` script already flags meta length — extend/confirm it warns on `<50` or `>60` title and act on the list.

### 1.2 Fix keyword consistency
Top detected keywords are German stopwords (`und`, `mit`, `die`). The money phrases ("Fahrschule Zürich", "Lernfahrausweis", "VKU Zürich", "Nothelferkurs Thalwil") aren't dense enough in title + H1 + H2s.
- Ensure each service page's H1 contains its primary keyword + location.
- Add location qualifiers ("in Zürich", "Thalwil / Zürichsee") to H2s where natural.

### 1.3 Add `priceRange` (+ optionally `aggregateRating`) to LocalBusiness schema
`SeoHead.astro` LocalBusiness lacks `priceRange` — Google Local likes it. Add `priceRange: 'CHF'` or e.g. `'$$'`. If you have genuine Google reviews, add `aggregateRating` (only with real, verifiable numbers).

### 1.4 Verify LocalBusiness schema is actually detected
Audit's Local SEO section said "No Local Business Schema identified" even though we emit `@type: ['DrivingSchool','LocalBusiness']`. Some parsers don't resolve array `@type` for the LocalBusiness check. **Verify on production** with Google's Rich Results Test. If it fails to register, consider emitting `DrivingSchool` as the primary type (it's a subtype of LocalBusiness and inherits its properties) rather than the array.

### 1.5 Thin content on home (418 words)
Add 150–300 words of genuinely useful copy to the homepage (e.g. a short "Warum DriveBuddies / how it works in Zürich" section, or an FAQ expansion). Keep it real content, not stuffing. Service pages should each clear ~300+ words.

---

## Priority 2 — GEO / AI-search (low effort, future-facing)

### 2.1 Add `llms.txt`
Missing (`public/llms.txt` does not exist). Create a markdown `public/llms.txt` with a one-paragraph description of Drive Buddies, key facts (location Thalwil/Zürich, phone, courses offered), and links to the main pages (courses, prices, contact, blog). Low effort, growing relevance for AI search.

---

## Priority 3 — Technical / deliverability (DNS + Netlify)

### 3.1 SPF + DMARC records (real, production DNS)
`drivebuddies.ch` has neither. Add via DNS:
- **SPF** TXT: `v=spf1 include:<your-mail-provider> -all` (use the provider's published include).
- **DMARC** TXT at `_dmarc.drivebuddies.ch`: start monitoring-only `v=DMARC1; p=none; rua=mailto:dmarc@drivebuddies.ch`, tighten to `quarantine`/`reject` later.
- Add DKIM per provider while you're there.

### 3.2 noindex non-production Netlify deploys
Add to `netlify.toml` so staging/preview hostnames aren't indexable:
```toml
[[context.deploy-preview.headers]]
  for = "/*"
  [context.deploy-preview.headers.values]
    X-Robots-Tag = "noindex"

[[context.branch-deploy.headers]]
  for = "/*"
  [context.branch-deploy.headers.values]
    X-Robots-Tag = "noindex"
```
(Keeps production `[context.production]` untouched.)

---

## Priority 4 — Off-page & local presence (ongoing)

### 4.1 Google Business Profile
Highest-ROI for a local driving school. Claim/verify GBP for Albisstrasse 1, 8800 Thalwil; complete categories ("Driving school"), hours, photos, services, and start collecting reviews. This drives the local pack far more than on-page tweaks.

### 4.2 Local citations / link building (Links = the weakest real axis)
- Swiss/local directories: local.ch, search.ch, Cylex, herold-style listings, Zürich business directories.
- Driving-school / partnership links (Nothelfer partners, VKU venues, schools).
- Ensure **NAP consistency** (Name/Address/Phone exactly matching the schema) across every listing.

### 4.3 Social profiles
Only Instagram is linked. Create + link from footer and add to schema `sameAs`: Facebook page, LinkedIn, YouTube (great for a driving school — lesson clips, route walkthroughs), optionally X. Each is a low-priority audit item but they reinforce entity/brand signals.

---

## Priority 5 — Low priority / optional

- **Plain-text email**: `info@drivebuddies.ch` appears on contact pages (`kontakt`, `en/contact`). Audit flags scraper exposure. Optional: obfuscate or rely on the contact form. Low impact.
- **Facebook Pixel**: only if you plan to run Meta ads.
- **AMP**: ignore — deprecated and irrelevant for this stack.

---

## Suggested execution order

1. **Re-baseline** on production (§0) — don't optimize against staging numbers.
2. **Code PR** (1 sitting): title lengths (1.1), `priceRange` (1.3), `llms.txt` (2.1), Netlify noindex headers (3.2), verify Rich Results (1.4). All in-repo, ship together.
3. **DNS** (3.1): SPF/DMARC/DKIM.
4. **Content pass** (1.2, 1.5): keyword-aligned H1/H2 + homepage copy.
5. **Ongoing**: GBP (4.1), citations/links (4.2), social (4.3).

Run `node scripts/seo-audit.mjs` after any route/content change (must stay 0 broken / 0 hreflang mismatch).
