import { useState } from 'react'
import axios from 'axios'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastCard from './components/ForecastCard'

const API_KEY = import.meta.env.VITE_WEATHER_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export default function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(city) {
    setLoading(true)
    setError(null)
    setWeather(null)
    setForecast(null)

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`),
        axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`),
      ])
      setWeather(weatherRes.data)
      setForecast(forecastRes.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`City "${city}" not found. Please check the spelling and try again.`)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 py-12">
      <div className="max-w-md mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather App</h1>
          <p className="text-white/50 text-sm">Search any city to see live weather</p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Loading */}
        {loading && (
          <div className="mt-10 text-center text-white/60 animate-pulse">
            Fetching weather data...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {weather && !loading && (
          <div className="mt-6 flex flex-col gap-4">
            <WeatherCard data={weather} />
            {forecast && <ForecastCard forecast={forecast} />}
          </div>
        )}

        {/* Empty state */}
        {!weather && !loading && !error && (
          <div className="mt-16 text-center text-white/30 text-sm">
            Enter a city above to get started
          </div>
        )}
      </div>
    </div>
  )
}
