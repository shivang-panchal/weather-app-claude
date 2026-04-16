import { test, expect } from '@playwright/test'

test.describe('Weather App E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows title and search bar on load', async ({ page }) => {
    await expect(page.getByText('Weather App')).toBeVisible()
    await expect(page.getByPlaceholder(/enter city name/i)).toBeVisible()
    await expect(page.getByText(/enter a city above to get started/i)).toBeVisible()
  })

  test('search button is disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /search/i })).toBeDisabled()
  })

  test('search button enables when user types a city', async ({ page }) => {
    await page.getByPlaceholder(/enter city name/i).fill('London')
    await expect(page.getByRole('button', { name: /search/i })).toBeEnabled()
  })

  test('full search flow — type city, see weather card and forecast', async ({ page }) => {
    await page.getByPlaceholder(/enter city name/i).fill('London')
    await page.getByRole('button', { name: /search/i }).click()

    // Weather card appears with city name
    await expect(page.getByRole('heading', { name: 'London' })).toBeVisible({ timeout: 10000 })

    // Temperature and description
    await expect(page.getByText(/°C/).first()).toBeVisible()

    // Stats
    await expect(page.getByText(/humidity/i)).toBeVisible()
    await expect(page.getByText(/wind/i)).toBeVisible()
    await expect(page.getByText(/pressure/i)).toBeVisible()

    // 5-day forecast
    await expect(page.getByText(/5-day forecast/i)).toBeVisible()
  })

  test('shows error for invalid city name', async ({ page }) => {
    await page.getByPlaceholder(/enter city name/i).fill('xyzinvalidcity999')
    await page.getByRole('button', { name: /search/i }).click()

    await expect(page.getByText(/not found/i)).toBeVisible({ timeout: 10000 })
  })
})
