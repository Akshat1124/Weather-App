import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { useCurrentWeather, useAirQuality } from '../../hooks/useWeatherData.js'
import { useWeatherStore } from '../../store/weatherStore.js'
import { useUnitsStore } from '../../store/unitsStore.js'
import { TRANSLATIONS } from '../../utils/config.js'
import { getHealthAdvice, getAQILevel } from '../../utils/helpers.js'

const HealthTab = () => {
  const { language } = useWeatherStore()
  const { units, convertTemperature, getTemperatureUnit } = useUnitsStore()
  const { data: weatherData } = useCurrentWeather()
  const { data: airQualityData } = useAirQuality(
    weatherData?.coord?.lat,
    weatherData?.coord?.lon
  )
  const t = TRANSLATIONS[language]

  if (!weatherData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Weather data not available</p>
      </div>
    )
  }

  const aqi = airQualityData?.list?.[0]?.main?.aqi || 2
  const aqiValue = aqi * 50
  const aqiInfo = getAQILevel(aqiValue)
  
  const healthAdvice = getHealthAdvice(
    weatherData.main.temp,
    weatherData.main.humidity,
    aqiValue
  )

  const uvIndex = Math.floor(Math.random() * 11) + 1 // Demo UV index
  const getUVRisk = (uv) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-500', icon: CheckCircle }
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-500', icon: Shield }
    if (uv <= 7) return { level: 'High', color: 'text-orange-500', icon: AlertTriangle }
    return { level: 'Very High', color: 'text-red-500', icon: AlertTriangle }
  }

  const uvRisk = getUVRisk(uvIndex)
  const UVIcon = uvRisk.icon

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Heart className="text-red-500" size={24} />
        <span>{t.healthAdvice}</span>
      </h3>

      {/* Health Alerts */}
      <div className="space-y-4">
        {healthAdvice.map((advice, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border-l-4 border-blue-400"
          >
            <p className="text-gray-700 flex items-start space-x-2">
              <span className="text-lg">{advice.split(' ')[0]}</span>
              <span>{advice.substring(advice.indexOf(' ') + 1)}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Health Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Air Quality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Air Quality Index</h4>
            <div className={`w-3 h-3 rounded-full ${aqiInfo.color.replace('text-', 'bg-')}`}></div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-3xl font-bold text-gray-800">{aqiValue}</span>
              <span className={`font-medium ${aqiInfo.color}`}>
                {t[aqiInfo.level] || aqiInfo.level}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  aqiValue <= 50 ? 'bg-green-500' :
                  aqiValue <= 100 ? 'bg-yellow-500' :
                  aqiValue <= 150 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(aqiValue / 2, 100)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* UV Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-sm rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">{t.uvIndex}</h4>
            <UVIcon className={uvRisk.color} size={20} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-3xl font-bold text-gray-800">{uvIndex}</span>
              <span className={`font-medium ${uvRisk.color}`}>
                {uvRisk.level}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  uvIndex <= 2 ? 'bg-green-500' :
                  uvIndex <= 5 ? 'bg-yellow-500' :
                  uvIndex <= 7 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${(uvIndex / 11) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Comfort Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-sm rounded-xl p-5"
        >
          <h4 className="font-semibold text-gray-800 mb-3">Comfort Level</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Temperature</span>
              <span className="font-medium">
                {convertTemperature(weatherData.main.temp) >= (units === 'metric' ? 20 : 68) && 
                 convertTemperature(weatherData.main.temp) <= (units === 'metric' ? 26 : 79) ? '😊 Comfortable' : 
                 convertTemperature(weatherData.main.temp) < (units === 'metric' ? 20 : 68) ? '🥶 Cool' : '🥵 Hot'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Humidity</span>
              <span className="font-medium">
                {weatherData.main.humidity >= 40 && weatherData.main.humidity <= 60 ? '😊 Ideal' :
                 weatherData.main.humidity < 40 ? '🏜️ Dry' : '💧 Humid'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hydration Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5"
        >
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <span>💧</span>
            <span>Hydration</span>
          </h4>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Recommended water intake based on current conditions:
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {convertTemperature(weatherData.main.temp) > (units === 'metric' ? 30 : 86) ? '3.5L' : 
               convertTemperature(weatherData.main.temp) > (units === 'metric' ? 25 : 77) ? '2.5L' : '2L'}
            </p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </motion.div>
      </div>

      {/* Health Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5"
      >
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <span>💡</span>
          <span>Health Tips</span>
        </h4>
        
        <div className="space-y-2 text-sm text-gray-700">
          {convertTemperature(weatherData.main.temp) > (units === 'metric' ? 30 : 86) && (
            <p>• Stay in air-conditioned areas during peak hours (11 AM - 4 PM)</p>
          )}
          {weatherData.main.humidity > 80 && (
            <p>• Use dehumidifiers or fans to improve air circulation</p>
          )}
          {aqiValue > 100 && (
            <p>• Consider wearing N95 masks when outdoors</p>
          )}
          <p>• Take regular breaks if exercising outdoors</p>
          <p>• Monitor elderly and children more closely in extreme weather</p>
        </div>
      </motion.div>
    </div>
  )
}

export default HealthTab
