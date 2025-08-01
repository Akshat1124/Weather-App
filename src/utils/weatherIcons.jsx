// SVG Weather Icons
export const WeatherIcons = {
  // Clear sky / Sunny
  clear: `<svg viewBox="0 0 48 48" class="weather-svg">
    <circle cx="24" cy="24" r="8" fill="#FFD700" stroke="#FF8C00" stroke-width="1"/>
    <g stroke="#FFD700" stroke-width="2" stroke-linecap="round">
      <line x1="24" y1="4" x2="24" y2="8"/>
      <line x1="24" y1="40" x2="24" y2="44"/>
      <line x1="4" y1="24" x2="8" y2="24"/>
      <line x1="40" y1="24" x2="44" y2="24"/>
      <line x1="8.5" y1="8.5" x2="11.3" y2="11.3"/>
      <line x1="36.7" y1="36.7" x2="39.5" y2="39.5"/>
      <line x1="8.5" y1="39.5" x2="11.3" y2="36.7"/>
      <line x1="36.7" y1="11.3" x2="39.5" y2="8.5"/>
    </g>
  </svg>`,

  // Few clouds
  'few clouds': `<svg viewBox="0 0 48 48" class="weather-svg">
    <circle cx="20" cy="20" r="6" fill="#FFD700" stroke="#FF8C00" stroke-width="1"/>
    <g stroke="#FFD700" stroke-width="1.5" stroke-linecap="round">
      <line x1="20" y1="8" x2="20" y2="10"/>
      <line x1="32" y1="20" x2="34" y2="20"/>
      <line x1="28.5" y1="11.5" x2="30" y2="10"/>
      <line x1="28.5" y1="28.5" x2="30" y2="30"/>
    </g>
    <path d="M28 28c0-4 3-7 7-7s7 3 7 7v2c2 0 4 2 4 4s-2 4-4 4H28v-10z" 
          fill="#E6F3FF" stroke="#87CEEB" stroke-width="1"/>
  </svg>`,

  // Scattered clouds
  'scattered clouds': `<svg viewBox="0 0 48 48" class="weather-svg">
    <path d="M12 20c0-5 4-9 9-9s9 4 9 9v2c3 0 6 3 6 6s-3 6-6 6H12v-14z" 
          fill="#E6F3FF" stroke="#87CEEB" stroke-width="1.5"/>
    <path d="M28 32c0-3 2-5 5-5s5 2 5 5v1c2 0 3 1 3 3s-1 3-3 3H28v-7z" 
          fill="#F0F8FF" stroke="#B0C4DE" stroke-width="1"/>
  </svg>`,

  // Broken clouds / Overcast
  'broken clouds': `<svg viewBox="0 0 48 48" class="weather-svg">
    <path d="M8 24c0-6 5-11 11-11s11 5 11 11v3c4 0 7 3 7 7s-3 7-7 7H8v-17z" 
          fill="#D3D3D3" stroke="#A9A9A9" stroke-width="1.5"/>
    <path d="M20 32c0-4 3-7 7-7s7 3 7 7v2c2 0 4 2 4 4s-2 4-4 4H20v-10z" 
          fill="#E8E8E8" stroke="#C0C0C0" stroke-width="1"/>
  </svg>`,

  // Rain
  rain: `<svg viewBox="0 0 48 48" class="weather-svg">
    <path d="M10 22c0-5 4-9 9-9s9 4 9 9v2c3 0 6 3 6 6s-3 6-6 6H10v-14z" 
          fill="#B0C4DE" stroke="#778899" stroke-width="1.5"/>
    <g stroke="#4682B4" stroke-width="2" stroke-linecap="round">
      <line x1="14" y1="32" x2="14" y2="40" class="rain-drop"/>
      <line x1="20" y1="34" x2="20" y2="42" class="rain-drop"/>
      <line x1="26" y1="32" x2="26" y2="40" class="rain-drop"/>
      <line x1="32" y1="34" x2="32" y2="42" class="rain-drop"/>
    </g>
  </svg>`,

  // Heavy rain / Shower rain
  'shower rain': `<svg viewBox="0 0 48 48" class="weather-svg">
    <path d="M8 20c0-6 5-11 11-11s11 5 11 11v3c4 0 7 3 7 7s-3 7-7 7H8v-17z" 
          fill="#696969" stroke="#2F4F4F" stroke-width="1.5"/>
    <g stroke="#4682B4" stroke-width="2.5" stroke-linecap="round">
      <line x1="12" y1="30" x2="12" y2="42" class="heavy-rain"/>
      <line x1="18" y1="32" x2="18" y2="44" class="heavy-rain"/>
      <line x1="24" y1="30" x2="24" y2="42" class="heavy-rain"/>
      <line x1="30" y1="32" x2="30" y2="44" class="heavy-rain"/>
      <line x1="36" y1="30" x2="36" y2="42" class="heavy-rain"/>
    </g>
  </svg>`,

  // Thunderstorm
  thunderstorm: `<svg viewBox="0 0 48 48" class="weather-svg">
    <path d="M6 20c0-7 6-13 13-13s13 6 13 13v3c4 0 8 4 8 8s-4 8-8 8H6v-19z" 
          fill="#2F2F2F" stroke="#000000" stroke-width="1.5"/>
    <g stroke="#4682B4" stroke-width="2" stroke-linecap="round">
      <line x1="12" y1="30" x2="12" y2="38" class="storm-rain"/>
      <line x1="18" y1="32" x2="18" y2="40" class="storm-rain"/>
      <line x1="30" y1="32" x2="30" y2="40" class="storm-rain"/>
    </g>
    <path d="M20 28 L26 36 L22 36 L24 42 L18 34 L22 34 Z" 
          fill="#FFD700" stroke="#FF8C00" stroke-width="1" class="lightning"/>
  </svg>`,

  // Snow
  snow: `<svg viewBox="0 0 48 48" class="weather-svg">
    <path d="M10 22c0-5 4-9 9-9s9 4 9 9v2c3 0 6 3 6 6s-3 6-6 6H10v-14z" 
          fill="#F0F8FF" stroke="#B0C4DE" stroke-width="1.5"/>
    <g fill="#FFFFFF" stroke="#E6E6FA" stroke-width="1">
      <g class="snowflake">
        <circle cx="14" cy="34" r="2"/>
        <line x1="14" y1="30" x2="14" y2="38" stroke-width="1"/>
        <line x1="10" y1="34" x2="18" y2="34" stroke-width="1"/>
        <line x1="11.5" y1="31.5" x2="16.5" y2="36.5" stroke-width="1"/>
        <line x1="16.5" y1="31.5" x2="11.5" y2="36.5" stroke-width="1"/>
      </g>
      <g class="snowflake">
        <circle cx="24" cy="36" r="2"/>
        <line x1="24" y1="32" x2="24" y2="40" stroke-width="1"/>
        <line x1="20" y1="36" x2="28" y2="36" stroke-width="1"/>
        <line x1="21.5" y1="33.5" x2="26.5" y2="38.5" stroke-width="1"/>
        <line x1="26.5" y1="33.5" x2="21.5" y2="38.5" stroke-width="1"/>
      </g>
      <g class="snowflake">
        <circle cx="34" cy="34" r="2"/>
        <line x1="34" y1="30" x2="34" y2="38" stroke-width="1"/>
        <line x1="30" y1="34" x2="38" y2="34" stroke-width="1"/>
        <line x1="31.5" y1="31.5" x2="36.5" y2="36.5" stroke-width="1"/>
        <line x1="36.5" y1="31.5" x2="31.5" y2="36.5" stroke-width="1"/>
      </g>
    </g>
  </svg>`,

  // Mist / Fog
  mist: `<svg viewBox="0 0 48 48" class="weather-svg">
    <g stroke="#B0C4DE" stroke-width="3" stroke-linecap="round" opacity="0.7">
      <line x1="8" y1="16" x2="40" y2="16" class="fog-line"/>
      <line x1="6" y1="22" x2="38" y2="22" class="fog-line"/>
      <line x1="10" y1="28" x2="42" y2="28" class="fog-line"/>
      <line x1="4" y1="34" x2="36" y2="34" class="fog-line"/>
    </g>
  </svg>`,

  // Default fallback
  default: `<svg viewBox="0 0 48 48" class="weather-svg">
    <circle cx="24" cy="24" r="8" fill="#FFD700" stroke="#FF8C00" stroke-width="1"/>
    <path d="M16 32c0-4 3-7 7-7s7 3 7 7v2c2 0 4 2 4 4s-2 4-4 4H16v-10z" 
          fill="#E6F3FF" stroke="#87CEEB" stroke-width="1"/>
  </svg>`
}

