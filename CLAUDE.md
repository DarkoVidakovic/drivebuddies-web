# DriveBuddies Web — Project Contract

> Every Claude Code session reads this file first. Do not add ephemeral task notes here; use git commit messages or PR descriptions for that.

---

## 1. Brand Tokens (placeholders — replace once design tokens are finalised)

```
/* Brand blue aligned to official logo (M2, 2026-06-14).
   Previous values sampled from Webflow CSS were #1d68f4/#155dcf/#5a93f7. */

--color-primary:        #2a4cd5   /* Brand blue — matches logo, primary CTA, links */
--color-primary-dark:   #223eaf   /* Hover / active state of primary */
--color-primary-light:  #7b90e5   /* Tinted accent, focus rings */
--color-accent:         #010101   /* Near-black — dark scheme foreground */
--color-surface:        #ffffff
--color-surface-alt:    #f5f5f5
--color-text:           #010101
--color-text-muted:     #666666
--color-border:         #cccccc
--color-error:          #b42318
--color-success:        #027a48

--font-sans:    'Inter Variable', system-ui, sans-serif   /* self-hosted @fontsource-variable/inter */
--font-heading: 'Inter Variable', system-ui, sans-serif

--radius-sm:   4px
--radius-md:   8px
--radius-lg:   16px
--radius-full: 9999px

--space-1: 4px  --space-2: 8px  --space-3: 12px  --space-4: 16px
--space-6: 24px --space-8: 32px --space-10: 40px --space-12: 48px
--space-16: 64px --space-20: 80px --space-24: 96px

--shadow-sm: 0 1px 3px rgba(1,1,1,.08)
--shadow-md: 0 4px 12px rgba(1,1,1,.10)
--shadow-lg: 0 8px 24px rgba(1,1,1,.12)
```

Tokens are declared in `src/styles/global.css` and exposed to Tailwind v4 via `@theme`. The Inter Variable font is self-hosted via the `@fontsource-variable/inter` npm package — no CDN dependency.

All components **must** reference these tokens. Never hard-code hex values or pixel spacing outside token declarations.

---

## 2. Information Architecture & Slug / Redirect Map

> **Source of truth:** the actual built routes and their DE↔EN slug pairs live
> in `src/i18n/routes.ts` (`ROUTES`). Nav, Footer, the language switcher,
> hreflang, OG-image selection and the sitemap all derive from it. Keep this
> table and `routes.ts` in sync.

### DE routes (default locale, no prefix)

| Page | Slug | JSON-LD type |
|------|------|-------------|
| Home | `/` | `WebSite` + `Organization`(+`AggregateRating`) + `FAQPage` |
| Dienstleistungen (Übersicht) | `/dienstleistungen/` | `ItemList` |
| — Auto Kat. B | `/dienstleistungen/auto/` | `Course` |
| — Motorrad Kat. A | `/dienstleistungen/motorrad/` | `Course` |
| — Anhänger Kat. BE | `/dienstleistungen/anhaenger/` | `Course` |
| Kurse (Übersicht) | `/kurse/` | `ItemList` |
| VKU | `/vku/` | `BreadcrumbList` + `Course` + `FAQPage` |
| Nothelferkurs | `/nothelferkurs/` | `BreadcrumbList` + `FAQPage` |
| Theorieprüfung | `/theoriepruefung/` | `BreadcrumbList` + `FAQPage` |
| Lernfahrausweis | `/lernfahrausweis/` | `BreadcrumbList` + `FAQPage` |
| Führerausweis | `/fuehrerausweis/` | `BreadcrumbList` + `FAQPage` |
| Der Weg zum Führerschein (Hub) | `/fuehrerschein/` | `BreadcrumbList` + `HowTo` + `FAQPage` |
| 2-Phasen / WAB | `/2-phasen-ausbildung/` | `BreadcrumbList` + `FAQPage` |
| Über uns | `/ueber-uns/` | `AboutPage` + `AggregateRating` |
| Preise | `/preise/` | `Offer` list |
| Kontakt | `/kontakt/` | `ContactPage` |
| Blog | `/blog/` | `Blog` |
| Blog-Post | `/blog/[slug]/` | `BlogPosting` |
| Blog-Tag (thin) | `/blog/tags/[tag]/` | `noindex`, excluded from sitemap |
| Impressum | `/impressum/` | — |
| Datenschutz | `/datenschutz/` | — |
| 404 | — | `noindex` |

