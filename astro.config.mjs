// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de-CH',
          en: 'en',
        },
      },
    }),
  ],
});