// Get weather icon SVG by condition
export const getWeatherIconSVG = (condition, size = 48) => {
  const normalizedCondition = condition.toLowerCase()
  
  // Map various weather conditions to icon keys
  const iconMap = {
    'clear sky': 'clear',
    'clear': 'clear',
    'sunny': 'clear',
    'few clouds': 'few clouds',
    'partly cloudy': 'few clouds',
    'scattered clouds': 'scattered clouds',
    'broken clouds': 'broken clouds',
    'overcast clouds': 'broken clouds',
    'overcast': 'broken clouds',
    'cloudy': 'broken clouds',
    'light rain': 'rain',
    'moderate rain': 'rain',
    'rain': 'rain',
    'drizzle': 'rain',
    'shower rain': 'shower rain',
    'heavy rain': 'shower rain',
    'thunderstorm': 'thunderstorm',
    'snow': 'snow',
    'light snow': 'snow',
    'heavy snow': 'snow',
    'mist': 'mist',
    'fog': 'mist',
    'haze': 'mist',
    'smoke': 'mist'
  }

  const iconKey = iconMap[normalizedCondition] || 'default'
  const svgContent = WeatherIcons[iconKey]
  
  // Replace size and add dynamic classes
  return svgContent
    .replace('viewBox="0 0 48 48"', `viewBox="0 0 48 48" width="${size}" height="${size}"`)
    .replace('class="weather-svg"', `class="weather-svg weather-${iconKey.replace(' ', '-')}"`)
}

