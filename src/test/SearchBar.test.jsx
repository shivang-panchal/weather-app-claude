import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from '../components/SearchBar'

describe('SearchBar', () => {
  it('renders input and search button', () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />)
    expect(screen.getByPlaceholderText(/search city/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('calls onSearch with trimmed city name on submit', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} loading={false} />)

    await user.type(screen.getByPlaceholderText(/search city/i), '  London  ')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(onSearch).toHaveBeenCalledWith('London')
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('does not call onSearch when input is empty', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} loading={false} />)

    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('disables input and button while loading', () => {
    render(<SearchBar onSearch={vi.fn()} loading={true} />)
    expect(screen.getByPlaceholderText(/search city/i)).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows "..." on button while loading', () => {
    render(<SearchBar onSearch={vi.fn()} loading={true} />)
    expect(screen.getByRole('button')).toHaveTextContent('...')
  })
})
