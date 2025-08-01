import React from 'react'
import { motion } from 'framer-motion'
import { Sprout, Droplets, Sun, Wind, AlertTriangle, CheckCircle } from 'lucide-react'
import { useCurrentWeather } from '../../hooks/useWeatherData.js'
import { useWeatherStore } from '../../store/weatherStore.js'
import { useUnitsStore } from '../../store/unitsStore.js'
import { TRANSLATIONS } from '../../utils/config.js'
import { getFarmerAdvice } from '../../utils/helpers.js'

const FarmerTab = () => {
  const { language } = useWeatherStore()
  const { units, convertTemperature, getTemperatureUnit } = useUnitsStore()
  const { data: weatherData } = useCurrentWeather()
  const t = TRANSLATIONS[language]

  if (!weatherData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Weather data not available</p>
      </div>
    )
  }

  const farmerAdvice = getFarmerAdvice(weatherData)
  const temp = convertTemperature(weatherData.main.temp)
  const humidity = weatherData.main.humidity
  const windSpeed = weatherData.wind.speed * 3.6
  const condition = weatherData.weather[0].main

  const getCropConditions = () => {
    const conditions = {
      irrigation: { status: 'good', message: '', color: 'text-green-600' },
      planting: { status: 'good', message: '', color: 'text-green-600' },
      harvesting: { status: 'good', message: '', color: 'text-green-600' },
      pestControl: { status: 'good', message: '', color: 'text-green-600' }
    }

    // Irrigation assessment
    if (condition === 'Rain') {
      conditions.irrigation = { status: 'excellent', message: 'Natural irrigation from rain', color: 'text-blue-600' }
    } else if (humidity < 40) {
      conditions.irrigation = { status: 'critical', message: 'Increase irrigation frequency', color: 'text-red-600' }
    } else if (temp > 35) {
      conditions.irrigation = { status: 'important', message: 'Monitor soil moisture closely', color: 'text-orange-600' }
    }

    // Planting assessment
    if (temp < 5 || temp > 40) {
      conditions.planting = { status: 'poor', message: 'Extreme temperatures not suitable', color: 'text-red-600' }
    } else if (condition === 'Thunderstorm') {
      conditions.planting = { status: 'postpone', message: 'Wait for storms to pass', color: 'text-red-600' }
    } else if (temp >= 15 && temp <= 25 && humidity >= 50) {
      conditions.planting = { status: 'excellent', message: 'Ideal conditions for planting', color: 'text-green-600' }
    }

    // Harvesting assessment
    if (condition === 'Rain' || condition === 'Thunderstorm') {
      conditions.harvesting = { status: 'postpone', message: 'Wait for dry conditions', color: 'text-red-600' }
    } else if (condition === 'Clear' && humidity < 70) {
      conditions.harvesting = { status: 'excellent', message: 'Perfect harvesting weather', color: 'text-green-600' }
    } else if (windSpeed > 30) {
      conditions.harvesting = { status: 'caution', message: 'High winds may damage crops', color: 'text-orange-600' }
    }

    // Pest control assessment
    if (windSpeed > 15) {
      conditions.pestControl = { status: 'postpone', message: 'Too windy for spraying', color: 'text-red-600' }
    } else if (condition === 'Rain') {
      conditions.pestControl = { status: 'postpone', message: 'Rain will wash away treatments', color: 'text-red-600' }
    } else if (windSpeed < 10 && temp < 30) {
      conditions.pestControl = { status: 'excellent', message: 'Good conditions for pest control', color: 'text-green-600' }
    }

    return conditions
  }

  const cropConditions = getCropConditions()

  const getSoilConditions = () => {
    let moisture = 'moderate'
    let temperature = 'optimal'
    let workability = 'good'

    if (condition === 'Rain') {
      moisture = 'high'
      workability = 'poor'
    } else if (humidity < 40) {
      moisture = 'low'
    }

    if (temp < 5) {
      temperature = 'too cold'
      workability = 'poor'
    } else if (temp > 35) {
      temperature = 'too hot'
    }

    return { moisture, temperature, workability }
  }

  const soilConditions = getSoilConditions()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="text-green-500" size={20} />
      case 'good': return <CheckCircle className="text-blue-500" size={20} />
      case 'caution': return <AlertTriangle className="text-orange-500" size={20} />
      case 'important': return <AlertTriangle className="text-orange-500" size={20} />
      case 'critical': return <AlertTriangle className="text-red-500" size={20} />
      case 'poor': return <AlertTriangle className="text-red-500" size={20} />
      case 'postpone': return <AlertTriangle className="text-red-500" size={20} />
      default: return <CheckCircle className="text-green-500" size={20} />
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Sprout className="text-green-500" size={24} />
        <span>{t.farmerDashboard}</span>
      </h3>

      {/* Farm Advisory Alerts */}
      <div className="space-y-3">
        {farmerAdvice.map((advice, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-400"
          >
            <p className="text-gray-700 flex items-start space-x-2">
              <span className="text-lg">{advice.split(' ')[0]}</span>
              <span>{advice.substring(advice.indexOf(' ') + 1)}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Farming Activities Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>🌾</span>
          <span>Farming Activity Conditions</span>
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(cropConditions).map(([activity, condition], index) => (
            <motion.div
              key={activity}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-800 capitalize">
                  {activity.replace(/([A-Z])/g, ' $1').trim()}
                </h5>
                {getStatusIcon(condition.status)}
              </div>
              <p className={`text-sm ${condition.color} font-medium`}>
                {condition.status.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600 mt-1">{condition.message}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Soil Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>🏔️</span>
          <span>Soil Conditions</span>
        </h4>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Droplets className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-sm text-gray-600">Moisture</p>
            <p className="font-semibold text-gray-800 capitalize">{soilConditions.moisture}</p>
          </div>
          <div className="text-center">
            <Sun className="mx-auto mb-2 text-orange-500" size={24} />
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="font-semibold text-gray-800 capitalize">{soilConditions.temperature}</p>
          </div>
          <div className="text-center">
            <Sprout className="mx-auto mb-2 text-green-500" size={24} />
            <p className="text-sm text-gray-600">Workability</p>
            <p className="font-semibold text-gray-800 capitalize">{soilConditions.workability}</p>
          </div>
        </div>
      </motion.div>

      {/* Weather Impact on Crops */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>📈</span>
          <span>Weather Impact Assessment</span>
        </h4>

        <div className="space-y-4">
          {/* Temperature Impact */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sun className="text-orange-500" size={20} />
              <h5 className="font-medium text-gray-800">Temperature Impact</h5>
            </div>
            <p className="text-sm text-gray-700">
              {temp < (units === 'metric' ? 10 : 50) ? '❄️ Cold stress possible. Protect sensitive crops.' :
               temp > (units === 'metric' ? 30 : 86) ? '🌡️ Heat stress likely. Increase watering and provide shade.' :
               '✅ Temperature range is optimal for most crops.'}
            </p>
          </div>

          {/* Humidity Impact */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="text-blue-500" size={20} />
              <h5 className="font-medium text-gray-800">Humidity Impact</h5>
            </div>
            <p className="text-sm text-gray-700">
              {humidity > 80 ? '🦠 High humidity increases disease risk. Monitor for fungal issues.' :
               humidity < 40 ? '🏜️ Low humidity may stress plants. Consider misting.' :
               '✅ Humidity levels are suitable for healthy plant growth.'}
            </p>
          </div>

          {/* Wind Impact */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="text-green-500" size={20} />
              <h5 className="font-medium text-gray-800">Wind Impact</h5>
            </div>
            <p className="text-sm text-gray-700">
              {windSpeed > 25 ? '💨 Strong winds may damage plants. Secure support structures.' :
               windSpeed > 15 ? '🌬️ Moderate winds provide good air circulation.' :
               '🍃 Light winds help with pollination and air circulation.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Crop Calendar Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>📅</span>
          <span>Seasonal Recommendations</span>
        </h4>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-purple-700 mb-2">Current Weather Suitable For:</h5>
            <ul className="space-y-1 text-gray-700">
              {temp >= 15 && temp <= 25 && (
                <li>• Planting cool-season crops (lettuce, spinach, peas)</li>
              )}
              {temp >= 20 && temp <= 30 && (
                <li>• Planting warm-season crops (tomatoes, peppers, beans)</li>
              )}
              {condition === 'Clear' && windSpeed < 15 && (
                <li>• Applying fertilizers and pesticides</li>
              )}
              {condition === 'Clear' && humidity < 70 && (
                <li>• Harvesting mature crops</li>
              )}
              <li>• General field maintenance and monitoring</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-pink-700 mb-2">Avoid Today:</h5>
            <ul className="space-y-1 text-gray-700">
              {(condition === 'Rain' || condition === 'Thunderstorm') && (
                <li>• Heavy field work (soil compaction risk)</li>
              )}
              {windSpeed > 15 && (
                <li>• Spraying pesticides or herbicides</li>
              )}
              {temp > 35 && (
                <li>• Transplanting seedlings (heat stress)</li>
              )}
              {humidity > 85 && (
                <li>• Dense plantings (disease risk)</li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default FarmerTab
