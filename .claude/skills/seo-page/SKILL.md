# seo-page

Scaffold a new DriveBuddies route as a pair of DE + EN Astro pages with correct SEO frontmatter, a `<SeoHead>` component call, and a JSON-LD stub.

## Usage

```
/seo-page <route-slug> <schema-type> [page-title-de]
```

Examples:
```
/seo-page kurse/vku Course "VKU — Verkehrskundeunterricht"
/seo-page kontakt ContactPage "Kontakt"
/seo-page blog/eintrag-slug BlogPosting "Titel des Blogbeitrags"
```

## What this skill does

1. Reads `CLAUDE.md` to confirm the route exists in the IA table. If not, prompts to add it first.
2. Creates `src/pages/<route-slug>/index.astro` (DE) with:
   - Frontmatter import of `SeoHead` and the layout
   - `<SeoHead>` call with placeholder `title`, `description`, `canonical`, and `hreflang` props
   - A `<script type="application/ld+json">` stub for the given schema type
   - A `<main>` with a single `<h1>` placeholder
3. Creates `src/pages/en/<en-route-slug>/index.astro` (EN) — mirrored structure, EN slug derived from the IA table.
4. Reports the two file paths created and reminds you to:
   - Fill in real `title` and `description` values
   - Complete the JSON-LD fields
   - Run `/seo-reviewer` before merging

## JSON-LD stubs by schema type

### Course
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "PLACEHOLDER",
  "description": "PLACEHOLDER",
  "provider": {
    "@type": "Organization",
    "name": "DriveBuddies",
    "url": "https://drivebuddies.ch"
  },
  "url": "PLACEHOLDER"
}
```

### HowTo
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "PLACEHOLDER",
  "description": "PLACEHOLDER",
  "step": []
}
```

### ContactPage / AboutPage
```json
{
  "@context": "https://schema.org",
  "@type": "PLACEHOLDER_TYPE",
  "name": "PLACEHOLDER",
  "url": "PLACEHOLDER"
}
```

### BlogPosting
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "PLACEHOLDER",
  "datePublished": "PLACEHOLDER",
  "author": { "@type": "Organization", "name": "DriveBuddies" },
  "publisher": { "@type": "Organization", "name": "DriveBuddies", "url": "https://drivebuddies.ch" },
  "url": "PLACEHOLDER"
}
```
