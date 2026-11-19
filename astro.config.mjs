// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://favlash.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/404'),
    }),
    react(),
    mdx(),
  ],
  output: 'server',
  adapter: netlify({ imageCDN: process.env.NO_IMAGE_CDN ? false : undefined }),
  // URLs sin diagonal final (/servicios/pestanas), igual que los canonical.
  build: { format: 'file' },
});
