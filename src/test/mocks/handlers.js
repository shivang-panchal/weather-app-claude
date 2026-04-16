import { http, HttpResponse } from 'msw'

export const mockWeather = {
  name: 'London',
  sys: { country: 'GB' },
  main: { temp: 14, feels_like: 13, humidity: 76, pressure: 1019 },
  weather: [{ description: 'broken clouds', icon: '04d' }],
  wind: { speed: 6 },
}

export const mockForecast = {
  list: [
    {
      dt: 1,
      dt_txt: '2024-04-18 12:00:00',
      main: { temp: 15 },
      weather: [{ description: 'light rain', icon: '10d' }],
    },
    {
      dt: 2,
      dt_txt: '2024-04-19 12:00:00',
      main: { temp: 17 },
      weather: [{ description: 'overcast clouds', icon: '04d' }],
    },
    {
      dt: 3,
      dt_txt: '2024-04-20 12:00:00',
      main: { temp: 15 },
      weather: [{ description: 'clear sky', icon: '01d' }],
    },
    {
      dt: 4,
      dt_txt: '2024-04-21 12:00:00',
      main: { temp: 15 },
      weather: [{ description: 'few clouds', icon: '02d' }],
    },
    {
      dt: 5,
      dt_txt: '2024-04-22 12:00:00',
      main: { temp: 10 },
      weather: [{ description: 'moderate rain', icon: '10d' }],
    },
  ],
}

const BASE = 'https://api.openweathermap.org/data/2.5'

export const handlers = [
  http.get(`${BASE}/weather`, ({ request }) => {
    const city = new URL(request.url).searchParams.get('q')
    if (city === 'InvalidCity999') {
      return HttpResponse.json({ message: 'city not found' }, { status: 404 })
    }
    return HttpResponse.json(mockWeather)
  }),

  http.get(`${BASE}/forecast`, () => {
    return HttpResponse.json(mockForecast)
  }),
]
