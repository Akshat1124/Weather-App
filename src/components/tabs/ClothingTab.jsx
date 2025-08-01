import React from 'react'
import { motion } from 'framer-motion'
import { Shirt, Sun, Cloud, Snowflake, Umbrella } from 'lucide-react'
import { useCurrentWeather } from '../../hooks/useWeatherData.js'
import { useWeatherStore } from '../../store/weatherStore.js'
import { useUnitsStore } from '../../store/unitsStore.js'
import { TRANSLATIONS } from '../../utils/config.js'
import { getClothingAdvice } from '../../utils/helpers.js'

const ClothingTab = () => {
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

  const clothingAdvice = getClothingAdvice(convertTemperature(weatherData.main.temp), weatherData.weather[0].main)
  const temp = convertTemperature(weatherData.main.temp)
  const condition = weatherData.weather[0].main

  const getOutfitSuggestions = () => {
    const hotThreshold = units === 'metric' ? 30 : 86
    const warmThreshold = units === 'metric' ? 20 : 68
    const coolThreshold = units === 'metric' ? 10 : 50
    
    if (temp > hotThreshold) {
      return [
        { item: 'Light cotton t-shirt', icon: '👕', reason: 'Breathable fabric' },
        { item: 'Shorts or light pants', icon: '🩳', reason: 'Stay cool' },
        { item: 'Sunglasses', icon: '🕶️', reason: 'UV protection' },
        { item: 'Sun hat', icon: '🧢', reason: 'Shade your face' },
                { item: 'Sandals', icon: '👡', reason: 'Ventilation' }
      ]
    } else if (temp > warmThreshold) {
      return [
        { item: 'Light sweater or cardigan', icon: '🧥', reason: 'Adjust for temperature' },
        { item: 'Jeans or chinos', icon: '👖', reason: 'Comfortable and versatile' },
        { item: 'Sneakers', icon: '👟', reason: 'Good for walking' },
        { item: 'Light jacket', icon: '🧥', reason: 'For evening' }
      ]
    } else if (temp > coolThreshold) {
      return [
        { item: 'Warm sweater', icon: '🧥', reason: 'Insulation' },
        { item: 'Long pants', icon: '👖', reason: 'Leg warmth' },
        { item: 'Closed shoes', icon: '👞', reason: 'Foot protection' },
        { item: 'Light scarf', icon: '🧣', reason: 'Neck warmth' }
      ]
    } else {
      return [
        { item: 'Heavy winter coat', icon: '🧥', reason: 'Maximum warmth' },
        { item: 'Thermal layers', icon: '👔', reason: 'Base insulation' },
        { item: 'Winter boots', icon: '👢', reason: 'Warm & dry feet' },
        { item: 'Gloves', icon: '🧤', reason: 'Hand protection' },
        { item: 'Warm hat', icon: '🧢', reason: 'Heat retention' }
      ]
    }
  }

  const outfitSuggestions = getOutfitSuggestions()

  const getColorSuggestions = () => {
    const hotThreshold = units === 'metric' ? 30 : 86
    
    if (temp > hotThreshold) {
      return { colors: ['White', 'Light Blue', 'Cream', 'Pastels'], reason: 'Light colors reflect heat' }
    } else if (condition === 'Rain') {
      return { colors: ['Dark Blue', 'Black', 'Gray', 'Brown'], reason: 'Hide water stains' }
    } else if (temp < 10) {
      return { colors: ['Black', 'Dark Blue', 'Burgundy', 'Forest Green'], reason: 'Dark colors absorb heat' }
    }
    return { colors: ['Any color works!', 'Express yourself'], reason: 'Perfect weather for any style' }
  }

  const colorSuggestions = getColorSuggestions()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Shirt className="text-purple-500" size={24} />
        <span>{t.clothingAdvice}</span>
      </h3>

      {/* Main Advice Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-400"
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{clothingAdvice.split(' ')[0]}</span>
          <p className="text-gray-700 text-lg">
            {clothingAdvice.substring(clothingAdvice.indexOf(' ') + 1)}
          </p>
        </div>
      </motion.div>

      {/* Temperature-based recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 backdrop-blur-sm rounded-xl p-5"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>🌡️</span>
          <span>Temperature Guide</span>
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className={`p-3 rounded-lg ${temp > (units === 'metric' ? 30 : 86) ? 'bg-red-100 border-2 border-red-300' : 'bg-gray-50'}`}>
            <Sun className="mx-auto mb-2 text-red-500" size={24} />
            <p className="text-sm font-medium">Hot ({units === 'metric' ? '30°C+' : '86°F+'})</p>
            <p className="text-xs text-gray-600">Light & Airy</p>
          </div>
          
          <div className={`p-3 rounded-lg ${temp > (units === 'metric' ? 20 : 68) && temp <= (units === 'metric' ? 30 : 86) ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-50'}`}>
            <Sun className="mx-auto mb-2 text-yellow-500" size={24} />
            <p className="text-sm font-medium">Warm ({units === 'metric' ? '20-30°C' : '68-86°F'})</p>
            <p className="text-xs text-gray-600">Comfortable</p>
          </div>
          
          <div className={`p-3 rounded-lg ${temp > (units === 'metric' ? 10 : 50) && temp <= (units === 'metric' ? 20 : 68) ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'}`}>
            <Cloud className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-sm font-medium">Cool ({units === 'metric' ? '10-20°C' : '50-68°F'})</p>
            <p className="text-xs text-gray-600">Layer Up</p>
          </div>
          
          <div className={`p-3 rounded-lg ${temp <= (units === 'metric' ? 10 : 50) ? 'bg-indigo-100 border-2 border-indigo-300' : 'bg-gray-50'}`}>
            <Snowflake className="mx-auto mb-2 text-indigo-500" size={24} />
            <p className="text-sm font-medium">Cold ({units === 'metric' ? '10°C-' : '50°F-'})</p>
            <p className="text-xs text-gray-600">Bundle Up</p>
          </div>
        </div>
      </motion.div>

      {/* Outfit Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 backdrop-blur-sm rounded-xl p-5"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>👔</span>
          <span>Outfit Suggestions</span>
        </h4>
        
        <div className="space-y-3">
          {outfitSuggestions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-gray-800">{item.item}</span>
              </div>
              <span className="text-sm text-gray-600">{item.reason}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Color Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/60 backdrop-blur-sm rounded-xl p-5"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>🎨</span>
          <span>Color Guide</span>
        </h4>
        
        <div className="space-y-3">
          <p className="text-gray-600 text-sm">{colorSuggestions.reason}</p>
          <div className="flex flex-wrap gap-2">
            {colorSuggestions.colors.map((color, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Weather-specific accessories */}
      {(condition === 'Rain' || condition === 'Drizzle') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-l-4 border-blue-400"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Umbrella className="text-blue-500" size={24} />
            <h4 className="font-semibold text-gray-800">Rainy Weather Essentials</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span>☂️</span>
              <span>Umbrella or raincoat</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>👢</span>
              <span>Waterproof shoes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🎒</span>
              <span>Waterproof bag</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🧥</span>
              <span>Quick-dry materials</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fabric Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5"
      >
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span>🧵</span>
          <span>Fabric Guide</span>
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-green-700 mb-2">Recommended Fabrics:</p>
            <ul className="space-y-1 text-gray-700">
              {temp > 25 ? (
                <>
                  <li>• Cotton (breathable)</li>
                  <li>• Linen (cooling)</li>
                  <li>• Bamboo (moisture-wicking)</li>
                </>
              ) : temp > 15 ? (
                <>
                  <li>• Cotton blends</li>
                  <li>• Light wool</li>
                  <li>• Fleece</li>
                </>
              ) : (
                <>
                  <li>• Wool (insulating)</li>
                  <li>• Thermal materials</li>
                  <li>• Down (warmth)</li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <p className="font-medium text-red-700 mb-2">Avoid:</p>
            <ul className="space-y-1 text-gray-700">
              {temp > 25 ? (
                <>
                  <li>• Heavy fabrics</li>
                  <li>• Synthetic materials</li>
                  <li>• Dark colors</li>
                </>
              ) : (
                <>
                  <li>• Thin materials</li>
                  <li>• Cotton in cold</li>
                  <li>• Non-breathable synthetic</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ClothingTab
