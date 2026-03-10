import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    screenshot: 'on', // Робити скриншот після кожного тесту
    video: 'on',      // Записувати відео кожного тесту
  },
  reporter: [['html', { open: 'never' }]], // Звіт у форматі HTML
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});