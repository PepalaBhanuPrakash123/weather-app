
let isCelsius = true;

async function getWeather() {
  const location = document.getElementById('searchInput').value.trim();
  if (!location) return;

  const apiKey = 'dfd9c54ff6fb00adbf957f96ef1285d7';
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  document.getElementById('loader').classList.remove('d-none');
  document.getElementById('weatherCard').classList.add('d-none');
  document.getElementById('forecast').innerHTML = '';

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) throw new Error('City not found');

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayWeather(currentData);
    displayForecast(forecastData);
  } catch (err) {
    alert(err.message);
  } finally {
    document.getElementById('loader').classList.add('d-none');
  }
}

function getEmoji(condition) {
  switch (condition.toLowerCase()) {
    case 'clouds': return `<img src="./cloudy.png" alt="Cloudy" style="width: 24px;">`;
    case 'rain': return `<img src="./rain.png" alt="Rain" style="width: 24px;">`;
    case 'clear': return `<img src="./sunny.png" alt="Sunny" style="width: 24px;">`;
    case 'snow': return `<img src="./cold.png" alt="Snow" style="width: 24px;">`;
    case 'thunderstorm': return `<img src="./storm.png" alt="Storm" style="width: 24px;">`;
    case 'drizzle': return `<img src="./drizzle.png" alt="Drizzle" style="width: 24px;">`;
    default: return `<img src="./hot.png" alt="Default" style="width: 24px;">`;
  }
}

function displayWeather(data) {
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const humidity = data.main.humidity;
  const pressure = data.main.pressure;
  const windSpeed = data.wind.speed;
  const condition = data.weather[0].main;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById('weatherCard').innerHTML = `
    <h3>${data.name}</h3>
   <div >${getEmoji(condition)}</div>
    <h4 id="temperature">${temp} °C</h4>
    <p>${condition} ${getEmoji(condition)}</p>
    <button class="btn btn-outline-dark mt-2 mb-3" onclick="toggleTempUnit()">Switch °C/°F</button>
    <div class="row g-2">
      <div class="col-md-4">
        <div class="card p-2 text-center">
          <h6>Feels Like</h6>
          <p><img src="./hot.png" alt="Default" style="width: 24px;"> ${feelsLike} °C</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-2 text-center">
          <h6>Humidity</h6>
          <p>💧${humidity} %</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-2 text-center">
          <h6>Pressure</h6>
          <p>${pressure} hPa</p>
        </div>
      </div>
      <div class="col-md-12 mt-2">
        <div class="card p-2 text-center">
          <h6>Wind Speed</h6>
          <p><img src="./windy.png" alt="Default" style="width: 24px;"> ${windSpeed} m/s</p>
        </div>
      </div>
    </div>
  `;
  document.getElementById('weatherCard').classList.remove('d-none');
}

function displayForecast(data) {
  const container = document.getElementById('forecast');
  const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

  forecastList.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    const temp = day.main.temp;
    const tempMin = day.main.temp_min;
    const tempMax = day.main.temp_max;
    const condition = day.weather[0].main;
    const humidity = day.main.humidity;
    const windSpeed = day.wind.speed;
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const card = document.createElement('div');
    card.className = 'card forecast-card text-center p-3';
    card.innerHTML = `
      <h6>${dayName}</h6>
      <div>${getEmoji(condition)}</div>
      <p class="mb-1">${condition} ${getEmoji(condition)}</p>
      <p class="mb-1"><strong>${temp} °C</strong></p>
      <p class="mb-1 text-muted">Min: ${tempMin} °C / Max: ${tempMax} °C</p>
      <p class="mb-1">💧 Humidity: ${humidity}%</p>
      <p class="mb-0"><img src="./windy.png" alt="Default" style="width: 24px;"> Wind: ${windSpeed} m/s</p>
    `;
    container.appendChild(card);
  });
}

function toggleTempUnit() {
  const tempEl = document.getElementById('temperature');
  let currentTemp = parseFloat(tempEl.textContent);
  if (isCelsius) {
    const fahrenheit = (currentTemp * 9 / 5) + 32;
    tempEl.textContent = `${fahrenheit.toFixed(2)} °F`;
  } else {
    const celsius = (currentTemp - 32) * 5 / 9;
    tempEl.textContent = `${celsius.toFixed(2)} °C`;
  }
  isCelsius = !isCelsius;
}