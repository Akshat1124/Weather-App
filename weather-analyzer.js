// Weather Analysis and Advisory System
class WeatherAnalyzer {
    constructor() {
        this.currentWeather = null;
        this.forecast = null;
        this.aqi = null;
    }

    // Set weather data for analysis
    setWeatherData(current, forecast, aqi) {
        this.currentWeather = current;
        this.forecast = forecast;
        this.aqi = aqi;
    }

    // Generate health advice based on current conditions
    getHealthAdvice() {
        if (!this.currentWeather) return [];

        const advice = [];
        const temp = this.currentWeather.main.temp;
        const humidity = this.currentWeather.main.humidity;
        const uvIndex = this.getUVIndex(); // Estimate UV based on time and weather

        const lang = languageManager.getCurrentLanguage();

        // Temperature-based advice
        if (temp > 35) {
            advice.push({
                icon: '🔥',
                title: lang === 'hi' ? 'गर्मी की चेतावनी' : 'Heat Warning',
                text: lang === 'hi' ? 
                    'बहुत गर्मी है! छाया में रहें, पानी पिएं, और बाहर न निकलें।' : 
                    'Extreme heat! Stay in shade, drink water, and avoid outdoor activities.'
            });
        } else if (temp < 5) {
            advice.push({
                icon: '🥶',
                title: lang === 'hi' ? 'ठंड की चेतावनी' : 'Cold Warning',
                text: lang === 'hi' ? 
                    'बहुत ठंड है! गर्म कपड़े पहनें और हाइपोथर्मिया से बचें।' : 
                    'Extreme cold! Wear warm clothes and prevent hypothermia.'
            });
        }

        // Humidity-based advice
        if (humidity > 80) {
            advice.push({
                icon: '💧',
                title: lang === 'hi' ? 'उच्च आर्द्रता' : 'High Humidity',
                text: lang === 'hi' ? 
                    'उच्च आर्द्रता है। सूती कपड़े पहनें और हाइड्रेटेड रहें।' : 
                    'High humidity. Wear cotton clothes and stay hydrated.'
            });
        }

        // UV Index advice
        if (uvIndex > 7) {
            advice.push({
                icon: '☀️',
                title: lang === 'hi' ? 'UV चेतावनी' : 'UV Warning',
                text: lang === 'hi' ? 
                    'उच्च UV इंडेक्स! सनस्क्रीन लगाएं और धूप का चश्मा पहनें।' : 
                    'High UV Index! Apply sunscreen and wear sunglasses.'
            });
        }

        // AQI-based advice
        if (this.aqi && this.aqi.aqi > 100) {
            advice.push({
                icon: '😷',
                title: lang === 'hi' ? 'वायु प्रदूषण' : 'Air Pollution',
                text: lang === 'hi' ? 
                    'खराब वायु गुणवत्ता! मास्क पहनें और घर के अंदर रहें।' : 
                    'Poor air quality! Wear a mask and stay indoors.'
            });
        }

        return advice.length > 0 ? advice : [{
            icon: '✅',
            title: lang === 'hi' ? 'अच्छा मौसम' : 'Good Weather',
            text: lang === 'hi' ? 
                'मौसम अच्छा है! बाहरी गतिविधियों का आनंद लें।' : 
                'Weather is good! Enjoy outdoor activities.'
        }];
    }

    // Generate clothing recommendations
    getClothingAdvice() {
        if (!this.currentWeather) return null;

        const temp = this.currentWeather.main.temp;
        const weather = this.currentWeather.weather[0].main.toLowerCase();
        const lang = languageManager.getCurrentLanguage();

        let advice = {
            icon: '👕',
            title: lang === 'hi' ? 'कपड़ों की सलाह' : 'Clothing Advice',
            text: '',
            items: []
        };

        // Temperature-based clothing
        if (temp > 30) {
            advice.items = lang === 'hi' ? 
                ['हल्के रंग के कपड़े', 'सूती कपड़े', 'टोपी', 'धूप का चश्मा'] :
                ['Light colored clothes', 'Cotton fabrics', 'Hat', 'Sunglasses'];
        } else if (temp > 20) {
            advice.items = lang === 'hi' ? 
                ['आरामदायक कपड़े', 'जैकेट (शाम के लिए)', 'स्नीकर्स'] :
                ['Comfortable clothes', 'Light jacket (for evening)', 'Sneakers'];
        } else if (temp > 10) {
            advice.items = lang === 'hi' ? 
                ['जैकेट', 'लंबी पैंट', 'बंद जूते', 'स्वेटर'] :
                ['Jacket', 'Long pants', 'Closed shoes', 'Sweater'];
        } else {
            advice.items = lang === 'hi' ? 
                ['भारी कोट', 'गर्म कपड़े', 'दस्ताने', 'टोपी', 'बूट्स'] :
                ['Heavy coat', 'Warm clothes', 'Gloves', 'Beanie', 'Boots'];
        }

        // Weather-specific additions
        if (weather.includes('rain')) {
            advice.items.push(lang === 'hi' ? 'छाता' : 'Umbrella');
            advice.items.push(lang === 'hi' ? 'रेनकोट' : 'Raincoat');
        }

        if (weather.includes('snow')) {
            advice.items.push(lang === 'hi' ? 'वाटरप्रूफ जूते' : 'Waterproof boots');
            advice.items.push(lang === 'hi' ? 'गर्म मोज़े' : 'Warm socks');
        }

        advice.text = advice.items.join(', ');
        return advice;
    }

