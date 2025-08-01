// Weather utility functions
export const getWeatherIcon = (condition) => {
  const iconMap = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '⛅',
    'broken clouds': '☁️',
    'overcast clouds': '☁️',
    'shower rain': '🌦️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '🌨️',
    'mist': '🌫️',
    'fog': '🌫️',
    'haze': '🌫️',
  }
  
  return iconMap[condition.toLowerCase()] || '🌤️'
}

export const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: 'good', color: 'text-green-500' }
  if (aqi <= 100) return { level: 'moderate', color: 'text-yellow-500' }
  if (aqi <= 150) return { level: 'unhealthy', color: 'text-orange-500' }
  return { level: 'hazardous', color: 'text-red-500' }
}

export const getHealthAdvice = (temp, humidity, aqi) => {
  const advice = []
  
  if (temp > 35) {
    advice.push('🌡️ Very hot weather! Stay hydrated and avoid outdoor activities during peak hours.')
  } else if (temp < 5) {
    advice.push('🧥 Very cold weather! Dress warmly and protect exposed skin.')
  }
  
  if (humidity > 80) {
    advice.push('💧 High humidity! You may feel uncomfortable and sweaty.')
  } else if (humidity < 30) {
    advice.push('🏜️ Low humidity! Stay moisturized and drink water regularly.')
  }
  
  if (aqi > 100) {
    advice.push('😷 Poor air quality! Consider wearing a mask and limiting outdoor activities.')
  }
  
  return advice.length > 0 ? advice : ['✅ Weather conditions are generally good for outdoor activities!']
}

export const getClothingAdvice = (temp, condition) => {
  if (temp > 30) {
    return '👕 Light, breathable clothing recommended. Don\'t forget sunscreen!'
  } else if (temp > 20) {
    return '👔 Comfortable casual wear. Light jacket might be useful.'
  } else if (temp > 10) {
    return '🧥 Wear layers. A jacket or sweater is recommended.'
  } else {
    return '🧤 Heavy winter clothing needed. Gloves, scarf, and warm jacket.'
  }
}

export const getFarmerAdvice = (weatherData) => {
  const { temp, humidity, wind_speed, weather } = weatherData
  const advice = []
  
  if (weather[0].main === 'Rain') {
    advice.push('🌧️ Good for crops that need water. Avoid harvesting today.')
  } else if (weather[0].main === 'Clear' && temp > 25) {
    advice.push('☀️ Excellent for harvesting and drying crops.')
  }
  
  if (wind_speed > 10) {
    advice.push('💨 High winds! Secure loose items and avoid spraying pesticides.')
  }
  
  if (humidity > 85) {
    advice.push('🦠 High humidity may promote fungal diseases. Monitor crops closely.')
  }
  
  return advice.length > 0 ? advice : ['🌱 Normal farming conditions. Continue regular activities.']
}

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

export const kelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15)
}

export const mpsToKmh = (mps) => {
  return Math.round(mps * 3.6)
}
