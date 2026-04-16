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
      <div className="absolute left-4 text-white/30 pointer-events-none">
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
        className="flex-1 pl-11 pr-4 py-4 rounded-2xl glass text-white placeholder-white/25 text-sm font-medium focus:outline-none focus:border-purple-500/50 transition-all duration-200 disabled:opacity-40"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      />

      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="px-6 py-4 rounded-2xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.35)',
        }}
      >
        {loading ? '...' : 'Search'}
      </button>
    </form>
  )
}
