import { expect, test } from '@playwright/test'

// NOTE: Auth is backed by real Firebase, so flows that depend on an
// authenticated session (login, protected-route redirects) need a Firebase
// emulator or test project before they can be exercised here. Until that is
// wired up (Phase 1), this smoke test only verifies the app builds and serves.
test('app builds and serves', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/feelio/i)
})