> Note: M5 consolidated the original separate "Grundkurs" course pages into the
> flat structure above and the `/fuehrerschein/` journey hub. The licence-step
> pages (`/lernfahrausweis/`, `/fuehrerausweis/`) are informational pages using
> `BreadcrumbList`+`FAQPage`; the single canonical `HowTo` lives on the hub.

### EN routes (`/en/` prefix, translated slugs)

EN slugs are **translated**, not prefixed mirrors. Full map in `routes.ts`:

| DE | EN |
|----|----|
| `/dienstleistungen/` (`/auto/` `/motorrad/` `/anhaenger/`) | `/en/services/` (`/car/` `/motorcycle/` `/trailer/`) |
| `/kurse/` | `/en/courses/` |
| `/vku/` | `/en/vku/` |
| `/nothelferkurs/` | `/en/first-aid-course/` |
| `/theoriepruefung/` | `/en/theory-exam/` |
| `/lernfahrausweis/` | `/en/learner-licence/` |
| `/fuehrerausweis/` | `/en/driving-licence/` |
| `/fuehrerschein/` | `/en/how-to-get-swiss-licence/` |
| `/2-phasen-ausbildung/` | `/en/two-phase-training/` |
| `/ueber-uns/` | `/en/about/` |
| `/preise/` | `/en/prices/` |
| `/kontakt/` | `/en/contact/` |
| `/blog/` (+`[slug]`) | `/en/blog/` (+ same `[slug]`) |
| `/impressum/` `/datenschutz/` | `/en/impressum/` `/en/datenschutz/` |

### Legacy / redirect map

Configured in `netlify.toml`. See `docs/SEO-LAUNCH.md` for the full status.

| Old URL | New URL | Code |
|---------|---------|------|
| `/blog/an-sich-selber-arbeiten---bis-zum-status-gute-fahrerin-guter-fahrer` | `/blog/an-sich-selber-arbeiten/` | 301 |
| `/blog/haufige-fehler-in-der-fahrprufung---und-wie-du-sie-vermeidest` | `/blog/haufige-fehler-fahrpruefung/` | 301 |
| `/blog/5-tipps-wie-du-entspannt-durch-die-fuhrerprufung-kommst` | `/blog/5-tipps-fuehrerpruefung/` | 301 |
| naive cross-locale paths (e.g. `/en/kontakt/`, `/about/`, `/services/car/`) | canonical locale page | 301 (×28) |

---

## 3. i18n Conventions

- **Default locale: `de`** — no URL prefix, served at root.
- **English locale: `en`** — all routes prefixed with `/en/`.
- **Paired files**: every content file has a sibling, e.g.:
  ```
  src/content/kurse/vku.md        ← DE (canonical)
  src/content/kurse/vku.en.md     ← EN translation
  ```
- **hreflang** must be injected by `<SeoHead>` on every page:
  ```html
  <link rel="alternate" hreflang="de" href="https://drivebuddies.ch/kurse/vku/" />
  <link rel="alternate" hreflang="en" href="https://drivebuddies.ch/en/courses/vku/" />
  <link rel="alternate" hreflang="x-default" href="https://drivebuddies.ch/kurse/vku/" />
  ```
- Translation strings live in `src/i18n/de.json` and `src/i18n/en.json`.
- Never translate Swiss legal/official terms (see §7 Glossary). Keep them in German even in EN pages.
- Machine translation is a draft only; run the `content-translator` agent before merge.

---

## 4. SEO Rules

Every routed page **must**:

