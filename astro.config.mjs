// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Replace with the real domain once it is connected in Firebase Hosting.
  site: 'https://daniel-iyoha.web.app',
  server: { port: 4371 },
  build: { format: 'file' },
  devToolbar: { enabled: false },
});
