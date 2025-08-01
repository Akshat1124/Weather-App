import { useState, useCallback } from 'react'
import { useWeatherStore } from '../store/weatherStore.js'

export const useVoice = () => {
  const { voiceEnabled, isSpeaking, setIsSpeaking } = useWeatherStore()
  const [isSupported, setIsSupported] = useState(
    typeof window !== 'undefined' && 'speechSynthesis' in window
  )

  const speak = useCallback((text, lang = 'en-US') => {
    if (!isSupported || !voiceEnabled || isSpeaking) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }, [isSupported, voiceEnabled, isSpeaking, setIsSpeaking])

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported, setIsSpeaking])

  const generateWeatherSummary = useCallback((weatherData, language = 'en') => {
    if (!weatherData) return ''

    const { name, main, weather, wind } = weatherData
    const temp = Math.round(main.temp)
    const condition = weather[0].description

    if (language === 'hi') {
      return `${name} में मौसम: तापमान ${temp} डिग्री सेल्सियस, ${condition}, हवा की गति ${Math.round(wind.speed * 3.6)} किमी प्रति घंटा, नमी ${main.humidity} प्रतिशत।`
    }

    return `Weather in ${name}: Temperature ${temp} degrees Celsius, ${condition}, wind speed ${Math.round(wind.speed * 3.6)} kilometers per hour, humidity ${main.humidity} percent.`
  }, [])

  return {
    speak,
    stop,
    generateWeatherSummary,
    isSupported,
    isSpeaking
  }
}
