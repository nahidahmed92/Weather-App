// DEPENDENCIES (DOM Elements) =======================
const currentWeatherEl = document.querySelector('#current-weather');
const historyEl = document.querySelector('#history');
const historyNav = document.querySelector('#history-nav');
const locationInput = document.querySelector('#location');
const submitBtn = document.querySelector('#submit');
const weeklyForecastEl = document.querySelector('#weekly-forecast');

// DATA ==============================================
const apiKey = '689f34b1104ca12a133c789e52a71a39';
let saveCity = JSON.parse(localStorage.getItem('searchedCity')) || [];

// FUNCTIONS ========================================
function getLocation(input) {
  // ready array from localStorage or set an empty array
  let saveCity = JSON.parse(localStorage.getItem('searchedCity')) || [];

  const locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`;
  fetch(locationURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // full location data
      console.log(`location data: ${JSON.stringify(data)}`);

      const searchHistory = {
        cityInfo: data[0],
        cityName: data[0].name,
        cityLat: data[0].lat,
        cityLon: data[0].lon,
      };

      getWeather(searchHistory.cityInfo);
      getWeekForecast(searchHistory.cityInfo);

      // push data to array
      saveCity.push(searchHistory);
      // save to localStorage
      localStorage.setItem('searchedCity', JSON.stringify(saveCity));

      // remove spaces in name
      const cityNameTrim = searchHistory.cityName.replace(' ', '');
      // if button name is not already saved then continue
      if (!document.querySelector(`#historySavedBtn-${cityNameTrim}`)) {
        const historyBtn = document.createElement('button');
        historyBtn.setAttribute('aria-label', `button for ${searchHistory.cityName}`);
        historyBtn.setAttribute('class', 'btn btn-outline-light bg-dark text-light ms-2');
        historyBtn.setAttribute('id', `historySavedBtn-${cityNameTrim}`);
        historyBtn.setAttribute('type', 'submit');
        historyBtn.textContent = searchHistory.cityName;
        historyEl.appendChild(historyBtn);
      }
    });
}

function getWeather(cityInfo) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityInfo.lat}&lon=${cityInfo.lon}&units=imperial&lang=en&appid=${apiKey}`;
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // full weather data
      console.log('weather data: ', data);
      // save data to function
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
  // reset 5 day forecast before adding weekly information
  weeklyForecastEl.innerHTML = '';

  const weekForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityInfo.lat}&lon=${cityInfo.lon}&units=imperial&lang=en&appid=${apiKey}`;
  fetch(weekForecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // actual data of week forecast
      console.log('week forecast:', data.list);
      // data.list is where the information is saved for weekly weather
      const weekForecast = data.list;

      // create header and card
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

      // create individual cards for 5 days
      for (let i = 0; i < weekForecast.length; i++) {
        // format time and day
        const time = dayjs.unix(weekForecast[i].dt).format('hh a');
        const date = dayjs.unix(weekForecast[i].dt).format('ddd MM/DD');

        // search for list for 2pm to get an average mid day result
        if (time === '02 pm') {
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
  // CREATE
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

  // BUILD & PLACE
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

  imgEl.setAttribute('alt', 'weather icon');
  imgEl.setAttribute('aria-label', `weather icon - ${data.desc1}`);
  imgEl.setAttribute('class', 'bg-dark-subtle rounded-circle');
  imgEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.icon}@2x.png`);
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
  // CREATE
  const cardBodyEl = document.createElement('div');
  const h4El = document.createElement('h4');
  const imgEl = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidEl = document.createElement('p');

  // BUILD
  cardBodyEl.setAttribute('class', 'col-2 card-body');
  h4El.setAttribute('class', 'card-title');
  h4El.textContent = data.time;
  imgEl.setAttribute('alt', 'weather icon');
  imgEl.setAttribute('aria-label', `weather icon - ${data.desc1}`);
  imgEl.setAttribute('class', 'bg-dark-subtle rounded-circle');
  imgEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.icon}@2x.png`);
  imgEl.setAttribute('alt', 'weather icon');
  tempEl.setAttribute('class', 'card-text');
  tempEl.textContent = `Temp: ${data.temp}°F`;
  windEl.setAttribute('class', 'card-text');
  windEl.textContent = `Wind: ${data.wind} MPH`;
  humidEl.setAttribute('class', 'card-text');
  humidEl.textContent = `Wind: ${data.humid}%`;

  // PLACE
  divRow.appendChild(cardBodyEl);
  cardBodyEl.appendChild(h4El);
  cardBodyEl.appendChild(imgEl);
  cardBodyEl.appendChild(tempEl);
  cardBodyEl.appendChild(windEl);
  cardBodyEl.appendChild(humidEl);
}

function handleSubmitBtn(event) {
  event.preventDefault();
  if (!locationInput.value) {
    alert('Please enter a city');
  } else {
    // reset weather cards
    currentWeatherEl.innerHTML = '';
    // call getlocation with input value
    getLocation(locationInput.value);

    // reset input field
    locationInput.value = '';
  }
}

function handleSearchHistoryBtn(event) {
  const target = event.target;
  // locate dynamic button
  if (target.tagName === 'BUTTON' && target.id.startsWith('historySavedBtn')) {
    const cityName = target.textContent;
    currentWeatherEl.innerHTML = '';
    getLocation(cityName);
  }
}

// USER INTERACTIONS =================================
submitBtn.addEventListener('click', handleSubmitBtn);
historyEl.addEventListener('click', handleSearchHistoryBtn);

// INITIALIZATION ====================================
window.onload = () => {
  historyNav.innerHTML = '';
  // on load receive current location weather
  // this information was pulled from Xpert learning assisstant
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log('Latitude: ' + latitude);
      console.log('Longitude: ' + longitude);

      const cityInfo = { lat: latitude, lon: longitude };
      getWeather(cityInfo);
      getWeekForecast(cityInfo);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
};
