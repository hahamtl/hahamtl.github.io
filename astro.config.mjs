import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://linzhu1989.github.io',
  integrations: [sitemap()],
  markdown: { shikiConfig: { theme: 'github-light', themes: { light: 'github-light', dark: 'github-dark' } } },
});
