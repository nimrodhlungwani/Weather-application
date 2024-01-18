function updateTime() {
    var currentTimeElement = document.getElementById('currentTime');
    var currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles'
    });
    currentTimeElement.textContent = currentTime;
}

function insertDate() {
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var currentDate = new Date();
    var currentDayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    var weatherBoxes = document.querySelectorAll('.box');

    weatherBoxes.forEach(function (box, index) {
        var dayIndex = (currentDayIndex + index) % 7; // Ensure it wraps around for the next week
        box.textContent = daysOfWeek[dayIndex];
    });
}

function fetchWeather() {

    var apiUrl = 'https://api.weather.gov/gridpoints/MTR/84,105/forecast';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data);

            var weatherBoxes = document.querySelectorAll('.box');
            weatherBoxes.forEach(function (box, index) {
                var forecast = data.properties.periods[index];
                var temperatureCelsius = (forecast.temperature - 32) * (5 / 9);

                // Add an external icon using an image element
                var iconElement = document.createElement('img');

                // Get the weather icon URL based on the short forecast
                //iconElement.src = getWeatherIconUrl(forecast.shortForecast);
                iconElement.src = forecast.icon;
                iconElement.alt = 'Weather Icon'; // Provide a descriptive alt text for accessibility

                // Set the width and height of the icon (adjust values as needed)
                iconElement.style.width = '50px';
                iconElement.style.height = '50px';

                // Append the day, icon, and weather information
                box.innerHTML += '<br><br>';
                box.appendChild(iconElement);

                box.innerHTML += '<br><br>' + temperatureCelsius.toFixed(1) + '°C' + '<br><br>';

                box.innerHTML += forecast.shortForecast;

                // Check if windSpeed and windDirection are available in the API response
                if (forecast.windSpeed) {
                    box.innerHTML += '<br><br><span style="font-size: 14px;">Wind Speed: ' + forecast.windSpeed + '</span>';
                }
                if (forecast.windDirection) {
                    box.innerHTML += '<br><span style="font-size: 14px;">Wind Direction: ' + forecast.windDirection + '</span>';
                }
            });
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

updateTime();
setInterval(updateTime, 1000);
