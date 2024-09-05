// Add event listener for pressing "Enter" to trigger getWeather
document.getElementById('city-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = document.getElementById('city-input').value;
    const apiKey = 'b2b1566f402c2e90c7b7d31f9e71321c'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Show loader and hide previous results
        document.getElementById('loader').classList.remove('hidden');
        document.getElementById('weather-result').classList.add('hidden');
        
        // Fetch data from OpenWeatherMap API
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }

        const data = await response.json();
        const weatherEmoji = getWeatherEmoji(data.weather[0].main); // Fetch corresponding emoji

        // Calculate current time using timezone offset
        const currentTime = getTime(data.timezone);

        // Display the weather result
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

        // Insert the weather result into the HTML
        document.getElementById('weather-result').innerHTML = weatherResult;
        document.getElementById('weather-result').classList.remove('hidden');
    } catch (error) {
        document.getElementById('weather-result').innerHTML = `<p>${error.message}</p>`;
        document.getElementById('weather-result').classList.remove('hidden');
    } finally {
        // Hide loader
        document.getElementById('loader').classList.add('hidden');
    }
}

// Helper function to return weather emoji based on main weather condition
function getWeatherEmoji(mainWeather) {
    switch (mainWeather.toLowerCase()) {
        case 'clear':
            return '☀️';  // Sun emoji
        case 'clouds':
            return '☁️';  // Cloud emoji
        case 'rain':
            return '🌧️';  // Rain emoji
        case 'thunderstorm':
            return '⛈️';  // Thunderstorm emoji
        case 'snow':
            return '❄️';  // Snow emoji
        case 'mist':
            return '🌫️';  // Mist emoji
        default:
            return '';     // Default (no emoji)
    }
}

// Function to calculate local time based on timezone offset from UTC
function getTime(timezoneOffset) {
    const now = new Date();
    
    // Convert the timezone offset from seconds to milliseconds and add it to the UTC time
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + timezoneOffset * 1000); // Convert seconds to milliseconds

    return cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

