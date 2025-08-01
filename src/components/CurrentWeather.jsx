import React from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Droplets, Wind, Eye, Sun, Moon, Volume2 } from 'lucide-react'
import { useCurrentWeather, useAirQuality } from '../hooks/useWeatherData.js'
import { useVoice } from '../hooks/useVoice.js'
import { useWeatherStore } from '../store/weatherStore.js'
import { useUnitsStore } from '../store/unitsStore.js'
import { TRANSLATIONS } from '../utils/config.js'
import { getAQILevel, formatTime } from '../utils/helpers.js'
import { WeatherIconComponent } from '../utils/weatherIcons.jsx'

const CurrentWeather = () => {
  const { language, voiceEnabled } = useWeatherStore()
  const { units, convertTemperature, getTemperatureUnit, convertSpeed, getSpeedUnit, convertPressure, getPressureUnit } = useUnitsStore()
  const { data: weatherData, isLoading, error } = useCurrentWeather()
  const { data: airQualityData } = useAirQuality(
    weatherData?.coord?.lat,
    weatherData?.coord?.lon
  )
  const { speak, generateWeatherSummary, isSpeaking } = useVoice()
  
  const t = TRANSLATIONS[language]

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
        <p className="text-red-500 dark:text-red-400 text-center">Failed to load weather data</p>
      </div>
    )
  }

  const handleVoiceAnnouncement = () => {
    if (voiceEnabled && weatherData) {
      const summary = generateWeatherSummary(weatherData, language)
      speak(summary, language === 'hi' ? 'hi-IN' : 'en-US')
    }
  }

  const aqi = airQualityData?.list?.[0]?.main?.aqi || 2
  const aqiInfo = getAQILevel(aqi * 50) // Convert to standard AQI scale

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{weatherData.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        {voiceEnabled && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceAnnouncement}
            disabled={isSpeaking}
            className={`p-3 rounded-full transition-all duration-200 ${
              isSpeaking 
                ? 'bg-blue-500 dark:bg-blue-600 text-white animate-pulse' 
                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70'
            }`}
            title="Listen to weather summary"
          >
            <Volume2 size={20} />
          </motion.button>
        )}
      </div>

      {/* Main Weather Display */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          <WeatherIconComponent 
            condition={weatherData.weather[0].description}
            size={96}
            className="mx-auto"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className="text-5xl font-bold text-blue-700 dark:text-blue-400">
            {convertTemperature(weatherData.main.temp)}{getTemperatureUnit()}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 capitalize text-lg">
            {weatherData.weather[0].description}
          </p>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t.feelsLike} {convertTemperature(weatherData.main.feels_like)}{getTemperatureUnit()}
          </p>
        </motion.div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <Droplets className="text-blue-500 dark:text-blue-400" size={20} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t.humidity}</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{weatherData.main.humidity}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50/80 dark:bg-green-900/30 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <Wind className="text-green-500 dark:text-green-400" size={20} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t.windSpeed}</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {convertSpeed(weatherData.wind.speed * 3.6)} {getSpeedUnit()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-purple-50/80 dark:bg-purple-900/30 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <Thermometer className="text-purple-500 dark:text-purple-400" size={20} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t.pressure}</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {convertPressure(weatherData.main.pressure)} {getPressureUnit()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-orange-50/80 dark:bg-orange-900/30 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <Eye className="text-orange-500 dark:text-orange-400" size={20} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t.visibility}</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {Math.round(weatherData.visibility / 1000)} km
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sun Times */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-between items-center bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4"
      >
        <div className="flex items-center space-x-2">
          <Sun className="text-orange-500 dark:text-orange-400" size={20} />
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t.sunrise}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {formatTime(weatherData.sys.sunrise)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Moon className="text-indigo-500 dark:text-indigo-400" size={20} />
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t.sunset}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {formatTime(weatherData.sys.sunset)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Air Quality */}
      {airQualityData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t.airQuality}</p>
              <p className={`font-semibold ${aqiInfo.color}`}>
                {t[aqiInfo.level] || aqiInfo.level}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{aqi * 50}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">AQI</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CurrentWeather
