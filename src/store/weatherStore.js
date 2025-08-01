import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CONFIG } from '../utils/config.js'

export const useWeatherStore = create(
  persist(
    (set, get) => ({
      // App state
      currentCity: CONFIG.DEFAULT_CITY,
      language: CONFIG.DEFAULT_LANGUAGE,
      isLoading: false,
      error: null,
      
      // Weather data
      currentWeather: null,
      forecastWeather: null,
      airQuality: null,
      
      // UI state
      activeTab: 'current',
      showVoiceSettings: false,
      isSpeaking: false,
      
      // User preferences
      voiceEnabled: false,
      units: CONFIG.UNITS,
      
      // Actions
      setCurrentCity: (city) => set({ currentCity: city }),
      setLanguage: (language) => set({ language }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      setCurrentWeather: (weather) => set({ currentWeather: weather }),
      setForecastWeather: (forecast) => set({ forecastWeather: forecast }),
      setAirQuality: (airQuality) => set({ airQuality }),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowVoiceSettings: (show) => set({ showVoiceSettings: show }),
      setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
      
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      setUnits: (units) => set({ units }),
      
      // Clear all weather data
      clearWeatherData: () => set({
        currentWeather: null,
        forecastWeather: null,
        airQuality: null,
        error: null
      }),
      
      // Reset app state
      resetApp: () => set({
        currentCity: CONFIG.DEFAULT_CITY,
        language: CONFIG.DEFAULT_LANGUAGE,
        isLoading: false,
        error: null,
        currentWeather: null,
        forecastWeather: null,
        airQuality: null,
        activeTab: 'current',
        showVoiceSettings: false,
        isSpeaking: false
      })
    }),
    {
      name: 'weather-app-storage',
      partialize: (state) => ({
        language: state.language,
        voiceEnabled: state.voiceEnabled,
        units: state.units,
        currentCity: state.currentCity
      })
    }
  )
)
