import type { Locale } from './index.ts';

/**
 * Single source of truth for every routed page and its DE/EN slug pair.
 *
 * Anything that links across the site (Nav, Footer, language switcher,
 * hreflang) derives from this map so DE and EN slugs can diverge without
 * producing broken links. Keep this in sync with CLAUDE.md §2 (IA table).
 */
export interface RoutePair {
  de: string;
  en: string;
}

export const ROUTES = {
  home: { de: '/', en: '/en/' },

  services: { de: '/dienstleistungen/', en: '/en/services/' },
  servicesCar: { de: '/dienstleistungen/auto/', en: '/en/services/car/' },
  servicesMoto: { de: '/dienstleistungen/motorrad/', en: '/en/services/motorcycle/' },
  servicesTrailer: { de: '/dienstleistungen/anhaenger/', en: '/en/services/trailer/' },

  courses: { de: '/kurse/', en: '/en/courses/' },
  vku: { de: '/vku/', en: '/en/vku/' },
  nothelfer: { de: '/nothelferkurs/', en: '/en/first-aid-course/' },
  theory: { de: '/theoriepruefung/', en: '/en/theory-exam/' },

  licenceWay: { de: '/fuehrerschein/', en: '/en/how-to-get-swiss-licence/' },
  learnerLicence: { de: '/lernfahrausweis/', en: '/en/learner-licence/' },
  drivingLicence: { de: '/fuehrerausweis/', en: '/en/driving-licence/' },
  twoPhase: { de: '/2-phasen-ausbildung/', en: '/en/two-phase-training/' },

  about: { de: '/ueber-uns/', en: '/en/about/' },
  prices: { de: '/preise/', en: '/en/prices/' },
  contact: { de: '/kontakt/', en: '/en/contact/' },
  blog: { de: '/blog/', en: '/en/blog/' },

  impressum: { de: '/impressum/', en: '/en/impressum/' },
  datenschutz: { de: '/datenschutz/', en: '/en/datenschutz/' },
} as const satisfies Record<string, RoutePair>;

export type RouteKey = keyof typeof ROUTES;

const SITE = 'https://drivebuddies.ch';

/** Resolve a route key to a locale-specific path. */
export function route(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale];
}

/** Resolve a route key to a full canonical URL for a locale. */
export function routeUrl(key: RouteKey, locale: Locale): string {
  return `${SITE}${ROUTES[key][locale]}`;
}

/** hreflang pair (absolute URLs) for a given route key. */
export function hreflang(key: RouteKey): { de: string; en: string } {
  return { de: `${SITE}${ROUTES[key].de}`, en: `${SITE}${ROUTES[key].en}` };
}
