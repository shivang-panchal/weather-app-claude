import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ForecastCard from '../components/ForecastCard'
import { mockForecast } from './mocks/handlers'

describe('ForecastCard', () => {
  it('renders the 5-day forecast heading', () => {
    render(<ForecastCard forecast={mockForecast} />)
    expect(screen.getByText(/5-day forecast/i)).toBeInTheDocument()
  })

  it('renders one row per day (5 days)', () => {
    render(<ForecastCard forecast={mockForecast} />)
    // Each day has a temperature shown
    const temps = screen.getAllByText(/°C/)
    expect(temps).toHaveLength(5)
  })

  it('renders weather descriptions for each day', () => {
    render(<ForecastCard forecast={mockForecast} />)
    expect(screen.getByText(/light rain/i)).toBeInTheDocument()
    expect(screen.getByText(/overcast clouds/i)).toBeInTheDocument()
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument()
  })
})
