import React from 'react'
import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react'
import { useForecastWeather } from '../../hooks/useWeatherData.js'
import { useWeatherStore } from '../../store/weatherStore.js'
import { useUnitsStore } from '../../store/unitsStore.js'
import { TRANSLATIONS } from '../../utils/config.js'
import { formatDate, formatTime } from '../../utils/helpers.js'
import { WeatherIconComponent } from '../../utils/weatherIcons.jsx'

const ForecastTab = () => {
  const { language } = useWeatherStore()
  const { convertTemperature, getTemperatureUnit, convertSpeed, getSpeedUnit } = useUnitsStore()
  const { data: forecastData, isLoading, error } = useForecastWeather()
  const t = TRANSLATIONS[language]

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-20"></div>
        ))}
      </div>
    )
  }

  if (error || !forecastData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load forecast data</p>
      </div>
    )
  }

  // Group forecast data by day (every 8th item = 24 hours)
  const dailyForecasts = []
  for (let i = 0; i < forecastData.list.length; i += 8) {
    const dayData = forecastData.list[i]
    if (dayData) {
      dailyForecasts.push(dayData)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t.forecast}</h3>
      
      {/* 5-Day Forecast Cards */}
      <div className="space-y-3">
        {dailyForecasts.slice(0, 5).map((day, index) => (
          <motion.div
            key={day.dt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Date */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {index === 0 ? 'Today' : formatDate(day.dt)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(day.dt)}
                </p>
              </div>

              {/* Weather Icon & Description */}
              <div className="flex items-center space-x-3 flex-1 justify-center">
                <WeatherIconComponent 
                  condition={day.weather[0].description}
                  size={48}
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600 capitalize">
                    {day.weather[0].description}
                  </p>
                </div>
              </div>

              {/* Temperature */}
              <div className="flex-1 text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {convertTemperature(day.main.temp)}{getTemperatureUnit()}
                </p>
                <p className="text-sm text-gray-500">
                  {convertTemperature(day.main.temp - 5)}° / {convertTemperature(day.main.temp + 2)}°
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Wind size={14} />
                <span>{convertSpeed(day.wind.speed * 3.6)} {getSpeedUnit()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Cloud size={14} />
                <span>{day.main.humidity}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>💧</span>
                <span>{day.pop ? Math.round(day.pop * 100) : 0}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hourly Forecast for Today */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Today's Hourly Forecast</h4>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {forecastData.list.slice(0, 8).map((hour, index) => (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px] hover:bg-white/80 transition-all duration-200"
            >
              <p className="text-xs text-gray-500 mb-2">
                {formatTime(hour.dt)}
              </p>
              <div className="mb-2">
                <WeatherIconComponent 
                  condition={hour.weather[0].description}
                  size={32}
                />
              </div>
              <p className="font-semibold text-gray-800">
                {convertTemperature(hour.main.temp)}{getTemperatureUnit()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {convertSpeed(hour.wind.speed * 3.6)} {getSpeedUnit()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ForecastTab
