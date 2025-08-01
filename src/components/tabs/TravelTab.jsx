import React from 'react'
import { motion } from 'framer-motion'
import { Plane, Car, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'
import { useCurrentWeather } from '../../hooks/useWeatherData.js'
import { useWeatherStore } from '../../store/weatherStore.js'
import { useUnitsStore } from '../../store/unitsStore.js'
import { TRANSLATIONS } from '../../utils/config.js'

const TravelTab = () => {
  const { language } = useWeatherStore()
  const { convertTemperature, getTemperatureUnit, convertSpeed, getSpeedUnit } = useUnitsStore()
  const { data: weatherData } = useCurrentWeather()
  const t = TRANSLATIONS[language]

  if (!weatherData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Weather data not available</p>
      </div>
    )
  }

  const getTravelConditions = () => {
    const temp = convertTemperature(weatherData.main.temp)
    const condition = weatherData.weather[0].main
    const windSpeed = convertSpeed(weatherData.wind.speed * 3.6) // Convert to local units
    const visibility = weatherData.visibility / 1000 // Convert to km

    const conditions = {
      driving: { score: 0, issues: [], recommendations: [] },
      flying: { score: 0, issues: [], recommendations: [] },
      walking: { score: 0, issues: [], recommendations: [] }
    }

    // Temperature effects
    if (temp < 0) {
      conditions.driving.issues.push('❄️ Icy roads possible')
      conditions.walking.issues.push('🧊 Slippery surfaces')
      conditions.driving.score -= 30
      conditions.walking.score -= 40
    } else if (temp > 35) {
      conditions.driving.issues.push('🌡️ Overheating risk')
      conditions.walking.issues.push('☀️ Heat exhaustion risk')
      conditions.driving.score -= 10
      conditions.walking.score -= 30
    } else {
      conditions.driving.score += 20
      conditions.walking.score += 20
      conditions.flying.score += 20
    }

    // Weather condition effects
    if (condition === 'Rain' || condition === 'Drizzle') {
      conditions.driving.issues.push('🌧️ Wet roads, reduce speed')
      conditions.flying.issues.push('🌧️ Possible delays')
      conditions.walking.issues.push('☔ Need umbrella/raincoat')
      conditions.driving.score -= 20
      conditions.flying.score -= 15
      conditions.walking.score -= 25
    } else if (condition === 'Thunderstorm') {
      conditions.driving.issues.push('⛈️ Dangerous driving conditions')
      conditions.flying.issues.push('⛈️ Flight delays/cancellations likely')
      conditions.walking.issues.push('⛈️ Stay indoors if possible')
      conditions.driving.score -= 40
      conditions.flying.score -= 50
      conditions.walking.score -= 60
    } else if (condition === 'Snow') {
      conditions.driving.issues.push('🌨️ Snow chains may be required')
      conditions.flying.issues.push('🌨️ De-icing delays possible')
      conditions.walking.issues.push('❄️ Wear proper winter gear')
      conditions.driving.score -= 35
      conditions.flying.score -= 30
      conditions.walking.score -= 30
    } else if (condition === 'Clear') {
      conditions.driving.score += 30
      conditions.flying.score += 30
      conditions.walking.score += 30
    }

    // Wind effects
    if (windSpeed > 50) {
      conditions.driving.issues.push('💨 Strong crosswinds')
      conditions.flying.issues.push('💨 Turbulence expected')
      conditions.walking.issues.push('💨 Hold onto belongings')
      conditions.driving.score -= 25
      conditions.flying.score -= 30
      conditions.walking.score -= 20
    } else if (windSpeed > 30) {
      conditions.driving.issues.push('🌬️ Moderate winds')
      conditions.flying.issues.push('🌬️ Slight turbulence')
      conditions.driving.score -= 10
      conditions.flying.score -= 10
    }

    // Visibility effects
    if (visibility < 1) {
      conditions.driving.issues.push('🌫️ Very poor visibility')
      conditions.flying.issues.push('🌫️ Low visibility conditions')
      conditions.driving.score -= 40
      conditions.flying.score -= 35
    } else if (visibility < 5) {
      conditions.driving.issues.push('🌫️ Reduced visibility')
      conditions.flying.issues.push('🌫️ Visibility concerns')
      conditions.driving.score -= 20
      conditions.flying.score -= 15
    }

    // Normalize scores (0-100)
    Object.keys(conditions).forEach(key => {
      conditions[key].score = Math.max(0, Math.min(100, conditions[key].score + 50))
    })

    // Add recommendations based on scores
    Object.keys(conditions).forEach(key => {
      const score = conditions[key].score
      if (score >= 80) {
        conditions[key].recommendations.push('✅ Excellent conditions')
      } else if (score >= 60) {
        conditions[key].recommendations.push('👍 Good conditions')
      } else if (score >= 40) {
        conditions[key].recommendations.push('⚠️ Use caution')
      } else {
        conditions[key].recommendations.push('🚫 Consider postponing')
      }
    })

    return conditions
  }

  const travelConditions = getTravelConditions()

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreIcon = (score) => {
    if (score >= 60) return CheckCircle
    return AlertTriangle
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Plane className="text-blue-500" size={24} />
        <span>{t.travelPlanner}</span>
      </h3>

      {/* Travel Conditions Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Driving */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Car className="text-blue-600" size={24} />
              <h4 className="font-semibold text-gray-800">Driving</h4>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(travelConditions.driving.score)}`}>
              {travelConditions.driving.score}/100
            </div>
          </div>

          <div className="space-y-3">
            {travelConditions.driving.recommendations.map((rec, index) => {
              const Icon = getScoreIcon(travelConditions.driving.score)
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Icon size={16} className={travelConditions.driving.score >= 60 ? 'text-green-500' : 'text-orange-500'} />
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              )
            })}

            {travelConditions.driving.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-800">Considerations:</p>
                {travelConditions.driving.issues.map((issue, index) => (
                  <p key={index} className="text-sm text-gray-600">{issue}</p>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Flying */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Plane className="text-purple-600" size={24} />
              <h4 className="font-semibold text-gray-800">Flying</h4>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(travelConditions.flying.score)}`}>
              {travelConditions.flying.score}/100
            </div>
          </div>

          <div className="space-y-3">
            {travelConditions.flying.recommendations.map((rec, index) => {
              const Icon = getScoreIcon(travelConditions.flying.score)
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Icon size={16} className={travelConditions.flying.score >= 60 ? 'text-green-500' : 'text-orange-500'} />
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              )
            })}

            {travelConditions.flying.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-800">Considerations:</p>
                {travelConditions.flying.issues.map((issue, index) => (
                  <p key={index} className="text-sm text-gray-600">{issue}</p>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Walking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="text-green-600" size={24} />
              <h4 className="font-semibold text-gray-800">Walking</h4>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(travelConditions.walking.score)}`}>
              {travelConditions.walking.score}/100
            </div>
          </div>

          <div className="space-y-3">
            {travelConditions.walking.recommendations.map((rec, index) => {
              const Icon = getScoreIcon(travelConditions.walking.score)
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Icon size={16} className={travelConditions.walking.score >= 60 ? 'text-green-500' : 'text-orange-500'} />
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              )
            })}

            {travelConditions.walking.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-800">Considerations:</p>
                {travelConditions.walking.issues.map((issue, index) => (
                  <p key={index} className="text-sm text-gray-600">{issue}</p>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Weather Details for Travel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>📊</span>
          <span>Current Conditions Summary</span>
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-2xl font-bold text-gray-800">{convertTemperature(weatherData.main.temp)}{getTemperatureUnit()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-2xl font-bold text-gray-800">{convertSpeed(weatherData.wind.speed * 3.6)}</p>
            <p className="text-xs text-gray-500">{getSpeedUnit()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Visibility</p>
            <p className="text-2xl font-bold text-gray-800">{Math.round(weatherData.visibility / 1000)}</p>
            <p className="text-xs text-gray-500">km</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Condition</p>
            <p className="text-lg font-bold text-gray-800 capitalize">{weatherData.weather[0].description}</p>
          </div>
        </div>
      </motion.div>

      {/* Travel Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>💡</span>
          <span>Travel Tips</span>
        </h4>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h5 className="font-medium mb-2">Before You Go:</h5>
            <ul className="space-y-1">
              <li>• Check real-time traffic conditions</li>
              <li>• Verify flight status if flying</li>
              <li>• Pack weather-appropriate gear</li>
              <li>• Plan for longer travel times</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Safety Reminders:</h5>
            <ul className="space-y-1">
              <li>• Keep emergency contacts handy</li>
              <li>• Carry extra water and snacks</li>
              <li>• Share your travel plans</li>
              <li>• Have backup transportation options</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TravelTab
