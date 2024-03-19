// DEPENDENCIES (DOM Elements) =======================
const locationInput = document.querySelector('#location');
const submitBtn = document.querySelector('#submit');
const historyEl = document.querySelector('#history');
const currentWeatherEl = document.querySelector('#current-weather');
const weeklyForecastEl = document.querySelector('#weekly-forecast');

// DATA ==============================================
const apiKey = '689f34b1104ca12a133c789e52a71a39';

// FUNCTIONS ========================================
function getLocation(input) {
  const locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`;

  fetch(locationURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // the actual data
      console.log(`location data: ${JSON.stringify(data)}`);

      const cityInfo = data[0];
      const cityName = data[0].name;
      const cityLat = data[0].lat;
      const cityLon = data[0].lon;

      console.log(`${cityName}, ${cityLat}, ${cityLon}`);
      getWeather(cityInfo);
      getWeekForecast(cityInfo);
    });
}

function getWeather(cityInfo) {
  console.log('weather - pulled data from getLocation: ', cityInfo);
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityInfo.lat}&lon=${cityInfo.lon}&units=imperial&lang=en&appid=${apiKey}`;
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // this is the actual data
      console.log('weather data: ', data);
      retrieveWeatherData({
        city: data.name,
        desc1: data.weather[0].main,
        desc2: data.weather[0].description,
        humid: data.main.humidity,
        icon: data.weather[0].icon,
        temp: data.main.temp,
        wind: data.wind.speed,
      });
    });
}

function getWeekForecast(cityInfo) {
  weeklyForecastEl.innerHTML = '';
  console.log('weekForecast - pulled data from getLocation: ', cityInfo);
  const weekForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityInfo.lat}&lon=${cityInfo.lon}&units=imperial&lang=en&appid=${apiKey}`;
  fetch(weekForecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // actual data of week forecast
      console.log('week forecast:', data.list);
      const weekForecast = data.list;
      console.log('weekforecast length: ', weekForecast.length);

      const divCardEl = document.createElement('div');
      const h3El = document.createElement('h3');
      const divRow = document.createElement('div');

      divCardEl.setAttribute('class', 'card text-center');
      weeklyForecastEl.appendChild(divCardEl);

      h3El.setAttribute('class', 'card-header');
      h3El.textContent = '5 Day Forecast';
      divCardEl.appendChild(h3El);

      divRow.setAttribute('class', 'row');
      divCardEl.appendChild(divRow);

      for (let i = 0; i < weekForecast.length; i++) {
        const time = dayjs.unix(weekForecast[i].dt).format('hh a');
        const date = dayjs.unix(weekForecast[i].dt).format('ddd MM/DD');
        if (time === '02 pm') {
          console.log('picking 3pm', time);
          retrieveWeekForecastData(
            {
              desc1: weekForecast[i].weather[0].main,
              desc2: weekForecast[i].weather[0].description,
              feel: weekForecast[i].main.feels_like,
              humid: weekForecast[i].main.humidity,
              icon: weekForecast[i].weather[0].icon,
              temp: weekForecast[i].main.temp,
              time: date,
              wind: weekForecast[i].wind.speed,
            },
            divRow
          );
        }
      }
    });
}

function retrieveWeatherData(data) {
  const divCardEl = document.createElement('div');
  const h3El = document.createElement('h3');
  const divRow = document.createElement('div');
  const divCardBodyEl = document.createElement('div');
  const h4El = document.createElement('h4');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidEl = document.createElement('p');
  const divCardBody2El = document.createElement('div');
  const imgEl = document.createElement('img');
  const desc1El = document.createElement('p');
  const desc2El = document.createElement('p');

  divCardEl.setAttribute('class', 'card text-center');
  currentWeatherEl.appendChild(divCardEl);

  h3El.setAttribute('class', 'card-header');
  h3El.setAttribute('id', 'city');
  h3El.textContent = `${data.city} | ${dayjs().format('ddd MM/DD/YY')}`;
  divCardEl.appendChild(h3El);

  divRow.setAttribute('class', 'row');
  divCardEl.appendChild(divRow);

  divCardBodyEl.setAttribute(
    'class',
    'col-2 card-body d-flex flex-column justify-content-between align-items-center'
  );
  divRow.appendChild(divCardBodyEl);

  h4El.setAttribute('class', 'card-title');
  h4El.textContent = 'Current Weather';
  divCardBodyEl.appendChild(h4El);

  tempEl.setAttribute('class', 'card-text');
  tempEl.setAttribute('id', 'temp');
  tempEl.textContent = `Temp: ${data.temp}°F`;
  divCardBodyEl.appendChild(tempEl);

  windEl.setAttribute('class', 'card-text');
  windEl.setAttribute('id', 'wind');
  windEl.textContent = `Wind: ${data.wind} MPH`;
  divCardBodyEl.appendChild(windEl);

  humidEl.setAttribute('class', 'card-text');
  humidEl.setAttribute('id', 'humid');
  humidEl.textContent = `Humidity: ${data.humid}%`;
  divCardBodyEl.appendChild(humidEl);

  divCardBody2El.setAttribute(
    'class',
    'col-2 card-body d-flex flex-column justify-content-between align-items-center'
  );
  divRow.appendChild(divCardBody2El);

  imgEl.setAttribute('class', 'bg-dark-subtle rounded-circle');
  imgEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.icon}@2x.png`);
  imgEl.setAttribute('alt', 'weather icon');
  divCardBody2El.appendChild(imgEl);

  desc1El.setAttribute('id', 'desc1');
  desc1El.textContent = data.desc1;
  divCardBody2El.appendChild(desc1El);

  desc2El.setAttribute('class', 'text-capitalize');
  desc2El.setAttribute('id', 'desc2');
  desc2El.textContent = data.desc2;
  divCardBody2El.appendChild(desc2El);
}

function retrieveWeekForecastData(data, divRow) {
  const cardBodyEl = document.createElement('div');
  cardBodyEl.setAttribute('class', 'col-2 card-body');
  divRow.appendChild(cardBodyEl);

  const h4El = document.createElement('h4');
  h4El.setAttribute('class', 'card-title');
  h4El.textContent = data.time;
  cardBodyEl.appendChild(h4El);

  const imgEl = document.createElement('img');
  imgEl.setAttribute('class', 'bg-dark-subtle rounded-circle');
  imgEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.icon}@2x.png`);
  imgEl.setAttribute('alt', 'weather icon');
  cardBodyEl.appendChild(imgEl);

  const tempEl = document.createElement('p');
  tempEl.setAttribute('class', 'card-text');
  tempEl.textContent = `Temp: ${data.temp}°F`;
  cardBodyEl.appendChild(tempEl);

  const windEl = document.createElement('p');
  windEl.setAttribute('class', 'card-text');
  windEl.textContent = `Wind: ${data.wind} MPH`;
  cardBodyEl.appendChild(windEl);

  const humidEl = document.createElement('p');
  humidEl.setAttribute('class', 'card-text');
  humidEl.textContent = `Wind: ${data.humid}%`;
  cardBodyEl.appendChild(humidEl);
}

function handleSubmitBtn(event) {
  event.preventDefault();
  if (!locationInput.value) {
    alert('Please enter a city');
  } else {
    // reset weather cards
    currentWeatherEl.innerHTML = '';
    getLocation(locationInput.value);
  }
}

// USER INTERACTIONS =================================
submitBtn.addEventListener('click', handleSubmitBtn);

// INITIALIZATION ====================================
