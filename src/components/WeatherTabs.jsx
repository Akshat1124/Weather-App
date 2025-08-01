import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Activity, Shirt, Plane, Sprout, MessageCircle } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore.js'
import { TRANSLATIONS } from '../utils/config.js'

import ForecastTab from './tabs/ForecastTab.jsx'
import HealthTab from './tabs/HealthTab.jsx'
import ClothingTab from './tabs/ClothingTab.jsx'
import TravelTab from './tabs/TravelTab.jsx'
import FarmerTab from './tabs/FarmerTab.jsx'
import ChatTab from './tabs/ChatTab.jsx'

const WeatherTabs = () => {
  const { activeTab, setActiveTab, language } = useWeatherStore()
  const t = TRANSLATIONS[language]

  const tabs = [
    { id: 'forecast', label: t.forecast, icon: Calendar, component: ForecastTab },
    { id: 'health', label: t.healthAdvice, icon: Activity, component: HealthTab },
    { id: 'clothing', label: t.clothingAdvice, icon: Shirt, component: ClothingTab },
    { id: 'travel', label: t.travelPlanner, icon: Plane, component: TravelTab },
    { id: 'farmer', label: t.farmerDashboard, icon: Sprout, component: FarmerTab },
    { id: 'chat', label: t.chatAssistant, icon: MessageCircle, component: ChatTab },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ForecastTab

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-700">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </motion.div>
      </div>
    </div>
  )
}

export default WeatherTabs
