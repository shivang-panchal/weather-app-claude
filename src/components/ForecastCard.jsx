export default function ForecastCard({ forecast }) {
  const daily = forecast.list.filter((entry) =>
    entry.dt_txt.includes('12:00:00')
  ).slice(0, 5)

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif' }}
      >
        5-Day Forecast
      </h3>

      <div className="flex flex-col gap-2">
        {daily.map((day, index) => {
          const date = new Date(day.dt_txt)
          const isToday = index === 0
          const dayLabel = isToday
            ? 'Today'
            : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`
          const temp = Math.round(day.main.temp)

          return (
            <div
              key={day.dt}
              className="flex items-center justify-between rounded-2xl px-4 py-3"
              style={{
                background: isToday ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                border: isToday ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="w-32 text-sm font-medium"
                style={{ color: isToday ? '#fff' : 'rgba(255,255,255,0.45)' }}
              >
                {dayLabel}
              </span>

              <div className="flex items-center gap-2 flex-1">
                <img
                  src={icon}
                  alt={day.weather[0].description}
                  className="w-8 h-8"
                  style={{ filter: 'grayscale(1) brightness(1.4)' }}
                />
                <span className="text-xs capitalize hidden sm:block" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {day.weather[0].description}
                </span>
              </div>

              <span
                className="font-bold text-sm"
                style={{
                  color: isToday ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {temp}°C
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
