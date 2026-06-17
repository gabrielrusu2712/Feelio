import { expect, test } from '@playwright/test'

test('app boots and mounts into #root', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/feelio/i)
  await expect(page.locator('#root')).not.toBeEmpty()
})

test('visiting a protected route while unauthenticated redirects to /auth', async ({ page }) => {
  await page.goto('/home')

  await expect(page).toHaveURL(/\/auth$/)
})

test('the demo login flow reaches /home', async ({ page }) => {
  await page.goto('/auth')

  await page.getByRole('button', { name: /login/i }).click()

  await expect(page).toHaveURL(/\/home$/)
})
