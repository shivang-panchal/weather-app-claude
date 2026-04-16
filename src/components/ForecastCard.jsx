export default function ForecastCard({ forecast }) {
  // forecast is a list of 3-hour entries — pick one per day (noon entry)
  const daily = forecast.list.filter((entry) =>
    entry.dt_txt.includes('12:00:00')
  ).slice(0, 5)

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <h3 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wider">
        5-Day Forecast
      </h3>
      <div className="flex flex-col gap-2">
        {daily.map((day) => {
          const date = new Date(day.dt_txt)
          const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`
          const temp = Math.round(day.main.temp)

          return (
            <div
              key={day.dt}
              className="flex items-center justify-between bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <span className="w-32 text-sm text-white/70">{label}</span>
              <div className="flex items-center gap-1">
                <img src={icon} alt={day.weather[0].description} className="w-8 h-8" />
                <span className="text-xs capitalize text-white/60">
                  {day.weather[0].description}
                </span>
              </div>
              <span className="font-semibold">{temp}°C</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
