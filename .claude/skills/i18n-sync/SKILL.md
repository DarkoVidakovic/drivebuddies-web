# i18n-sync

Diff the DE and EN content collections, report missing translations, orphan EN pages (no DE source), and stale translations (DE updated after EN was last modified).

## Usage

```
/i18n-sync
/i18n-sync --fix        # attempt to scaffold missing EN stubs
/i18n-sync --strings    # also diff src/i18n/de.json vs en.json for missing keys
```

## What this skill does

1. Lists all `.md` / `.mdx` files under `src/content/` (or `src/pages/`) that are DE source files (no `.en.` in the name).
2. For each DE file, checks whether the paired EN file exists.
3. Compares `git log --format="%ai" -1` timestamps: if DE was committed more recently than EN, flags as potentially stale.
4. If `--strings` is passed, loads `src/i18n/de.json` and `src/i18n/en.json`, then diffs keys:
   - Keys in DE missing from EN → **missing translations**
   - Keys in EN missing from DE → **orphan EN keys** (likely dead code)
5. If `--fix` is passed, creates stub EN files for each missing translation (copies DE file with a `# TRANSLATION NEEDED` header) and scaffolds missing JSON keys with `"PLACEHOLDER"` values.

## Output format

```
## i18n Sync Report — <date>

### Missing EN pages (DE exists, no EN sibling)
- src/content/kurse/nothelfer.md → MISSING: src/content/kurse/nothelfer.en.md

### Potentially stale EN pages (DE newer than EN)
- src/content/kurse/vku.md (DE: 2025-03-10) → src/content/kurse/vku.en.md (EN: 2024-11-05)

### Orphan EN pages (EN exists, no DE source)
- (none)

### Missing string keys (de.json → en.json)
- nav.courses
- footer.legalNotice

### Orphan EN string keys
- (none)

### Summary
Missing: 1 page, 2 strings | Stale: 1 page | Orphan EN: 0
```

Run this before every release to ensure EN content is complete.
