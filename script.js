async function getWeather() {
    

    const city = document.getElementById('city-input').value;
    const apiKey = 'b2b1566f402c2e90c7b7d31f9e71321c'; 
    

    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }
        

        const data = await response.json();
        
        
        const weatherResult = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>${data.weather[0].description}</p>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
        
        document.getElementById('weather-result').innerHTML = weatherResult;

    } catch (error) {
        document.getElementById('weather-result').innerHTML = `<p>${error.message}</p>`;
    }
}