    // Analyze weather for travel planning
    getTravelAdvice() {
        if (!this.forecast) return null;

        const lang = languageManager.getCurrentLanguage();
        const days = this.forecast.list.slice(0, 5); // Next 5 days
        const recommendations = [];

        days.forEach((day, index) => {
            const date = new Date(day.dt * 1000);
            const temp = day.main.temp;
            const weather = day.weather[0].main.toLowerCase();
            const rain = day.rain ? day.rain['3h'] || 0 : 0;

            let score = 10; // Perfect score
            let activities = [];
            let warnings = [];

            // Score based on temperature
            if (temp >= 20 && temp <= 28) {
                score += 2; // Perfect temperature
            } else if (temp >= 15 && temp <= 35) {
                score -= 1; // Acceptable
            } else {
                score -= 3; // Not ideal
            }

            // Score based on weather conditions
            if (weather === 'clear') {
                score += 2;
                activities.push(lang === 'hi' ? 'पिकनिक' : 'Picnic');
                activities.push(lang === 'hi' ? 'ट्रेकिंग' : 'Hiking');
            } else if (weather === 'clouds') {
                score += 0;
                activities.push(lang === 'hi' ? 'सैर' : 'Walking');
            } else if (weather === 'rain') {
                score -= 2;
                warnings.push(lang === 'hi' ? 'बारिश हो सकती है' : 'Rain expected');
                activities.push(lang === 'hi' ? 'म्यूजियम' : 'Museums');
            }

            // Score based on rain
            if (rain > 5) {
                score -= 2;
            }

            recommendations.push({
                date: date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                }),
                score: Math.max(0, Math.min(10, score)),
                temp: Math.round(temp),
                weather: weather,
                activities: activities,
                warnings: warnings,
                recommendation: this.getScoreText(score, lang)
            });
        });

        return recommendations;
    }

    // Get farmer-specific advice
    getFarmerAdvice() {
        if (!this.currentWeather || !this.forecast) return null;

        const lang = languageManager.getCurrentLanguage();
        const temp = this.currentWeather.main.temp;
        const humidity = this.currentWeather.main.humidity;
        const windSpeed = this.currentWeather.wind.speed;
        
        // Calculate expected rainfall from forecast
        let expectedRain = 0;
        this.forecast.list.slice(0, 8).forEach(item => { // Next 24 hours
            if (item.rain) {
                expectedRain += item.rain['3h'] || 0;
            }
        });

        const advice = [];

        // Temperature advice
        if (temp > 35) {
            advice.push({
                icon: '🌡️',
                category: lang === 'hi' ? 'तापमान चेतावनी' : 'Temperature Alert',
                text: lang === 'hi' ? 
                    'बहुत गर्मी है। फसलों को अधिक पानी दें और दोपहर में काम न करें।' :
                    'Very hot weather. Water crops more and avoid working in afternoon.'
            });
        } else if (temp < 5) {
            advice.push({
                icon: '❄️',
                category: lang === 'hi' ? 'ठंड चेतावनी' : 'Cold Alert',
                text: lang === 'hi' ? 
                    'पाला पड़ सकता है। फसलों को ढकें और पानी छिड़कें।' :
                    'Frost possible. Cover crops and sprinkle water for protection.'
            });
        }

        // Rainfall advice
        if (expectedRain > 10) {
            advice.push({
                icon: '🌧️',
                category: lang === 'hi' ? 'बारिश पूर्वानुमान' : 'Rain Forecast',
                text: lang === 'hi' ? 
                    `अगले 24 घंटों में ${expectedRain.toFixed(1)}mm बारिश संभावित है। खेत की जल निकासी जांचें।` :
                    `${expectedRain.toFixed(1)}mm rain expected in next 24 hours. Check field drainage.`
            });
        } else if (expectedRain < 1 && humidity < 40) {
            advice.push({
                icon: '💧',
                category: lang === 'hi' ? 'सिंचाई सलाह' : 'Irrigation Advice',
                text: lang === 'hi' ? 
                    'सूखा मौसम है। फसलों की सिंचाई करें और मिट्टी की नमी जांचें।' :
                    'Dry weather ahead. Irrigate crops and check soil moisture.'
            });
        }

        // Wind advice
        if (windSpeed > 10) {
            advice.push({
                icon: '💨',
                category: lang === 'hi' ? 'हवा चेतावनी' : 'Wind Alert',
                text: lang === 'hi' ? 
                    'तेज़ हवा चल रही है। कमजोर पौधों को सहारा दें।' :
                    'Strong winds. Provide support to weak plants.'
            });
        }

        return advice;
    }

    // Generate weather alerts
    getWeatherAlerts() {
        if (!this.currentWeather) return [];

        const alerts = [];
        const temp = this.currentWeather.main.temp;
        const weather = this.currentWeather.weather[0].main.toLowerCase();
        const lang = languageManager.getCurrentLanguage();

        // Extreme temperature alerts
        if (temp > 40) {
            alerts.push({
                level: 'danger',
                icon: '🔥',
                title: lang === 'hi' ? 'गंभीर गर्मी चेतावनी' : 'Severe Heat Warning',
                message: lang === 'hi' ? 
                    'बहुत खतरनाक गर्मी! तुरंत ठंडी जगह जाएं।' :
                    'Dangerous heat levels! Seek immediate shelter.'
            });
        } else if (temp < 0) {
            alerts.push({
                level: 'danger',
                icon: '🥶',
                title: lang === 'hi' ? 'गंभीर ठंड चेतावनी' : 'Severe Cold Warning',
                message: lang === 'hi' ? 
                    'हिमीकरण का खतरा! गर्म कपड़े पहनें।' :
                    'Freezing temperatures! Wear warm clothing.'
            });
        }

        // Storm alerts
        if (weather === 'thunderstorm') {
            alerts.push({
                level: 'warning',
                icon: '⛈️',
                title: lang === 'hi' ? 'तूफान चेतावनी' : 'Storm Warning',
                message: lang === 'hi' ? 
                    'गरज-चमक के साथ बारिश। घर के अंदर रहें।' :
                    'Thunderstorm activity. Stay indoors.'
            });
        }

        return alerts;
    }

    // Helper methods
    getUVIndex() {
        // Simplified UV calculation based on time and weather
        const hour = new Date().getHours();
        const weather = this.currentWeather.weather[0].main.toLowerCase();
        
        let uvIndex = 0;
        if (hour >= 10 && hour <= 16) {
            uvIndex = weather === 'clear' ? 8 : weather === 'clouds' ? 5 : 3;
        } else if (hour >= 8 && hour <= 18) {
            uvIndex = weather === 'clear' ? 5 : weather === 'clouds' ? 3 : 1;
        }
        
        return uvIndex;
    }

    getScoreText(score, lang) {
        if (score >= 8) {
            return lang === 'hi' ? 'बहुत अच्छा' : 'Excellent';
        } else if (score >= 6) {
            return lang === 'hi' ? 'अच्छा' : 'Good';
        } else if (score >= 4) {
            return lang === 'hi' ? 'ठीक' : 'Fair';
        } else {
            return lang === 'hi' ? 'खराब' : 'Poor';
        }
    }
}

