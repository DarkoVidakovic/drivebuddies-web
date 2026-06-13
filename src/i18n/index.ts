import de from './de.json';
import en from './en.json';

export type Locale = 'de' | 'en';

const strings = { de, en } as const;

export function useTranslations(locale: Locale) {
  return strings[locale];
}

/** Map a DE path to its EN equivalent and vice-versa. */
export function getAlternatePath(currentPath: string, currentLocale: Locale): string {
  if (currentLocale === 'de') {
    return `/en${currentPath === '/' ? '/' : currentPath}`;
  }
  // Strip /en prefix
  const stripped = currentPath.replace(/^\/en/, '') || '/';
  return stripped;
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
