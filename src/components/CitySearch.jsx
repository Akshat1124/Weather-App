import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Clock, Navigation } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore.js'
import { TRANSLATIONS, CITIES } from '../utils/config.js'
import toast from 'react-hot-toast'

const CitySearch = () => {
  const [searchValue, setSearchValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { language, currentCity, setCurrentCity } = useWeatherStore()
  
  const t = TRANSLATIONS[language]

  const filteredCities = CITIES.filter(city =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleCitySelect = (city) => {
    setCurrentCity(city)
    setSearchValue('')
    setShowSuggestions(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      setCurrentCity(searchValue.trim())
      setSearchValue('')
      setShowSuggestions(false)
    }
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.')
      return
    }

    setIsGettingLocation(true)
    toast.loading('Getting your location...', { id: 'location' })

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Reverse geocoding to get city name
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=b2b1566f402c2e90c7b7d31f9e71321c`
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data.length > 0) {
              const cityName = data[0].name
              setCurrentCity(cityName)
              toast.success(`Location found: ${cityName}`, { id: 'location' })
            } else {
              toast.error('City not found for your location', { id: 'location' })
            }
          } else {
            toast.error('Failed to get city name', { id: 'location' })
          }
        } catch (error) {
          console.error('Error getting city name:', error)
          toast.error('Failed to get city name', { id: 'location' })
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        let errorMessage = 'Failed to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        
        toast.error(errorMessage, { id: 'location' })
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-2xl mx-auto"
    >
      {/* Current Location Display */}
      <div className="flex items-center justify-center mb-4 space-x-2 text-gray-600 dark:text-gray-400">
        <MapPin size={16} />
        <span className="text-sm">
          {t.currentTime}: {new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US')}
        </span>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex">
          {/* Location Button - Left side */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center justify-center w-14 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-slate-200 dark:border-gray-700 rounded-l-2xl shadow-lg text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-all duration-200 disabled:opacity-50"
            title="Use current location"
          >
            <Navigation 
              size={20} 
              className={`${isGettingLocation ? 'animate-spin' : ''} ${isGettingLocation ? 'text-blue-500 dark:text-blue-400' : ''}`} 
            />
          </motion.button>
          
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                setShowSuggestions(e.target.value.length > 0)
              }}
              onFocus={() => setShowSuggestions(searchValue.length > 0)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-4 text-lg text-slate-800 dark:text-gray-200 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-r border-b border-slate-200 dark:border-gray-700 rounded-r-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 placeholder-slate-500 dark:placeholder-gray-400 font-medium"
            />
            
            {currentCity && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {currentCity}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* City Suggestions */}
        {showSuggestions && filteredCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="max-h-60 overflow-y-auto">
              {filteredCities.slice(0, 8).map((city, index) => (
                <motion.button
                  key={city}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150 flex items-center space-x-3 group"
                >
                  <MapPin size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                  <span className="text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {city}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </form>

      {/* Quick City Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {['Delhi', 'Mumbai', 'Bangalore', 'Chennai'].map((city, index) => (
          <motion.button
            key={city}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCitySelect(city)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              currentCity === city
                ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            {city}
          </motion.button>
        ))}
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </motion.div>
  )
}

export default CitySearch
