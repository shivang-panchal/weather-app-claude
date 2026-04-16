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
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#080812' }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5 text-xs font-medium text-purple-300 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Live Weather
            </div>
            <h1
              className="text-5xl font-bold tracking-tight text-white mb-2"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Weather<span className="gradient-text">Cast</span>
            </h1>
            <p className="text-white/30 text-sm">Search any city for real-time weather</p>
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} loading={loading} />

          {/* Loading */}
          {loading && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-400"
                    style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                  />
                ))}
              </div>
              <p className="text-white/30 text-sm">Fetching weather data...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 glass rounded-2xl px-5 py-4 flex items-start gap-3">
              <span className="text-red-400 text-lg mt-0.5">⚠</span>
              <p className="text-red-300 text-sm">{error}</p>
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
            <div className="mt-20 text-center">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-white/20 text-sm">Enter a city name above to get started</p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
