import { test, expect } from '@playwright/test'

const BASE = 'https://api.openweathermap.org/data/2.5'

const mockWeather = {
  name: 'London',
  sys: { country: 'GB' },
  main: { temp: 14, feels_like: 13, humidity: 76, pressure: 1019 },
  weather: [{ description: 'broken clouds', icon: '04d' }],
  wind: { speed: 6 },
}

const mockForecast = {
  list: [
    { dt: 1, dt_txt: '2024-04-18 12:00:00', main: { temp: 15 }, weather: [{ description: 'light rain', icon: '10d' }] },
    { dt: 2, dt_txt: '2024-04-19 12:00:00', main: { temp: 17 }, weather: [{ description: 'overcast clouds', icon: '04d' }] },
    { dt: 3, dt_txt: '2024-04-20 12:00:00', main: { temp: 15 }, weather: [{ description: 'clear sky', icon: '01d' }] },
    { dt: 4, dt_txt: '2024-04-21 12:00:00', main: { temp: 15 }, weather: [{ description: 'few clouds', icon: '02d' }] },
    { dt: 5, dt_txt: '2024-04-22 12:00:00', main: { temp: 10 }, weather: [{ description: 'moderate rain', icon: '10d' }] },
  ],
}

test.describe('Weather App E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API routes — no real API key needed in CI
    await page.route(`${BASE}/weather**`, async (route) => {
      const url = route.request().url()
      const city = new URL(url).searchParams.get('q')
      if (city === 'xyzinvalidcity999') {
        await route.fulfill({ status: 404, json: { message: 'city not found' } })
      } else {
        await route.fulfill({ json: mockWeather })
      }
    })

    await page.route(`${BASE}/forecast**`, async (route) => {
      await route.fulfill({ json: mockForecast })
    })

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

    await expect(page.getByText('London').first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/14°C/)).toBeVisible()
    await expect(page.getByText(/broken clouds/i).first()).toBeVisible()
    await expect(page.getByText(/humidity/i)).toBeVisible()
    await expect(page.getByText(/5-day forecast/i)).toBeVisible()
  })

  test('shows error for invalid city name', async ({ page }) => {
    await page.getByPlaceholder(/enter city name/i).fill('xyzinvalidcity999')
    await page.getByRole('button', { name: /search/i }).click()

    await expect(page.getByText(/not found/i)).toBeVisible({ timeout: 5000 })
  })
})
