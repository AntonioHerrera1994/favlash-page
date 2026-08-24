// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://favlash.com/',
  integrations: [sitemap(), react(), mdx()],
  output: 'server',
  adapter: netlify(),

});