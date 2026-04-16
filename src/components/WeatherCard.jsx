export default function WeatherCard({ data }) {
  const { name, sys, main, weather, wind } = data
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
  const temp = Math.round(main.temp)
  const feelsLike = Math.round(main.feels_like)

  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-auto text-white">
      {/* Location */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-white/60 text-sm">{sys.country}</p>
        </div>
        <img src={icon} alt={weather[0].description} className="w-16 h-16" />
      </div>

      {/* Temp */}
      <div className="mb-4">
        <span className="text-6xl font-bold">{temp}°C</span>
        <p className="text-white/70 mt-1 capitalize">{weather[0].description}</p>
        <p className="text-white/50 text-sm">Feels like {feelsLike}°C</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-white/50 text-xs mb-1">Humidity</p>
          <p className="font-semibold">{main.humidity}%</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-white/50 text-xs mb-1">Wind</p>
          <p className="font-semibold">{Math.round(wind.speed)} m/s</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-white/50 text-xs mb-1">Pressure</p>
          <p className="font-semibold">{main.pressure} hPa</p>
        </div>
      </div>
    </div>
  )
}
