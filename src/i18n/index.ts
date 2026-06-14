import de from './de.json';
import en from './en.json';
import { ROUTES } from './routes.ts';

export type Locale = 'de' | 'en';

const strings = { de, en } as const;

export function useTranslations(locale: Locale) {
  return strings[locale];
}

/** Normalise a path so map lookups are trailing-slash insensitive. */
function withSlash(path: string): string {
  if (path === '/' || path === '/en') return path === '/en' ? '/en/' : '/';
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Map a DE path to its EN equivalent and vice-versa.
 *
 * Uses the central ROUTES map so DE/EN slugs that diverge still resolve to a
 * real page. Blog posts share a slug across locales; tag pages have no
 * cross-locale counterpart (tag names differ) so they fall back to the blog
 * index of the other locale.
 */
export function getAlternatePath(currentPath: string, currentLocale: Locale): string {
  const path = withSlash(currentPath);
  const other: Locale = currentLocale === 'de' ? 'en' : 'de';

  // 0. The 404 page is DE-only; switch to the other locale's home.
  if (path === '/404/' || path === '/en/404/') return ROUTES.home[other];

  // 1. Exact match against the route map.
  for (const pair of Object.values(ROUTES)) {
    if (pair[currentLocale] === path) return pair[other];
  }

  // 2. Blog posts keep their slug across locales.
  const postMatch = path.match(/^\/(?:en\/)?blog\/(?!tags\/)([^/]+)\/$/);
  if (postMatch) {
    const slug = postMatch[1];
    return other === 'en' ? `/en/blog/${slug}/` : `/blog/${slug}/`;
  }

  // 3. Tag pages have no reliable counterpart → other-locale blog index.
  if (/^\/(?:en\/)?blog\/tags\//.test(path)) {
    return ROUTES.blog[other];
  }

  // 4. Fallback: naive prefix swap.
  if (currentLocale === 'de') return `/en${path === '/' ? '/' : path}`;
  return path.replace(/^\/en/, '') || '/';
}

/** Return the canonical base URL for a given locale + path. */
export function getCanonicalUrl(site: string, locale: Locale, path: string): string {
  const base = site.replace(/\/$/, '');
  if (locale === 'en') {
    const enPath = path.startsWith('/en') ? path : `/en${path}`;
    return `${base}${enPath}`;
  }
  return `${base}${path}`;
}
