// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { ROUTES } from './src/i18n/routes.ts';

const SITE = 'https://drivebuddies.ch';

// Build a path → { de, en } lookup from the central route map so the sitemap
// can emit correct hreflang alternates even where DE/EN slugs diverge.
const pairByPath = new Map();
for (const pair of Object.values(ROUTES)) {
  pairByPath.set(pair.de, pair);
  pairByPath.set(pair.en, pair);
}

/** Resolve the DE/EN alternate pair for an absolute URL, or null. */
function alternatesFor(absUrl) {
  const path = new URL(absUrl).pathname;
  const direct = pairByPath.get(path);
  if (direct) return direct;
  // Blog posts share their slug across locales.
  const post = path.match(/^\/(?:en\/)?blog\/(?!tags\/)([^/]+)\/$/);
  if (post) return { de: `/blog/${post[1]}/`, en: `/en/blog/${post[1]}/` };
  return null;
}

export default defineConfig({
  site: 'https://drivebuddies.ch',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // Exclude noindex / thin pages from the sitemap: 404 and the
      // near-duplicate blog tag listing pages.
      filter: (page) =>
        !/\/404\/?$/.test(page) && !/\/blog\/tags\//.test(page),
      // Emit hreflang alternates (de-CH / en / x-default) from the route map
      // so divergent DE/EN slugs are paired correctly.
      serialize(item) {
        const pair = alternatesFor(item.url);
        if (pair) {
          const de = `${SITE}${pair.de}`;
          const en = `${SITE}${pair.en}`;
          item.links = [
            { lang: 'de-CH', url: de },
            { lang: 'en', url: en },
            { lang: 'x-default', url: de },
          ];
        }
        return item;
      },
    }),
  ],
});
