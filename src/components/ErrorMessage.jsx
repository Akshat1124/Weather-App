import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useWeatherStore } from '../store/weatherStore.js'

const ErrorMessage = ({ message }) => {
  const { setError } = useWeatherStore()

  const handleDismiss = () => {
    setError(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertCircle className="text-red-500" size={20} />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{message}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <X size={20} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ErrorMessage
