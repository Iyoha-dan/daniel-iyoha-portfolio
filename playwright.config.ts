import { defineConfig } from '@playwright/test';

// Tests run against the built site. The JSON report feeds the results panel on the homepage,
// so the order is: npm test, then npm run build (npm run deploy does the build).
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: 'src/data/test-run.json' }]],
  use: {
    baseURL: 'http://localhost:4372',
    // The Chrome installed on this machine; swap for `npx playwright install chromium` in CI.
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4372',
    url: 'http://localhost:4372',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
