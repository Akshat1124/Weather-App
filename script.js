
document.getElementById('city-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = document.getElementById('city-input').value;
    const apiKey = 'b2b1566f402c2e90c7b7d31f9e71321c'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        
        document.getElementById('loader').classList.remove('hidden');
        document.getElementById('weather-result').classList.add('hidden');
        
        
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }

        const data = await response.json();
        const weatherEmoji = getWeatherEmoji(data.weather[0].main); 

        
        const currentTime = getTime(data.timezone);

        
        const weatherResult = `
            <div class="city-name">${data.name}, ${data.sys.country} ${weatherEmoji}</div>
            <div class="temperature">${data.main.temp}°C</div>
            <div class="weather-info">
                <p>Weather: <span class="weather-description">${data.weather[0].description}</span></p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Current Time: ${currentTime}</p>
            </div>
        `;

        
        document.getElementById('weather-result').innerHTML = weatherResult;
        document.getElementById('weather-result').classList.remove('hidden');
    } catch (error) {
        document.getElementById('weather-result').innerHTML = `<p>${error.message}</p>`;
        document.getElementById('weather-result').classList.remove('hidden');
    } finally {
        
        document.getElementById('loader').classList.add('hidden');
    }
}


function getWeatherEmoji(mainWeather) {
    switch (mainWeather.toLowerCase()) {
        case 'clear':
            return '☀️';    
        case 'clouds':
            return '☁️';  
        case 'rain':
            return '🌧️';  
        case 'thunderstorm':
            return '⛈️';  
        case 'snow':
            return '❄️';  
        case 'mist':
            return '🌫️';  
        default:
            return '';     
    }
}


function getTime(timezoneOffset) {
    const now = new Date();
    
    
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + timezoneOffset * 1000); 

    return cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

