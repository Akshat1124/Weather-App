import React from 'react'
import { motion } from 'framer-motion'
import { Settings, Volume2, VolumeX, Moon, Sun, Monitor, Check } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore.js'
import { useUnitsStore } from '../store/unitsStore.js'
import { useTheme } from '../contexts/ThemeContext'
import { TRANSLATIONS, CONFIG } from '../utils/config.js'

const Header = () => {
  const { 
    language, 
    setLanguage, 
    voiceEnabled, 
    setVoiceEnabled,
    showVoiceSettings,
    setShowVoiceSettings 
  } = useWeatherStore()

  const { units, setUnits, getTemperatureUnit } = useUnitsStore()
  const { theme, setTheme, isDark } = useTheme()

  const t = TRANSLATIONS[language]

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  const toggleSettings = () => {
    setShowVoiceSettings(!showVoiceSettings)
  }

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* App Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🌤️</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {t.appTitle}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Smart Weather Intelligence</p>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-800 hover:shadow-lg transition-all duration-200"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light')}
              className="p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              title={`Theme: ${theme}`}
            >
              {theme === 'light' ? <Sun size={18} /> : theme === 'dark' ? <Moon size={18} /> : <Monitor size={18} />}
            </motion.button>

            {/* Voice Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoice}
              className={`p-2 rounded-lg transition-all duration-200 ${
                voiceEnabled 
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/70' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
            >
              {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSettings}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              title={t.settings}
            >
              <Settings size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* Settings Panel */}
        {showVoiceSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">{t.settings}</h3>
            <div className="space-y-4">
              {/* Voice Settings */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Voice Announcements</span>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Hear weather updates spoken aloud</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={toggleVoice}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {/* Language Selection */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{t.language}</span>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Choose your preferred language</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(CONFIG.LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Temperature Unit */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Temperature Unit</span>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Celsius or Fahrenheit</p>
                </div>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="text-sm border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="metric">Celsius (°C)</option>
                  <option value="imperial">Fahrenheit (°F)</option>
                </select>
              </div>

              {/* Auto-refresh */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Auto Refresh</span>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Automatically update weather data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Weather Alerts</span>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Get notified about severe weather</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Theme Selection */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Theme</span>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Choose app appearance</p>
                </div>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="text-sm border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              {/* Apply Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowVoiceSettings(false)
                    // Could add a toast notification here
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <Check size={18} />
                  Apply Settings
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header
