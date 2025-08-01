// SVG Weather Icons Collection
const SVG_WEATHER_ICONS = {
  clear: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="8" fill="#FDB813" stroke="#F59E0B" stroke-width="2"/>
      <path d="M24 4V8M24 40V44M44 24H40M8 24H4M38.627 9.373L36.213 11.787M11.787 36.213L9.373 38.627M38.627 38.627L36.213 36.213M11.787 11.787L9.373 9.373" 
            stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="4" fill="#FBBF24" opacity="0.6"/>
    </svg>
  `,
  
  clouds: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 20C36 16.686 33.314 14 30 14C29.302 14 28.636 14.13 28.026 14.366C26.84 11.742 24.062 10 21 10C16.582 10 13 13.582 13 18C13 18.362 13.03 18.718 13.088 19.064C11.284 20.222 10 22.436 10 25C10 28.866 13.134 32 17 32H35C39.418 32 43 28.418 43 24C43 20.686 40.314 18 37 18C36.674 18 36.356 18.038 36.044 18.11" 
            fill="#E5E7EB" stroke="#9CA3AF" stroke-width="1.5"/>
      <circle cx="18" cy="20" r="2" fill="#F3F4F6" opacity="0.8"/>
      <circle cx="32" cy="22" r="1.5" fill="#F3F4F6" opacity="0.6"/>
    </svg>
  `,
  
  rain: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 18C36 14.686 33.314 12 30 12C29.302 12 28.636 12.13 28.026 12.366C26.84 9.742 24.062 8 21 8C16.582 8 13 11.582 13 16C13 16.362 13.03 16.718 13.088 17.064C11.284 18.222 10 20.436 10 23C10 26.866 13.134 30 17 30H35C39.418 30 43 26.418 43 22C43 18.686 40.314 16 37 16C36.674 16 36.356 16.038 36.044 16.11" 
            fill="#93C5FD" stroke="#60A5FA" stroke-width="1.5"/>
      <path d="M16 32L14 36M20 30L18 34M24 32L22 36M28 30L26 34M32 32L30 36" 
            stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="38" r="1" fill="#2563EB" opacity="0.6"/>
      <circle cx="24" cy="38" r="1" fill="#2563EB" opacity="0.6"/>
      <circle cx="32" cy="38" r="1" fill="#2563EB" opacity="0.6"/>
    </svg>
  `,
  
  drizzle: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 18C36 14.686 33.314 12 30 12C29.302 12 28.636 12.13 28.026 12.366C26.84 9.742 24.062 8 21 8C16.582 8 13 11.582 13 16C13 16.362 13.03 16.718 13.088 17.064C11.284 18.222 10 20.436 10 23C10 26.866 13.134 30 17 30H35C39.418 30 43 26.418 43 22C43 18.686 40.314 16 37 16" 
            fill="#BFDBFE" stroke="#93C5FD" stroke-width="1.5"/>
      <path d="M18 30L17 32M22 30L21 32M26 30L25 32M30 30L29 32" 
            stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,
  
  thunderstorm: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 18C36 14.686 33.314 12 30 12C29.302 12 28.636 12.13 28.026 12.366C26.84 9.742 24.062 8 21 8C16.582 8 13 11.582 13 16C13 16.362 13.03 16.718 13.088 17.064C11.284 18.222 10 20.436 10 23C10 26.866 13.134 30 17 30H35C39.418 30 43 26.418 43 22C43 18.686 40.314 16 37 16" 
            fill="#64748B" stroke="#475569" stroke-width="1.5"/>
      <path d="M22 30L18 42L26 36L24 44" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#FDE047"/>
      <circle cx="20" cy="40" r="0.5" fill="#FDE047"/>
      <circle cx="26" cy="42" r="0.5" fill="#FDE047"/>
    </svg>
  `,
  
  snow: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 18C36 14.686 33.314 12 30 12C29.302 12 28.636 12.13 28.026 12.366C26.84 9.742 24.062 8 21 8C16.582 8 13 11.582 13 16C13 16.362 13.03 16.718 13.088 17.064C11.284 18.222 10 20.436 10 23C10 26.866 13.134 30 17 30H35C39.418 30 43 26.418 43 22C43 18.686 40.314 16 37 16" 
            fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
      <g stroke="#E2E8F0" stroke-width="1.5">
        <path d="M16 35L14 33M18 33L16 35M16 31L16 37M14 33L18 37M18 33L14 37"/>
        <path d="M24 37L22 35M26 35L24 37M24 33L24 39M22 35L26 39M26 35L22 39"/>
        <path d="M32 35L30 33M34 33L32 35M32 31L32 37M30 33L34 37M34 33L30 37"/>
      </g>
    </svg>
  `,
  
  mist: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 20H40M8 24H40M8 28H40M8 32H40" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
      <path d="M12 22H36M12 26H36M12 30H36" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
      <circle cx="16" cy="20" r="1" fill="#E5E7EB" opacity="0.4"/>
      <circle cx="32" cy="24" r="0.8" fill="#E5E7EB" opacity="0.4"/>
      <circle cx="20" cy="28" r="0.6" fill="#E5E7EB" opacity="0.4"/>
    </svg>
  `,
  
  haze: `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="6" fill="#FDB813" stroke="#F59E0B" stroke-width="1" opacity="0.4"/>
      <path d="M8 18H40M8 22H40M8 26H40M8 30H40M8 34H40" stroke="#D97706" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
      <path d="M12 20H36M12 24H36M12 28H36M12 32H36" stroke="#FBBF24" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
    </svg>
  `
};

// Export for global use
window.SVG_WEATHER_ICONS = SVG_WEATHER_ICONS;
