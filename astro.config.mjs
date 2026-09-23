// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portfolio.rudylink.eu',
  trailingSlash: 'ignore',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-GB' } } }),
  ],
  image: { layout: 'constrained' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
