import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUnitsStore = create(
  persist(
    (set, get) => ({
      units: 'metric', // 'metric' for Celsius, 'imperial' for Fahrenheit
      
      setUnits: (newUnits) => set({ units: newUnits }),
      
      toggleUnits: () => set((state) => ({
        units: state.units === 'metric' ? 'imperial' : 'metric'
      })),
      
      // Helper functions
      getTemperatureUnit: () => {
        const { units } = get()
        return units === 'metric' ? '°C' : '°F'
      },
      
      getSpeedUnit: () => {
        const { units } = get()
        return units === 'metric' ? 'km/h' : 'mph'
      },
      
      getDistanceUnit: () => {
        const { units } = get()
        return units === 'metric' ? 'km' : 'miles'
      },
      
      getPressureUnit: () => {
        const { units } = get()
        return units === 'metric' ? 'hPa' : 'inHg'
      },
      
      // Temperature conversion functions
      convertTemperature: (temp, fromUnit = 'metric') => {
        const { units } = get()
        if (fromUnit === units) return Math.round(temp)
        
        if (fromUnit === 'metric' && units === 'imperial') {
          // Celsius to Fahrenheit
          return Math.round((temp * 9/5) + 32)
        } else if (fromUnit === 'imperial' && units === 'metric') {
          // Fahrenheit to Celsius
          return Math.round((temp - 32) * 5/9)
        }
        
        return Math.round(temp)
      },
      
      // Speed conversion
      convertSpeed: (speed, fromUnit = 'metric') => {
        const { units } = get()
        if (fromUnit === units) return Math.round(speed)
        
        if (fromUnit === 'metric' && units === 'imperial') {
          // km/h to mph
          return Math.round(speed * 0.621371)
        } else if (fromUnit === 'imperial' && units === 'metric') {
          // mph to km/h
          return Math.round(speed * 1.60934)
        }
        
        return Math.round(speed)
      },
      
      // Pressure conversion
      convertPressure: (pressure, fromUnit = 'metric') => {
        const { units } = get()
        if (fromUnit === units) return Math.round(pressure)
        
        if (fromUnit === 'metric' && units === 'imperial') {
          // hPa to inHg
          return (pressure * 0.02953).toFixed(2)
        } else if (fromUnit === 'imperial' && units === 'metric') {
          // inHg to hPa
          return Math.round(pressure * 33.8639)
        }
        
        return Math.round(pressure)
      }
    }),
    {
      name: 'weather-units-storage',
      getStorage: () => localStorage,
    }
  )
)
