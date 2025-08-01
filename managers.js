// Language Management System
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('weatherAppLanguage') || CONFIG.DEFAULT_LANGUAGE;
        this.translations = TRANSLATIONS;
    }

    // Get translated text
    getText(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Switch language
    switchLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('weatherAppLanguage', language);
            this.updateUI();
            return true;
        }
        return false;
    }

    // Update all UI elements with current language
    updateUI() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = this.getText(key);
            } else {
                element.textContent = this.getText(key);
            }
        });

        // Update language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }

        // Update page title
        document.title = this.getText('appTitle');
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get language direction (for RTL support in future)
    getDirection() {
        return 'ltr'; // Default to left-to-right
    }
}

// Voice Manager for Text-to-Speech
class VoiceManager {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.currentLanguage = 'en';
        this.loadVoices();
    }

    // Load available voices
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        if (this.voices.length === 0) {
            // Voices not loaded yet, try again
            this.synthesis.onvoiceschanged = () => {
                this.voices = this.synthesis.getVoices();
            };
        }
    }

    // Get appropriate voice for language
    getVoiceForLanguage(language) {
        const languageMap = {
            'en': ['en-US', 'en-GB', 'en'],
            'hi': ['hi-IN', 'hi']
        };

        const preferredLangs = languageMap[language] || ['en-US'];
        
        for (const prefLang of preferredLangs) {
            const voice = this.voices.find(v => v.lang.startsWith(prefLang));
            if (voice) return voice;
        }
        
        return this.voices[0] || null;
    }

    // Speak text
    speak(text, language = 'en') {
        if (!this.synthesis) {
            console.warn('Text-to-speech not supported');
            return;
        }

        // Stop any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = this.getVoiceForLanguage(language);
        
        if (voice) {
            utterance.voice = voice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        this.synthesis.speak(utterance);
    }

    // Stop speaking
    stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }
}

// Weather Data Manager
class WeatherDataManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    }

    // Get cached data if available and fresh
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    // Set cached data
    setCachedData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Fetch current weather
    async getCurrentWeather(city) {
        const cacheKey = `current_${city}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        const url = `${CONFIG.OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=${CONFIG.UNITS}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            const data = await response.json();
            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch weather: ${error.message}`);
        }
    }

    // Fetch 5-day forecast
    async getForecast(city) {
        const cacheKey = `forecast_${city}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        const url = `${CONFIG.OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=${CONFIG.UNITS}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Forecast data not found');
            }
            const data = await response.json();
            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch forecast: ${error.message}`);
        }
    }

    // Get Air Quality Index (demo implementation)
    async getAirQuality(city) {
        // Demo data for AQI (replace with real API)
        if (CONFIG.DEMO_MODE) {
            return this.getDemoAQI(city);
        }
        
        // Real AQI API implementation would go here
        // const url = `${CONFIG.AIR_QUALITY_BASE_URL}/city?city=${city}&state=&country=&key=${CONFIG.AIR_QUALITY_API_KEY}`;
        
        return this.getDemoAQI(city);
    }

    // Demo AQI data
    getDemoAQI(city) {
        const aqiData = {
            'Delhi': { aqi: 156, level: 'Unhealthy', color: '#ff6b6b' },
            'Mumbai': { aqi: 98, level: 'Moderate', color: '#ffa726' },
            'London': { aqi: 45, level: 'Good', color: '#66bb6a' },
            'New York': { aqi: 52, level: 'Good', color: '#66bb6a' },
            'Tokyo': { aqi: 78, level: 'Moderate', color: '#ffa726' },
            'Sydney': { aqi: 32, level: 'Good', color: '#66bb6a' }
        };
        
        return aqiData[city] || { aqi: 65, level: 'Moderate', color: '#ffa726' };
    }
}

// Initialize global managers
window.languageManager = new LanguageManager();
window.voiceManager = new VoiceManager();
window.weatherDataManager = new WeatherDataManager();
