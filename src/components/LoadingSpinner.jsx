import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-12"
    >
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        
        {/* Inner spinning ring */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-bounce">🌤️</span>
        </div>
      </div>
      
      <div className="ml-4">
        <p className="text-gray-600 font-medium">Loading weather data...</p>
        <p className="text-gray-400 text-sm">Please wait a moment</p>
      </div>
    </motion.div>
  )
}

export default LoadingSpinner
