import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import WeatherCard from '../components/WeatherCard'
import { mockWeather } from './mocks/handlers'

describe('WeatherCard', () => {
  it('renders city name and country', () => {
    render(<WeatherCard data={mockWeather} />)
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('GB')).toBeInTheDocument()
  })

  it('renders rounded temperature', () => {
    render(<WeatherCard data={mockWeather} />)
    // Temp is split into "14°" and "C" in separate elements in the new design
    expect(screen.getByText('14°')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders feels like temperature', () => {
    render(<WeatherCard data={mockWeather} />)
    expect(screen.getByText(/feels like 13°c/i)).toBeInTheDocument()
  })

  it('renders weather description', () => {
    render(<WeatherCard data={mockWeather} />)
    expect(screen.getByText(/broken clouds/i)).toBeInTheDocument()
  })

  it('renders humidity, wind and pressure stats', () => {
    render(<WeatherCard data={mockWeather} />)
    expect(screen.getByText('76%')).toBeInTheDocument()
    expect(screen.getByText('6 m/s')).toBeInTheDocument()
    expect(screen.getByText('1019')).toBeInTheDocument()
  })

  it('renders weather icon', () => {
    render(<WeatherCard data={mockWeather} />)
    const img = screen.getByAltText(/broken clouds/i)
    expect(img).toBeInTheDocument()
    expect(img.src).toContain('04d@2x.png')
  })
})
