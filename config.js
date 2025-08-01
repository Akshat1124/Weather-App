// API Configuration
const CONFIG = {
    // Weather API
    OPENWEATHER_API_KEY: 'b2b1566f402c2e90c7b7d31f9e71321c',
    OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    
    // Air Quality API (AQI)
    AIR_QUALITY_API_KEY: 'demo', // Replace with real API key
    AIR_QUALITY_BASE_URL: 'http://api.airvisual.com/v2',
    
    // Fallback data for demo purposes
    DEMO_MODE: true,
    
    // Supported languages
    LANGUAGES: {
        en: 'English',
        hi: 'हिंदी'
    },
    
    // Default settings
    DEFAULT_CITY: 'Delhi',
    DEFAULT_LANGUAGE: 'en',
    UNITS: 'metric'
};

// Language translations
const TRANSLATIONS = {
    en: {
        appTitle: 'Smart Weather App 2025',
        searchPlaceholder: 'Enter city name...',
        selectCity: 'Select a city',
        getWeather: 'Get Weather',
        loading: 'Loading...',
        temperature: 'Temperature',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        currentTime: 'Current Time',
        forecast: '5-Day Forecast',
        airQuality: 'Air Quality',
        healthAdvice: 'Health Advice',
        clothingAdvice: 'Clothing Advice',
        travelPlanner: 'Travel Planner',
        farmerDashboard: 'Farmer Dashboard',
        weatherAlerts: 'Weather Alerts',
        voiceSummary: 'Voice Summary',
        chatAssistant: 'Weather Assistant',
        settings: 'Settings',
        language: 'Language',
        good: 'Good',
        moderate: 'Moderate',
        unhealthy: 'Unhealthy',
        hazardous: 'Hazardous'
    },
    hi: {
        appTitle: 'स्मार्ट मौसम ऐप 2025',
        searchPlaceholder: 'शहर का नाम डालें...',
        selectCity: 'एक शहर चुनें',
        getWeather: 'मौसम जानें',
        loading: 'लोड हो रहा है...',
        temperature: 'तापमान',
        humidity: 'नमी',
        windSpeed: 'हवा की गति',
        currentTime: 'वर्तमान समय',
        forecast: '5-दिन का पूर्वानुमान',
        airQuality: 'वायु गुणवत्ता',
        healthAdvice: 'स्वास्थ्य सलाह',
        clothingAdvice: 'कपड़ों की सलाह',
        travelPlanner: 'यात्रा योजनाकार',
        farmerDashboard: 'किसान डैशबोर्ड',
        weatherAlerts: 'मौसम चेतावनी',
        voiceSummary: 'आवाज़ सारांश',
        chatAssistant: 'मौसम सहायक',
        settings: 'सेटिंग्स',
        language: 'भाषा',
        good: 'अच्छा',
        moderate: 'मध्यम',
        unhealthy: 'अस्वस्थ',
        hazardous: 'खतरनाक'
    }
};

// Export for use in other files
window.CONFIG = CONFIG;
window.TRANSLATIONS = TRANSLATIONS;
