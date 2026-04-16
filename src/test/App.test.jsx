import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App integration', () => {
  it('renders the title and search bar on load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search city/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a city name above to get started/i)).toBeInTheDocument()
  })

  it('shows weather card and forecast after searching a valid city', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/search city/i), 'London')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
    })

    // Temp is split into "14°" and "C" by the new design
    expect(screen.getByText(/14°/)).toBeInTheDocument()
    expect(screen.getByText(/broken clouds/i)).toBeInTheDocument()
    expect(screen.getByText(/5-day forecast/i)).toBeInTheDocument()
  })

  it('shows error message for an invalid city', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/search city/i), 'InvalidCity999')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument()
    })
  })

  it('clears previous results when searching a new city', async () => {
    const user = userEvent.setup()
    render(<App />)

    // First search
    await user.type(screen.getByPlaceholderText(/search city/i), 'London')
    await user.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(screen.getByText('London')).toBeInTheDocument())

    // Second search
    await user.clear(screen.getByPlaceholderText(/search city/i))
    await user.type(screen.getByPlaceholderText(/search city/i), 'Paris')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => expect(screen.getByText('London')).toBeInTheDocument())
  })
})
