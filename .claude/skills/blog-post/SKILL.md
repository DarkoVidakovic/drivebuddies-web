# blog-post

Create a new blog post conforming to the DriveBuddies content-collection schema — DE + EN paired files with `BlogPosting` JSON-LD. Phase-2 upgrade: AI drafting pipeline.

## Usage

```
/blog-post "<Titel auf Deutsch>" [--draft] [--ai-draft]
```

- `--draft`: mark the post as `draft: true` in frontmatter (won't publish)
- `--ai-draft`: use the `content-translator` agent to produce an EN draft automatically after the DE skeleton is created

Examples:
```
/blog-post "5 Tipps für die Führerprüfung" --draft
/blog-post "Nothelfer Kurs: Was erwartet mich?" --ai-draft
```

## Content-collection schema

Every blog post must include the following frontmatter:

```yaml
---
title: ""               # DE title, ≤ 60 chars for SEO
description: ""         # DE meta description, ≤ 160 chars
slug: ""                # URL-safe, lowercase, hyphenated
pubDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD # optional
draft: false
author: "DriveBuddies"
image:
  src: ""               # path under /public/images/blog/
  alt: ""
tags: []                # e.g. ["vku", "prüfung", "tipps"]
hreflangDe: "/blog/<slug>/"
hreflangEn: "/en/blog/<en-slug>/"
---
```

## What this skill does

1. Derives `slug` from the title (lowercase, German umlauts normalised: ä→ae, ö→oe, ü→ue, ß→ss).
2. Creates `src/content/blog/<slug>.md` with the schema above + a placeholder body structure:
   ```markdown
   ## Einleitung
   <!-- 1-2 sentences introducing the topic -->

   ## Hauptteil
   <!-- 3-5 sections with H3 headings -->

   ## Fazit
   <!-- 1 sentence summary + CTA -->
   ```
3. Creates `src/content/blog/<en-slug>.en.md` — EN sibling with `# TRANSLATION NEEDED` if `--ai-draft` is not passed; if `--ai-draft`, invokes `content-translator` to produce an EN draft.
4. Adds a `BlogPosting` JSON-LD stub to both files (as a fenced code block comment for the page template to pick up).
5. Prints the two file paths and reminds to: add a cover image to `/public/images/blog/`, fill in real content, run `seo-reviewer` before publishing.

## Phase-2 AI drafting pipeline (future upgrade)

When this skill is upgraded in M6+:
- Accept a topic brief as additional argument.
- Use `claude-sonnet-4-6` to draft the full DE post body from the brief + brand voice guidelines.
- Auto-translate to EN via `content-translator`.
- Output a review-ready draft with flagged sections needing human verification.

## BlogPosting JSON-LD (injected into the page template)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "FRONTMATTER_TITLE",
  "description": "FRONTMATTER_DESCRIPTION",
  "datePublished": "FRONTMATTER_PUBDATE",
  "dateModified": "FRONTMATTER_UPDATEDDATE",
  "author": {
    "@type": "Organization",
    "name": "DriveBuddies",
    "url": "https://drivebuddies.ch"
  },
  "publisher": {
    "@type": "Organization",
    "name": "DriveBuddies",
    "url": "https://drivebuddies.ch"
  },
  "image": "FRONTMATTER_IMAGE_SRC",
  "url": "FRONTMATTER_HREFLANG_DE"
}
```
