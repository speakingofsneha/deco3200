import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves this repo at https://speakingofsneha.github.io/deco3200/.
// Locally (npm run dev) everything still runs at http://localhost:4321/deco3200/.
export default defineConfig({
  site: 'https://speakingofsneha.github.io',
  base: '/deco3200',
  integrations: [react()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