// Chat Assistant for Natural Language Queries
class WeatherChatAssistant {
    constructor() {
        this.weatherAnalyzer = null;
        this.responses = this.initializeResponses();
    }

    // Set weather analyzer reference
    setWeatherAnalyzer(analyzer) {
        this.weatherAnalyzer = analyzer;
    }

    // Initialize response patterns
    initializeResponses() {
        return {
            en: {
                greeting: [
                    "Hello! I'm your weather assistant. Ask me about weather conditions!",
                    "Hi there! What would you like to know about the weather?",
                    "Welcome! I can help you with weather information and advice."
                ],
                temperature: [
                    "The current temperature is {temp}°C.",
                    "It's {temp}°C right now.",
                    "Temperature is currently {temp}°C."
                ],
                rain: [
                    "Rain is {status} today.",
                    "Rainfall chances are {status}.",
                    "It's {status} to rain today."
                ],
                advice: [
                    "Based on current conditions, I recommend: {advice}",
                    "Here's my advice: {advice}",
                    "Consider this: {advice}"
                ],
                error: [
                    "I'm sorry, I don't understand that question.",
                    "Could you please rephrase your question?",
                    "I can help with weather-related questions."
                ]
            },
            hi: {
                greeting: [
                    "नमस्ते! मैं आपका मौसम सहायक हूं। मुझसे मौसम के बारे में पूछें!",
                    "हैलो! आप मौसम के बारे में क्या जानना चाहते हैं?",
                    "स्वागत है! मैं आपको मौसम की जानकारी दे सकता हूं।"
                ],
                temperature: [
                    "वर्तमान तापमान {temp}°C है।",
                    "अभी {temp}°C तापमान है।",
                    "तापमान अभी {temp}°C है।"
                ],
                rain: [
                    "आज बारिश {status} है।",
                    "बारिश की संभावना {status} है।",
                    "आज बारिश {status}।"
                ],
                advice: [
                    "मौजूदा स्थिति के आधार पर, मैं सुझाता हूं: {advice}",
                    "यहां मेरी सलाह है: {advice}",
                    "इस पर विचार करें: {advice}"
                ],
                error: [
                    "माफ़ करें, मैं यह सवाल नहीं समझ पाया।",
                    "कृपया अपना सवाल दोबारा पूछें।",
                    "मैं मौसम संबंधी सवालों में मदद कर सकता हूं।"
                ]
            }
        };
    }

    // Process user query and return response
    processQuery(query) {
        const lang = languageManager.getCurrentLanguage();
        const lowerQuery = query.toLowerCase();
        
        // Check for greeting
        if (this.isGreeting(lowerQuery)) {
            return this.getRandomResponse('greeting', lang);
        }

        // Check for temperature queries
        if (this.isTemperatureQuery(lowerQuery)) {
            return this.getTemperatureResponse(lang);
        }

        // Check for rain queries
        if (this.isRainQuery(lowerQuery)) {
            return this.getRainResponse(lang);
        }

        // Check for advice queries
        if (this.isAdviceQuery(lowerQuery)) {
            return this.getAdviceResponse(lang);
        }

        // Default response
        return this.getRandomResponse('error', lang);
    }

    // Helper methods for query detection
    isGreeting(query) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'namaste', 'namaskar'];
        return greetings.some(greeting => query.includes(greeting));
    }

    isTemperatureQuery(query) {
        const tempKeywords = ['temperature', 'temp', 'hot', 'cold', 'degrees', 'celsius', 'तापमान', 'गर्मी', 'ठंड'];
        return tempKeywords.some(keyword => query.includes(keyword));
    }

    isRainQuery(query) {
        const rainKeywords = ['rain', 'raining', 'precipitation', 'shower', 'wet', 'बारिश', 'बरसात', 'पानी'];
        return rainKeywords.some(keyword => query.includes(keyword));
    }

    isAdviceQuery(query) {
        const adviceKeywords = ['advice', 'recommend', 'should', 'wear', 'clothing', 'सलाह', 'सुझाव', 'क्या पहनें'];
        return adviceKeywords.some(keyword => query.includes(keyword));
    }

    // Response generators
    getTemperatureResponse(lang) {
        if (!this.weatherAnalyzer || !this.weatherAnalyzer.currentWeather) {
            return lang === 'hi' ? 'तापमान की जानकारी उपलब्ध नहीं है।' : 'Temperature information not available.';
        }

        const temp = Math.round(this.weatherAnalyzer.currentWeather.main.temp);
        const template = this.getRandomResponse('temperature', lang);
        return template.replace('{temp}', temp);
    }

    getRainResponse(lang) {
        if (!this.weatherAnalyzer || !this.weatherAnalyzer.currentWeather) {
            return lang === 'hi' ? 'बारिश की जानकारी उपलब्ध नहीं है।' : 'Rain information not available.';
        }

        const weather = this.weatherAnalyzer.currentWeather.weather[0].main.toLowerCase();
        let status;
        
        if (weather.includes('rain')) {
            status = lang === 'hi' ? 'हो रही' : 'expected';
        } else if (weather.includes('cloud')) {
            status = lang === 'hi' ? 'संभावित' : 'possible';
        } else {
            status = lang === 'hi' ? 'नहीं होगी' : 'not expected';
        }

        const template = this.getRandomResponse('rain', lang);
        return template.replace('{status}', status);
    }

    getAdviceResponse(lang) {
        if (!this.weatherAnalyzer) {
            return lang === 'hi' ? 'सलाह उपलब्ध नहीं है।' : 'Advice not available.';
        }

        const clothingAdvice = this.weatherAnalyzer.getClothingAdvice();
        if (clothingAdvice && clothingAdvice.items.length > 0) {
            const advice = clothingAdvice.items.slice(0, 2).join(' और ');
            const template = this.getRandomResponse('advice', lang);
            return template.replace('{advice}', advice);
        }

        return lang === 'hi' ? 'मौसम अच्छा है।' : 'Weather is good.';
    }

    getRandomResponse(type, lang) {
        const responses = this.responses[lang][type];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize global analyzer and chat assistant
window.weatherAnalyzer = new WeatherAnalyzer();
window.weatherChatAssistant = new WeatherChatAssistant();
window.weatherChatAssistant.setWeatherAnalyzer(window.weatherAnalyzer);
