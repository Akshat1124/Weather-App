import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Bot, User, Volume2 } from 'lucide-react'
import { useCurrentWeather } from '../../hooks/useWeatherData.js'
import { useVoice } from '../../hooks/useVoice.js'
import { useWeatherStore } from '../../store/weatherStore.js'
import { useUnitsStore } from '../../store/unitsStore.js'
import { TRANSLATIONS } from '../../utils/config.js'

const ChatTab = () => {
  const { convertTemperature, getTemperatureUnit, convertSpeed, getSpeedUnit } = useUnitsStore()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your weather assistant. Ask me anything about the current weather, forecasts, or weather-related advice!',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const { language, voiceEnabled } = useWeatherStore()
  const { data: weatherData } = useCurrentWeather()
  const { speak, isSpeaking } = useVoice()
  const t = TRANSLATIONS[language]

  const getWeatherResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (!weatherData) {
      return "I don't have weather data available right now. Please make sure you've selected a city."
    }

    // Temperature queries
    if (lowerMessage.includes('temperature') || lowerMessage.includes('temp') || lowerMessage.includes('hot') || lowerMessage.includes('cold')) {
      const temp = convertTemperature(weatherData.main.temp)
      const feelsLike = convertTemperature(weatherData.main.feels_like)
      const unit = getTemperatureUnit()
      return `The current temperature in ${weatherData.name} is ${temp}${unit}, but it feels like ${feelsLike}${unit}. ${
        temp > (convertTemperature(30) || 86) ? 'It\'s quite hot! Stay hydrated and avoid direct sunlight.' :
        temp < (convertTemperature(10) || 50) ? 'It\'s quite cold! Dress warmly and layer up.' :
        'The temperature is comfortable for outdoor activities.'
      }`
    }

    // Weather condition queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('condition') || lowerMessage.includes('sky')) {
      const condition = weatherData.weather[0].description
      const main = weatherData.weather[0].main
      return `The current weather in ${weatherData.name} is ${condition}. ${
        main === 'Rain' ? 'Don\'t forget your umbrella!' :
        main === 'Clear' ? 'Perfect weather for outdoor activities!' :
        main === 'Clouds' ? 'It\'s a bit cloudy but still nice.' :
        main === 'Snow' ? 'Bundle up, it\'s snowing!' :
        'Have a great day!'
      }`
    }

    // Humidity queries
    if (lowerMessage.includes('humid') || lowerMessage.includes('moisture')) {
      const humidity = weatherData.main.humidity
      return `The humidity level is ${humidity}%. ${
        humidity > 80 ? 'It\'s quite humid, which might make it feel warmer than it actually is.' :
        humidity < 40 ? 'The air is quite dry. Consider using a humidifier indoors.' :
        'The humidity level is comfortable.'
      }`
    }

    // Wind queries
    if (lowerMessage.includes('wind') || lowerMessage.includes('breeze')) {
      const windSpeed = convertSpeed(weatherData.wind.speed * 3.6)
      const unit = getSpeedUnit()
      return `The wind speed is ${windSpeed} ${unit}. ${
        windSpeed > (convertSpeed(30) || 19) ? 'It\'s quite windy! Secure loose items and be careful when driving.' :
        windSpeed > (convertSpeed(15) || 9) ? 'There\'s a moderate breeze, which feels nice.' :
        'The wind is light and pleasant.'
      }`
    }

    // Clothing advice
    if (lowerMessage.includes('wear') || lowerMessage.includes('cloth') || lowerMessage.includes('dress')) {
      const temp = weatherData.main.temp
      const condition = weatherData.weather[0].main
      
      let advice = ''
      if (temp > 30) {
        advice = 'Wear light, breathable clothing like cotton t-shirts and shorts. Don\'t forget sunscreen and a hat!'
      } else if (temp > 20) {
        advice = 'A light sweater or t-shirt with jeans would be perfect. You might want a light jacket for later.'
      } else if (temp > 10) {
        advice = 'Dress in layers with a warm sweater and jacket. Long pants and closed shoes are recommended.'
      } else {
        advice = 'Bundle up! Wear a heavy coat, warm layers, gloves, and a hat. Winter boots are essential.'
      }
      
      if (condition === 'Rain') {
        advice += ' Also, don\'t forget your umbrella or raincoat!'
      }
      
      return advice
    }

    // Activity suggestions
    if (lowerMessage.includes('activity') || lowerMessage.includes('do') || lowerMessage.includes('plan')) {
      const temp = weatherData.main.temp
      const condition = weatherData.weather[0].main
      
      if (condition === 'Rain') {
        return 'It\'s raining, so indoor activities are best today. How about visiting a museum, shopping mall, or having a cozy day at home?'
      } else if (condition === 'Clear' && temp > 20 && temp < 30) {
        return 'Perfect weather for outdoor activities! Consider hiking, cycling, picnicking, or just taking a nice walk in the park.'
      } else if (temp > 30) {
        return 'It\'s quite hot, so try early morning or evening activities. Swimming, water sports, or indoor air-conditioned activities are great options.'
      } else if (temp < 10) {
        return 'It\'s cold, but still good for winter activities like ice skating, or cozy indoor activities like reading, cooking, or visiting a café.'
      } else {
        return 'The weather is nice for most outdoor activities. Just dress appropriately and enjoy your day!'
      }
    }

    // Rain/precipitation queries
    if (lowerMessage.includes('rain') || lowerMessage.includes('umbrella') || lowerMessage.includes('wet')) {
      const condition = weatherData.weather[0].main
      if (condition === 'Rain' || condition === 'Drizzle') {
        return 'Yes, it\'s raining right now! Don\'t forget your umbrella or raincoat. It\'s a good day to stay cozy indoors or visit indoor attractions.'
      } else {
        return 'No rain currently! The skies are clear, so you won\'t need an umbrella today.'
      }
    }

    // Health advice
    if (lowerMessage.includes('health') || lowerMessage.includes('air quality') || lowerMessage.includes('safe')) {
      const temp = weatherData.main.temp
      const humidity = weatherData.main.humidity
      
      let healthAdvice = 'Here are some health considerations for today: '
      
      if (temp > 35) {
        healthAdvice += 'Stay hydrated and avoid prolonged sun exposure. '
      } else if (temp < 5) {
        healthAdvice += 'Protect exposed skin from cold and stay warm. '
      }
      
      if (humidity > 80) {
        healthAdvice += 'High humidity may make you feel uncomfortable and sweaty. '
      }
      
      healthAdvice += 'Overall, listen to your body and take breaks as needed!'
      
      return healthAdvice
    }

    // Default responses
    const defaultResponses = [
      `Based on the current weather in ${weatherData.name}, I'd say it's ${weatherData.weather[0].description} with a temperature of ${Math.round(weatherData.main.temp)}°C. Is there something specific you'd like to know?`,
      `I can help you with weather information for ${weatherData.name}. What would you like to know about today's weather?`,
      `The weather today is ${weatherData.weather[0].description}. Ask me about temperature, clothing advice, activities, or anything weather-related!`,
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getWeatherResponse(input)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speak(botResponse, language === 'hi' ? 'hi-IN' : 'en-US')
      }
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    "What's the temperature?",
    "Do I need an umbrella?",
    "What should I wear?",
    "Is it good for outdoor activities?",
    "How's the humidity?",
    "Tell me about the wind"
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <MessageCircle className="text-blue-500" size={24} />
        <span>{t.chatAssistant}</span>
      </h3>

      {/* Chat Messages */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg h-96 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                }`}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div className={`p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                } ${message.type === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                  <p className="text-sm">{message.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    
                    {/* Voice button for bot messages */}
                    {message.type === 'bot' && voiceEnabled && (
                      <button
                        onClick={() => speak(message.message, language === 'hi' ? 'hi-IN' : 'en-US')}
                        disabled={isSpeaking}
                        className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about the weather..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Send</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Quick Questions:</h4>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInput(question)}
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-sm hover:from-blue-200 hover:to-purple-200 transition-all duration-200"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatTab
