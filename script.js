// Enhanced Weather App with Advanced Features
// Global variables
let currentCity = '';
let isVoiceEnabled = false;
let currentTheme = localStorage.getItem('weatherAppTheme') || 'light';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize language
    languageManager.updateUI();
    
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Load default city weather if available
    const savedCity = localStorage.getItem('lastSearchedCity');
    if (savedCity) {
        document.getElementById('city-input').value = savedCity;
        getWeather();
    }
    
    // Initialize chat with greeting
    initializeChat();
}

// Set up all event listeners
function setupEventListeners() {
    // City input enter key
    document.getElementById('city-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            getWeather();
        }
    });

    // City dropdown change
    document.getElementById('city-dropdown').addEventListener('change', function() {
        document.getElementById('city-input').value = this.value;
        if (this.value) {
            getWeather();
        }
    });

    // Language selector change
    document.getElementById('language-select').value = languageManager.getCurrentLanguage();
}

// Switch language
function switchLanguage(language) {
    if (languageManager.switchLanguage(language)) {
        // Refresh weather display if available
        if (currentCity) {
            displayAllWeatherData();
        }
        // Update chat messages
        updateChatLanguage();
    }
}

// Main weather fetching function
async function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        showError(languageManager.getText('searchPlaceholder'));
        return;
    }

    currentCity = city;
    localStorage.setItem('lastSearchedCity', city);

    try {
        showLoader();
        hideError();
        
        // Fetch all weather data in parallel
        const [currentWeather, forecast, aqi] = await Promise.all([
            weatherDataManager.getCurrentWeather(city),
            weatherDataManager.getForecast(city),
            weatherDataManager.getAirQuality(city)
        ]);

        // Set data for analyzer
        weatherAnalyzer.setWeatherData(currentWeather, forecast, aqi);

        // Display all data
        displayCurrentWeather(currentWeather);
        displayAirQuality(aqi);
        displayForecast(forecast);
        displayHealthAdvice();
        displayClothingAdvice();
        displayTravelPlanner();
        displayFarmerAdvice();
        displayWeatherAlerts();
        
        // Update dynamic background
        updateBackground(currentWeather.weather[0].main.toLowerCase());
        
        // Show main content
        document.getElementById('main-content').classList.remove('hidden');
        
        // Voice summary if enabled
        if (isVoiceEnabled) {
            generateVoiceSummary(currentWeather);
        }

    } catch (error) {
        showError(error.message);
        console.error('Weather fetch error:', error);
    } finally {
        hideLoader();
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const weatherIcon = getWeatherSVG(data.weather[0].main.toLowerCase());
    const currentTime = getTime(data.timezone);
    
    const weatherResult = `
        <div class="city-name animate-fadeInUp">${data.name}, ${data.sys.country}</div>
        <div class="weather-icon-large animate-fadeInUp">${weatherIcon}</div>
        <div class="temperature animate-fadeInUp">${Math.round(data.main.temp)}°C</div>
        <div class="weather-info animate-fadeInUp">
            <p><i class="fas fa-eye"></i> ${languageManager.getText('weather')}: <span class="weather-description">${data.weather[0].description}</span></p>
            <p><i class="fas fa-tint"></i> ${languageManager.getText('humidity')}: ${data.main.humidity}%</p>
            <p><i class="fas fa-wind"></i> ${languageManager.getText('windSpeed')}: ${data.wind.speed} m/s</p>
            <p><i class="fas fa-clock"></i> ${languageManager.getText('currentTime')}: ${currentTime}</p>
            <p><i class="fas fa-thermometer-half"></i> Feels like: ${Math.round(data.main.feels_like)}°C</p>
            <p><i class="fas fa-compress-arrows-alt"></i> Pressure: ${data.main.pressure} hPa</p>
        </div>
    `;

    document.getElementById('weather-result').innerHTML = weatherResult;
}

// Display Air Quality Index
function displayAirQuality(aqiData) {
    const aqiHtml = `
        <div class="animate-slideIn">
            <h4><i class="fas fa-lungs"></i> ${languageManager.getText('airQuality')}</h4>
            <div class="aqi-value" style="color: ${aqiData.color}">${aqiData.aqi}</div>
            <div class="aqi-level" style="background-color: ${aqiData.color}">
                ${languageManager.getText(aqiData.level.toLowerCase())}
            </div>
            <p style="margin-top: 12px; color: var(--text-secondary); font-size: 0.9rem;">
                ${getAQIDescription(aqiData.level)}
            </p>
        </div>
    `;
    
    document.getElementById('aqi-info').innerHTML = aqiHtml;
}

// Display 5-day forecast
function displayForecast(forecastData) {
    const forecastHtml = forecastData.list
        .filter((item, index) => index % 8 === 0) // Get one per day
        .slice(0, 5)
        .map(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString(languageManager.getCurrentLanguage() === 'hi' ? 'hi-IN' : 'en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            return `
                <div class="forecast-day animate-fadeInUp">
                    <div class="forecast-date">${day}</div>
                    <div class="forecast-icon">${getWeatherSVG(item.weather[0].main.toLowerCase(), 32)}</div>
                    <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
                    <div class="forecast-desc">${item.weather[0].description}</div>
                </div>
            `;
        }).join('');

    document.getElementById('forecast-content').innerHTML = forecastHtml;
}

// Display health advice
function displayHealthAdvice() {
    const healthAdvice = weatherAnalyzer.getHealthAdvice();
    const healthHtml = healthAdvice.map(advice => `
        <div class="advice-item animate-slideIn">
            <div class="icon">${advice.icon}</div>
            <div class="content">
                <h4>${advice.title}</h4>
                <p>${advice.text}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('health-advice-content').innerHTML = healthHtml;
}

// Display clothing advice
function displayClothingAdvice() {
    const clothingAdvice = weatherAnalyzer.getClothingAdvice();
    if (!clothingAdvice) return;

    const clothingHtml = `
        <div class="advice-item animate-slideIn">
            <div class="icon">${clothingAdvice.icon}</div>
            <div class="content">
                <h4>${clothingAdvice.title}</h4>
                <div class="clothing-items">
                    ${clothingAdvice.items.map(item => `<span class="clothing-item">${item}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    document.getElementById('clothing-advice-content').innerHTML = clothingHtml;
}

// Display travel planner
function displayTravelPlanner() {
    const travelAdvice = weatherAnalyzer.getTravelAdvice();
    if (!travelAdvice) return;

    const travelHtml = travelAdvice.map(day => `
        <div class="travel-day animate-slideIn">
            <div>
                <strong>${day.date}</strong>
                <div style="color: var(--text-secondary); margin-top: 4px; display: flex; align-items: center; gap: 8px;">
                    <span>${day.temp}°C</span>
                    <span style="width: 24px; height: 24px;">${getWeatherSVG(day.weather, 24)}</span>
                </div>
            </div>
            <div class="travel-score">
                <div class="score-bar">
                    <div class="score-fill" style="width: ${day.score * 10}%"></div>
                </div>
                <span style="font-weight: 600; color: var(--accent-primary);">${day.recommendation}</span>
            </div>
            <div class="activity-tags">
                ${day.activities.map(activity => `<span class="activity-tag">${activity}</span>`).join('')}
            </div>
        </div>
    `).join('');

    document.getElementById('travel-content').innerHTML = travelHtml;
}

// Display farmer advice
function displayFarmerAdvice() {
    const farmerAdvice = weatherAnalyzer.getFarmerAdvice();
    if (!farmerAdvice) return;

    const farmerHtml = farmerAdvice.map(advice => `
        <div class="farmer-advice animate-slideIn">
            <div class="icon">${advice.icon}</div>
            <div class="content">
                <h4>${advice.category}</h4>
                <p>${advice.text}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('farmer-content').innerHTML = farmerHtml;
}

// Display weather alerts
function displayWeatherAlerts() {
    const alerts = weatherAnalyzer.getWeatherAlerts();
    
    if (alerts.length === 0) {
        document.getElementById('weather-alerts').classList.add('hidden');
        return;
    }

    const alertsHtml = alerts.map(alert => `
        <div class="alert-item ${alert.level} animate-slideIn">
            <div class="icon">${alert.icon}</div>
            <div class="content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('alerts-content').innerHTML = alertsHtml;
    document.getElementById('weather-alerts').classList.remove('hidden');
}

// Update all weather data display (for language changes)
function displayAllWeatherData() {
    if (weatherAnalyzer.currentWeather) {
        displayCurrentWeather(weatherAnalyzer.currentWeather);
        displayAirQuality(weatherAnalyzer.aqi);
        displayForecast(weatherAnalyzer.forecast);
        displayHealthAdvice();
        displayClothingAdvice();
        displayTravelPlanner();
        displayFarmerAdvice();
        displayWeatherAlerts();
    }
}

// Generate voice summary
function generateVoiceSummary(weatherData) {
    const lang = languageManager.getCurrentLanguage();
    const temp = Math.round(weatherData.main.temp);
    const condition = weatherData.weather[0].description;
    const city = weatherData.name;
    
    let summary;
    if (lang === 'hi') {
        summary = `${city} में मौसम: तापमान ${temp} डिग्री सेल्सियस है। मौसम ${condition} है।`;
    } else {
        summary = `Weather in ${city}: Temperature is ${temp} degrees Celsius. Conditions are ${condition}.`;
    }

    voiceManager.speak(summary, lang);
}

// Toggle voice summary
function toggleVoiceSummary() {
    isVoiceEnabled = !isVoiceEnabled;
    const voiceBtn = document.getElementById('voice-toggle');
    
    if (isVoiceEnabled) {
        voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        voiceBtn.style.background = 'var(--accent-secondary)';
    } else {
        voiceBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        voiceBtn.style.background = 'var(--accent-primary)';
        voiceManager.stop();
    }
}

// Chat functionality
function initializeChat() {
    const greeting = weatherChatAssistant.processQuery('hello');
    addChatMessage(greeting, 'assistant');
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Process and add assistant response
    setTimeout(() => {
        const response = weatherChatAssistant.processQuery(message);
        addChatMessage(response, 'assistant');
    }, 500);
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateChatLanguage() {
    // Clear chat and reinitialize with new language
    document.getElementById('chat-messages').innerHTML = '';
    initializeChat();
}

// Geolocation functionality
function getCurrentLocation() {
    if ("geolocation" in navigator) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // Reverse geocoding to get city name
                    const reverseUrl = `${CONFIG.OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=${CONFIG.UNITS}`;
                    const response = await fetch(reverseUrl);
                    const data = await response.json();
                    
                    document.getElementById('city-input').value = data.name;
                    getWeather();
                } catch (error) {
                    showError('Unable to get weather for your location');
                }
            },
            (error) => {
                hideLoader();
                showError('Location access denied');
            }
        );
    } else {
        showError('Geolocation not supported');
    }
}

// Refresh weather data
function refreshWeather() {
    if (currentCity) {
        // Clear cache for current city
        weatherDataManager.cache.delete(`current_${currentCity}`);
        weatherDataManager.cache.delete(`forecast_${currentCity}`);
        getWeather();
    }
}

// Theme toggle
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('weatherAppTheme', currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.querySelector('.quick-actions .quick-btn:last-child i');
    if (themeBtn) {
        themeBtn.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Update background based on weather
function updateBackground(weatherCondition) {
    // Remove existing weather classes
    document.body.className = '';
    
    // Add new weather background class
    const backgroundClass = `${weatherCondition}-background`;
    document.body.classList.add(backgroundClass);
}

// Utility functions
function getWeatherSVG(weatherCondition, size = 48) {
    if (!SVG_WEATHER_ICONS) return '🌤️'; // Fallback emoji if SVG not loaded
    
    const icon = SVG_WEATHER_ICONS[weatherCondition] || SVG_WEATHER_ICONS['clear'];
    // Scale the SVG to the desired size
    return icon.replace(/width="48" height="48"/, `width="${size}" height="${size}"`);
}

function getWeatherEmoji(mainWeather) {
    const emojiMap = {
        clear: '☀️',
        clouds: '☁️',
        rain: '🌧️',
        drizzle: '🌦️',
        thunderstorm: '⛈️',
        snow: '❄️',
        mist: '🌫️',
        smoke: '💨',
        haze: '🌫️',
        dust: '🌪️',
        fog: '🌫️'
    };
    
    return emojiMap[mainWeather.toLowerCase()] || '🌤️';
}

function getTime(timezoneOffset) {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + timezoneOffset * 1000);
    return cityTime.toLocaleTimeString(languageManager.getCurrentLanguage() === 'hi' ? 'hi-IN' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

function getAQIDescription(level) {
    const lang = languageManager.getCurrentLanguage();
    const descriptions = {
        en: {
            Good: 'Air quality is satisfactory, and air pollution poses little or no risk.',
            Moderate: 'Air quality is acceptable; however, some pollutants may be a concern.',
            Unhealthy: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.',
            Hazardous: 'Health warnings of emergency conditions. The entire population is more likely to be affected.'
        },
        hi: {
            Good: 'हवा की गुणवत्ता संतोषजनक है, और हवा प्रदूषण कोई जोखिम नहीं है।',
            Moderate: 'हवा की गुणवत्ता स्वीकार्य है; हालांकि, कुछ प्रदूषक चिंता का कारण हो सकते हैं।',
            Unhealthy: 'सभी को स्वास्थ्य प्रभाव महसूस हो सकते हैं; संवेदनशील समूहों को अधिक गंभीर प्रभाव हो सकते हैं।',
            Hazardous: 'आपातकालीन स्थितियों की स्वास्थ्य चेतावनी। पूरी आबादी प्रभावित हो सकती है।'
        }
    };
    
    return descriptions[lang][level] || descriptions['en'][level];
}

// Show/hide loader and error messages
function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    document.getElementById('error-message').classList.add('hidden');
}
