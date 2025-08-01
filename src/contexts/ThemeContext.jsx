import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('weather-app-theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    const effectiveTheme = theme === 'auto' ? systemTheme : theme
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Save to localStorage
    localStorage.setItem('weather-app-theme', theme)
  }, [theme, systemTheme])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark'
      if (prevTheme === 'dark') return 'auto'
      return 'light'
    })
  }

  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const getCurrentEffectiveTheme = () => {
    return theme === 'auto' ? systemTheme : theme
  }

  const value = {
    theme,
    systemTheme,
    effectiveTheme: getCurrentEffectiveTheme(),
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: getCurrentEffectiveTheme() === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
