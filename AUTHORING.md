# Blog Authoring Guide

How to add or edit blog posts entirely through the **GitHub web UI** — no local setup required.

---

## 1. Where posts live

All blog posts are Markdown files in:

```
src/content/blog/
```

File naming convention:
- `my-post-slug.md` — German (DE) version (canonical)
- `en/my-post-slug.md` — English (EN) translation (same slug, inside the `en/` subdirectory)

---

## 2. Creating a new post via GitHub

1. Go to the repo on GitHub.
2. Navigate to `src/content/blog/`.
3. Click **"Add file" → "Create new file"**.
4. Name the file, e.g. `mein-neuer-beitrag.md`.
5. Paste the template below, fill it in, then click **"Commit new file"** (commits directly to `main` or open a PR).

### Frontmatter template

```yaml
---
title: "Your post title here"
description: "A 1–2 sentence summary (shown in cards and meta tags, ≤ 160 chars)."
date: 2025-11-01
tags: ["Fahrprüfung", "Tipps"]
cover: "https://example.com/your-image.jpg"
lang: de
draft: false
author: "Jakov Budimir"
---
```

### Frontmatter fields

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Shown as H1 and `<title>` |
| `description` | Yes | Meta description + card excerpt, ≤ 160 chars |
| `date` | Yes | `YYYY-MM-DD` format — use the original publish date |
| `tags` | No | Array of strings; creates tag pages automatically |
| `cover` | No | Full URL to a cover image (16:9 recommended) |
| `lang` | Yes | `de` for German, `en` for English |
| `draft` | No | Set to `true` to hide from listing without deleting |
| `author` | No | Author's full name |

---

## 3. Writing the post body

Below the `---` closing the frontmatter, write regular Markdown:

```markdown
---
# frontmatter above
---

Intro paragraph here.

## Section heading

Body text. **Bold** and _italic_ work as normal.

## Another heading

- Bullet list item
- Another item

### Sub-heading

More text.
```

**Do not add an H1 (`#`)** — the title from frontmatter is rendered as the page H1 automatically.

---

## 4. Adding the English translation

1. Navigate to `src/content/blog/en/` (create the `en/` subdirectory if it doesn't exist yet).
2. Create a new file named `mein-neuer-beitrag.md` (same slug as the DE version, no `.en` suffix).
3. Set `lang: en` in the frontmatter.
4. Translate the body — keep Swiss legal/official terms in German (Führerausweis, VKU, Nothelfer, Lernfahrausweis, Fahrlehrer, etc.).
5. The EN post is accessible at `/en/blog/mein-neuer-beitrag/`.

---

## 5. Editing an existing post

1. Navigate to the file in `src/content/blog/`.
2. Click the **pencil icon** (Edit).
3. Make your changes.
4. Click **"Commit changes"**.

Netlify will rebuild and deploy automatically (usually takes 1–2 minutes).

---

## 6. Drafts & unpublishing

- Set `draft: true` in frontmatter to hide a post from the listing and tag pages without deleting it.
- The post URL still builds (useful for preview links) but won't appear in navigation, RSS, or listings.

---

## 7. Adding a cover image

Upload images to a CDN or your preferred host and paste the full URL into the `cover` field:

```yaml
cover: "https://cdn.example.com/images/my-image.avif"
```

Recommended: 16:9 ratio, ≥ 1200 × 675 px, `.avif` or `.webp` for best performance. Set a meaningful descriptive filename — it appears in the CDN URL shown in Google Search Console.

---

## 8. Tags

Tags create automatic tag index pages at `/blog/tags/<tag>/` (DE) and `/en/blog/tags/<tag>/` (EN). Use consistent casing and spelling — tags are case-sensitive.

Existing tags (as of launch):

**DE:** `Fahrpraxis`, `Führerausweis`, `Selbstreflexion`, `Fahrprüfung`, `Prüfungsvorbereitung`, `Tipps`

**EN:** `Driving Practice`, `Führerausweis`, `Self-Reflection`, `Driving Test`, `Exam Preparation`, `Tips`

---

## 9. RSS feed

The RSS feed is available at `/rss.xml` and includes all published DE posts. It updates on every deploy.

---

## 10. SEO checklist before publishing

- [ ] `title` is unique and ≤ 60 chars (incl. ` | DriveBuddies` suffix added automatically)
- [ ] `description` is unique and ≤ 160 chars
- [ ] `date` reflects the original publish date
- [ ] At least one relevant `tag`
- [ ] `cover` image is set (improves click-through from Google Discover)
- [ ] EN translation exists (`*.en.md`) with `lang: en`
