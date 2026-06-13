# astro-component

Generate a new Astro component that matches the DriveBuddies design token system with accessibility defaults baked in.

## Usage

```
/astro-component <ComponentName> [--island] [--ui]
```

- `--island`: generate as a framework island (Svelte/React slot) with `client:visible`
- `--ui`: place in `src/components/ui/` (atomic/primitive); default is `src/components/`

Examples:
```
/astro-component CourseCard
/astro-component NewsletterForm --island
/astro-component Button --ui
```

## What this skill does

1. Determines the output path (`src/components/ui/` or `src/components/`).
2. Generates `<ComponentName>.astro` with:
   - A typed `Props` interface
   - Template using semantic HTML (not generic `<div>` soup)
   - `<style>` block using only `var(--token-*)` references — no hard-coded values
   - ARIA attributes and keyboard event handlers where the component is interactive
   - A comment block listing the props interface (no inline prose comments)
3. For `--island`: generates `<ComponentName>.svelte` (or `.tsx` if project uses React) with the same constraints, wrapped in an Astro file that sets `client:visible`.
4. Runs `design-system-guard` on the generated file and reports any violations.
5. Prints the path(s) created and next steps (add to a page, write a story/test).

## Generated file template (example: CourseCard)

```astro
---
interface Props {
  title: string;
  description: string;
  slug: string;
  duration?: string;
  price?: string;
}

const { title, description, slug, duration, price } = Astro.props;
---

<article class="course-card">
  <h3 class="course-card__title">
    <a href={`/kurse/${slug}/`}>{title}</a>
  </h3>
  <p class="course-card__description">{description}</p>
  {duration && <span class="course-card__meta">{duration}</span>}
  {price && <span class="course-card__price">{price}</span>}
</article>

<style>
  .course-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--space-6);
  }
  .course-card__title a {
    color: var(--color-primary);
    text-decoration: none;
  }
  .course-card__title a:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  .course-card__description {
    color: var(--color-text-muted);
    margin-top: var(--space-2);
  }
  .course-card__meta,
  .course-card__price {
    display: inline-block;
    margin-top: var(--space-3);
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
</style>
```

## Accessibility checklist (auto-applied)

- Semantic HTML element chosen for the component's role (`article`, `nav`, `button`, `section`, etc.)
- Interactive elements: `focus-visible` outline using `--color-primary`
- Images: `alt` prop required in `Props` interface
- Buttons: `type="button"` unless explicitly `submit`
- Forms: all inputs have an associated `<label>`
