export default function ForecastCard({ forecast }) {
  const daily = forecast.list.filter((entry) =>
    entry.dt_txt.includes('12:00:00')
  ).slice(0, 5)

  return (
    <div className="glass-strong rounded-3xl p-5">
      <h3
        className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4"
        style={{ fontFamily: 'Outfit, sans-serif' }}
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
              className="flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-150"
              style={{
                background: isToday ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                border: isToday ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Day */}
              <span
                className={`w-32 text-sm font-medium ${isToday ? 'text-purple-300' : 'text-white/50'}`}
              >
                {dayLabel}
              </span>

              {/* Icon + description */}
              <div className="flex items-center gap-2 flex-1">
                <img src={icon} alt={day.weather[0].description} className="w-8 h-8" />
                <span className="text-xs text-white/40 capitalize hidden sm:block">
                  {day.weather[0].description}
                </span>
              </div>

              {/* Temp */}
              <span
                className={`font-bold text-sm ${isToday ? 'text-white' : 'text-white/70'}`}
                style={{ fontFamily: 'Outfit, sans-serif' }}
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
