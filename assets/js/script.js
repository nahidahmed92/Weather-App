// DEPENDENCIES (DOM Elements) =======================
const locationInput = document.querySelector('#location');
const submitBtn = document.querySelector('#submit');
const historyEl = document.querySelector('#history');
const currentWeatherEl = document.querySelector('section');

// DATA ==============================================
const apiKey = '689f34b1104ca12a133c789e52a71a39';
// let cityInfo = '';

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
    });
}

function getWeather(cityInfo) {
  console.log('pulled data from getLocation: ', cityInfo);
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
        lat: data.lat,
        lon: data.lon,
        temp: data.main.temp,
        wind: data.wind.speed,
      });
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
  const svgEl = document.createElement('svg');
  const pathEl = document.createElement('path');
  const desc1El = document.createElement('p');
  const desc2El = document.createElement('p');

  if (data.city) {
    divCardEl.setAttribute('class', 'card text-center');
    currentWeatherEl.appendChild(divCardEl);

    h3El.setAttribute('class', 'card-header');
    h3El.setAttribute('id', 'city');
    h3El.textContent = `${data.city} | ${dayjs().format('ddd MM/DD/YY')}`; // add icon later
    divCardEl.appendChild(h3El);

    divRow.setAttribute('class', 'row');
    divCardEl.appendChild(divRow);

    divCardBodyEl.setAttribute('class', 'col-2 card-body');
    divRow.appendChild(divCardBodyEl);

    h4El.setAttribute('class', 'card-title');
    h4El.textContent = 'Current Weather';
    divCardBodyEl.appendChild(h4El);
  }
  if (data.temp) {
    tempEl.setAttribute('class', 'card-text');
    tempEl.setAttribute('id', 'temp');
    tempEl.textContent = `Temp: ${data.temp}°F`;
    divCardBodyEl.appendChild(tempEl);
  }

  if (data.wind) {
    windEl.setAttribute('class', 'card-text');
    windEl.setAttribute('id', 'wind');
    windEl.textContent = `Wind: ${data.wind} MPH`;
    divCardBodyEl.appendChild(windEl);
  }
  if (data.humid) {
    humidEl.setAttribute('class', 'card-text');
    humidEl.setAttribute('id', 'humid');
    humidEl.textContent = `Humidity: ${data.humid}%`;
    divCardBodyEl.appendChild(humidEl);
  }

  if (data.icon) {
    divCardBody2El.setAttribute('class', 'col-2 card-body');
    divRow.appendChild(divCardBody2El);

    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgEl.setAttribute('width', '150');
    svgEl.setAttribute('height', '150');
    svgEl.setAttribute('fill', 'currentColor');
    svgEl.setAttribute('class', 'bi bi-cloud-haze-fill');
    divCardBody2El.appendChild(svgEl);

    pathEl.setAttribute(
      'd',
      'M4 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M13.405 4.027a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973'
    );
    pathEl.setAttribute('transform', 'scale(8)');
    svgEl.appendChild(pathEl);
  }

  if (data.desc1) {
    desc1El.setAttribute('id', 'desc1');
    desc1El.textContent = data.desc1;
    divCardBody2El.appendChild(desc1El);
  }

  if (data.desc2) {
    desc2El.setAttribute('class', 'text-capitalize');
    desc2El.setAttribute('id', 'desc2');
    desc2El.textContent = data.desc2;
    divCardBody2El.appendChild(desc2El);
  }
}

function handleSubmitBtn(event) {
  event.preventDefault();
  if (!locationInput.value) {
    alert('Please enter a city');
  } else {
    currentWeatherEl.innerHTML = '';
    getLocation(locationInput.value);
    // console.log('cityInfo: ', cityInfo);
  }
}

// USER INTERACTIONS =================================
submitBtn.addEventListener('click', handleSubmitBtn);

// INITIALIZATION ====================================
