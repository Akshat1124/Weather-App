import { useQuery } from '@tanstack/react-query'
import { weatherService } from '../services/weatherService.js'
import { useWeatherStore } from '../store/weatherStore.js'

// Hook for current weather data
export const useCurrentWeather = () => {
  const { currentCity } = useWeatherStore()
  
  return useQuery({
    queryKey: ['weather', 'current', currentCity],
    queryFn: () => weatherService.getCurrentWeather(currentCity),
    enabled: !!currentCity,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false
  })
}

// Hook for forecast weather data
export const useForecastWeather = () => {
  const { currentCity } = useWeatherStore()
  
  return useQuery({
    queryKey: ['weather', 'forecast', currentCity],
    queryFn: () => weatherService.getForecastWeather(currentCity),
    enabled: !!currentCity,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    refetchOnWindowFocus: false
  })
}

// Hook for air quality data
export const useAirQuality = (lat, lon) => {
  return useQuery({
    queryKey: ['weather', 'air-quality', lat, lon],
    queryFn: () => weatherService.getAirQuality(lat, lon),
    enabled: !!(lat && lon),
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
    refetchOnWindowFocus: false
  })
}
