import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = city.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
      {/* Search icon */}
      <div className="absolute left-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Search city..."
        disabled={loading}
        className="flex-1 pl-11 pr-4 py-4 rounded-2xl text-sm font-medium focus:outline-none transition-all duration-200 disabled:opacity-40"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff',
        }}
      />

      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="bw-btn px-6 py-4 rounded-2xl font-semibold text-sm active:scale-95"
      >
        {loading ? '...' : 'Search'}
      </button>
    </form>
  )
}
