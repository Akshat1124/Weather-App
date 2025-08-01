import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWeatherStore } from '../store/weatherStore.js'
import { TRANSLATIONS } from '../utils/config.js'

import Header from './Header.jsx'
import CitySearch from './CitySearch.jsx'
import CurrentWeather from './CurrentWeather.jsx'
import WeatherTabs from './WeatherTabs.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import ErrorMessage from './ErrorMessage.jsx'

const WeatherApp = () => {
  const { 
    language, 
    isLoading, 
    error, 
    currentCity,
    setCurrentCity 
  } = useWeatherStore()

  const t = TRANSLATIONS[language]

  // Set default city on app load
  useEffect(() => {
    if (!currentCity) {
      setCurrentCity('Delhi')
    }
  }, [currentCity, setCurrentCity])

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-blue-100/30 dark:bg-gray-800/30"></div>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="weatherPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#weatherPattern)" className="text-indigo-400 dark:text-gray-600"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* City Search */}
            <CitySearch />

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* Loading State */}
            {isLoading && <LoadingSpinner />}

            {/* Weather Content */}
            {!isLoading && !error && (
              <div className="grid gap-6 lg:grid-cols-12">
                {/* Current Weather - Takes more space on larger screens */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:col-span-5"
                >
                  <CurrentWeather />
                </motion.div>

                {/* Weather Tabs - Takes remaining space */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="lg:col-span-7"
                >
                  <WeatherTabs />
                </motion.div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default WeatherApp
