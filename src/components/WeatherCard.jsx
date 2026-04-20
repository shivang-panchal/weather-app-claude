export default function WeatherCard({ data }) {
  const { name, sys, main, weather, wind } = data
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
  const temp = Math.round(main.temp)
  const feelsLike = Math.round(main.feels_like)

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      {/* Top bar — white */}
      <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.3)' }} />

      <div className="p-6">
        {/* Location row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div
              className="flex items-center gap-1.5 text-xs font-medium mb-1 uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              {sys.country}
            </div>
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {name}
            </h2>
          </div>
          {/* Icon — grayscale */}
          <img
            src={icon}
            alt={weather[0].description}
            className="w-16 h-16"
            style={{ filter: 'grayscale(1) brightness(1.4)' }}
          />
        </div>

        {/* Temperature */}
        <div className="mb-6">
          <div className="flex items-end gap-3 mb-1">
            <span
              className="font-bold text-white leading-none"
              style={{ fontSize: '72px', fontFamily: 'Outfit, sans-serif' }}
            >
              {temp}°
            </span>
            <span className="text-2xl font-light mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>C</span>
          </div>
          <p className="capitalize font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {weather[0].description}
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Feels like {feelsLike}°C
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-5" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Humidity', value: `${main.humidity}%`, icon: '◈' },
            { label: 'Wind', value: `${Math.round(wind.speed)} m/s`, icon: '◎' },
            { label: 'Pressure', value: `${main.pressure}`, unit: 'hPa', icon: '◉' },
          ].map(({ label, value, unit, icon: sym }) => (
            <div
              key={label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-lg mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{sym}</div>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
              <p className="font-semibold text-sm text-white">
                {value}
                {unit && <span className="font-normal text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}> {unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
