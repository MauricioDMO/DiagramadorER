import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import node from '@astrojs/node'

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: true,
  integrations: [tailwind(), react()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  adapter: vercel()
})