// Enhanced weather icon component that returns JSX
export const WeatherIconComponent = ({ condition, size = 48, className = '' }) => {
  const normalizedCondition = condition.toLowerCase()
  
  // Map various weather conditions to icon keys
  const iconMap = {
    'clear sky': 'clear',
    'clear': 'clear',
    'sunny': 'clear',
    'few clouds': 'few clouds',
    'partly cloudy': 'few clouds',
    'scattered clouds': 'scattered clouds',
    'broken clouds': 'broken clouds',
    'overcast clouds': 'broken clouds',
    'overcast': 'broken clouds',
    'cloudy': 'broken clouds',
    'light rain': 'rain',
    'moderate rain': 'rain',
    'rain': 'rain',
    'drizzle': 'rain',
    'shower rain': 'shower rain',
    'heavy rain': 'shower rain',
    'thunderstorm': 'thunderstorm',
    'snow': 'snow',
    'light snow': 'snow',
    'heavy snow': 'snow',
    'mist': 'mist',
    'fog': 'mist',
    'haze': 'mist',
    'smoke': 'mist'
  }

  const iconKey = iconMap[normalizedCondition] || 'default'
  const svgContent = WeatherIcons[iconKey]
  
  if (!svgContent) {
    return <div className={`text-4xl ${className}`}>🌤️</div>
  }
  
  return (
    <div 
      className={`weather-icon-container ${className}`}
      style={{ fontSize: `${size}px`, width: `${size}px`, height: `${size}px` }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