1. Include `<SeoHead>` with `title`, `description`, `canonical`, and `hreflang` props.
2. Include a JSON-LD `<script type="application/ld+json">` block via `<SeoHead>` or a dedicated JSON-LD component — type matching the IA table above.
3. Have a unique `<title>` (≤ 60 chars) and `<meta name="description">` (≤ 160 chars).
4. Declare `<link rel="canonical">` pointing to the primary URL (no trailing variation).
5. Not have duplicate H1s per page.

Run the `seo-reviewer` agent before merging any route or content change.

### Lighthouse CI budgets (enforced in CI from M10)

| Metric | Budget |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 90 |
| SEO | ≥ 95 |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| TBT | ≤ 200 ms |

---

## 5. Component & Design-Token Rules

- Components live in `src/components/`. Atomic components in `src/components/ui/`.
- Every component is an Astro `.astro` file unless interactivity requires a framework island.
- Islands use `client:visible` by default; use `client:load` only when above-the-fold interaction is required.
- **No inline styles.** Use CSS custom properties from §1.
- **No Tailwind utility classes for one-off values** — add a token instead.
- Spacing, color, border-radius, and shadow all come from the token table.
- Run the `design-system-guard` agent when adding or modifying components.

### Accessibility defaults
- All `<img>` must have meaningful `alt` text (or `alt=""` for decorative images).
- Interactive elements must be keyboard-reachable and have visible focus rings.
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text.

---

## 6. Functional Parity Checklist

Before launch, verify the new site matches the existing drivebuddies.ch:

- [ ] All course pages present with correct pricing and schedule info
- [ ] Contact form functional (name, email, phone, message, course interest)
- [ ] Google Maps embed or equivalent on Kontakt page
- [ ] Online booking / registration flow (course sign-up)
- [ ] Blog listing and individual post pages
- [ ] Navigation: desktop + mobile hamburger
- [ ] Footer: address, phone, email, social links, legal links
- [ ] Cookie consent banner (Swiss/DSGVO compliant)
- [ ] 404 page
- [ ] Sitemap (`/sitemap.xml`) generated
- [ ] robots.txt
- [ ] Open Graph + Twitter Card meta tags
- [ ] Favicon + Apple touch icon

---

## 7. Swiss Driving Glossary

Keep these terms in German even in English-language content. Do not translate or anglicise them.

| Term | Meaning |
|------|---------|
| **Nothelfer** | First-aid course — mandatory before a learner licence is issued |
| **VKU** | Verkehrskundeunterricht — theory/road-safety course, mandatory before practical exam |
| **Lernfahrausweis** | Learner's driving permit (provisional licence) |
| **Grundkurs** | Foundational driving course (theory and/or practical) |
| **2-Phasen-Ausbildung** | Two-phase driver training system |
| **WAB** | Weiterausbildungsphase — second phase of driver training, taken after the probationary period |
| **Führerausweis** | Full driving licence |
| **Fahrlehrer** | Driving instructor |
| **Fahrstunde** | Driving lesson |
| **Prüfung** | (Driving) examination |
| **Strassenverkehrsamt** | Cantonal road traffic authority (StVA) |

---

## 8. Tech Stack

- **Framework**: Astro (latest stable)
- **Styling**: CSS custom properties (token system above) + scoped Astro styles
- **Content**: Astro Content Collections (Markdown/MDX)
- **Deployment**: Netlify (static output, `astro build`)
- **CI/CD**: GitHub Actions (see `.github/workflows/`)
- **Package manager**: npm

---

## 9. Milestone Map (high level)

| Milestone | Description |
|-----------|-------------|
| M0 | Scaffolding (this commit) |
| M1 | Astro project init + token system |
| M2 | Layout, navigation, footer |
| M3 | Home page |
| M4 | Course pages |
| M5 | Lernfahrausweis / Führerausweis / 2-Phasen pages |
| M6 | Blog listing + posts |
| M7 | Kontakt + form |
| M8 | Legal pages (Impressum, Datenschutz) |
| M9 | EN locale pass |
| M10 | CI: Lighthouse + broken-link check |
| M11 | Staging deploy + QA |
| M12 | Launch |
