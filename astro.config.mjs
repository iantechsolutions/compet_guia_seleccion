import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'static', // use 'server' for SSR (obtain data when rerquested and not statically built)
  integrations: [tailwind(), preact()],
  // adapter: node({ // Enable if useing output: 'server'
  //   mode: "standalone"
  // })
});