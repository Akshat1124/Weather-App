import { CONFIG } from '../utils/config.js'

// Weather API service
export const weatherService = {
  // Get current weather data
  async getCurrentWeather(city) {
    try {
      const response = await fetch(
        `${CONFIG.OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=${CONFIG.UNITS}`
      )
      
      if (!response.ok) {
        throw new Error('Weather data not found')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching current weather:', error)
      // Return demo data in case of API failure
      return this.getDemoWeatherData(city)
    }
  },

  // Get 5-day forecast
  async getForecastWeather(city) {
    try {
      const response = await fetch(
        `${CONFIG.OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=${CONFIG.UNITS}`
      )
      
      if (!response.ok) {
        throw new Error('Forecast data not found')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching forecast:', error)
      return this.getDemoForecastData(city)
    }
  },

  // Get air quality data
  async getAirQuality(lat, lon) {
    try {
      // Using OpenWeather Air Pollution API
      const response = await fetch(
        `${CONFIG.OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${CONFIG.OPENWEATHER_API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error('Air quality data not found')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching air quality:', error)
      return this.getDemoAirQualityData()
    }
  },

  // Demo data for fallback
  getDemoWeatherData(city) {
    return {
      name: city,
      main: {
        temp: 25,
        feels_like: 27,
        humidity: 65,
        pressure: 1013
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      wind: {
        speed: 3.5
      },
      visibility: 10000,
      sys: {
        sunrise: Date.now() / 1000 - 7200,
        sunset: Date.now() / 1000 + 7200
      },
      coord: {
        lat: 28.6139,
        lon: 77.2090
      },
      dt: Date.now() / 1000
    }
  },

  getDemoForecastData(city) {
    const now = Date.now() / 1000
    const list = []
    
    for (let i = 0; i < 40; i++) { // 5 days * 8 forecasts per day
      list.push({
        dt: now + (i * 3 * 3600), // Every 3 hours
        main: {
          temp: 20 + Math.random() * 15,
          humidity: 50 + Math.random() * 30
        },
        weather: [{
          main: i % 3 === 0 ? 'Rain' : 'Clear',
          description: i % 3 === 0 ? 'light rain' : 'clear sky',
          icon: i % 3 === 0 ? '10d' : '01d'
        }],
        wind: {
          speed: 2 + Math.random() * 5
        }
      })
    }
    
    return {
      city: { name: city },
      list
    }
  },

  getDemoAirQualityData() {
    return {
      list: [{
        main: {
          aqi: 2 // Moderate
        },
        components: {
          co: 233.0,
          no: 0.01,
          no2: 16.73,
          o3: 60.3,
          so2: 1.47,
          pm2_5: 15.0,
          pm10: 25.0,
          nh3: 2.1
        }
      }]
    }
  }
}
