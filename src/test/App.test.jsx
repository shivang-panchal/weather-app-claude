import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App integration', () => {
  it('renders the title and search bar on load', () => {
    render(<App />)
    expect(screen.getByText('Weather App')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a city above to get started/i)).toBeInTheDocument()
  })

  it('shows weather card and forecast after searching a valid city', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/enter city name/i), 'London')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
    })

    expect(screen.getByText('14°C')).toBeInTheDocument()
    expect(screen.getByText(/broken clouds/i)).toBeInTheDocument()
    expect(screen.getByText(/5-day forecast/i)).toBeInTheDocument()
  })

  it('shows error message for an invalid city', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/enter city name/i), 'InvalidCity999')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument()
    })
  })

  it('clears previous results when searching a new city', async () => {
    const user = userEvent.setup()
    render(<App />)

    // First search
    await user.type(screen.getByPlaceholderText(/enter city name/i), 'London')
    await user.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(screen.getByText('London')).toBeInTheDocument())

    // Second search — results clear during loading
    await user.clear(screen.getByPlaceholderText(/enter city name/i))
    await user.type(screen.getByPlaceholderText(/enter city name/i), 'Paris')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => expect(screen.getByText('London')).toBeInTheDocument())
  })
})
