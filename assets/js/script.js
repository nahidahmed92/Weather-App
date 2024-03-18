// DEPENDENCIES (DOM Elements) =======================
const locationInput = document.querySelector('#location');
const submitBtn = document.querySelector('#submit');
const historyEl = document.querySelector('#history');

// DATA ==============================================
const apiKey = '689f34b1104ca12a133c789e52a71a39';

// FUNCTIONS =========================================
function getLocation() {
  let autofillList = localStorage.getItem('cityState') || [];
  const locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput.value}&limit=5&appid=${apiKey}`;

  fetch(locationURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(`location data: ${JSON.stringify(data)}`);
      if (!data) {
        console.log('No data to be returned');
        return;
      } else {
        for (let i = 0; i < data.length; i++) {
          // console.log('data: ', data);
          let autofill = [];

          const geoData = {
            city: data[i].name,
            latitude: data[i].lat,
            longitude: data[i].lon,
            states: data[i].state,
          };

          setTimeout(3000);
          autofill.push(geoData);

          // console.log(`autofill city: ${autofill.city}, ${autofill.states}`);
          // console.log('autofill state:', autofill[0].states);

          $(function () {
            // let autofill = [`${data[i].name}, ${data[i].state}`];
            let autofillList = [`${autofill[0].city}, ${autofill[0].states}`];

            $('#location').autocomplete({
              source: autofillList,
            });
            console.log('autofilllist: ', autofillList);
          });
        }
      }
    });
}

function getWeather(data) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&units=imperial&lang=en&appid=${apiKey}`;
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      retrieveWeatherData({
        city: data.name,
        desc: data.weather[0].main,
        humid: data.main.humidity,
        icon: data.weather[0].icon,
        lat: data.lat,
        lon: data.lon,
        temp: data.main.temp,
        wind: data.wind.speed,
      });
      console.log('weather data: ', data);
    });
}

function retrieveWeatherData(data) {
  if (data.city) {
    const divCardEl = document.createElement('div');
    divCardEl.setAttribute('class', 'card text-center');

    const h3El = document.createElement('h3');
    h3El.setAttribute('class', 'card-header');
    h3El.setAttribute('id', 'city');
    h3El.textContent = `${data.city} | ${dayjs().format('DDD MM/DD/YY')}`; // add icon later

    const divRow = document.createElement('div');
    divRow.setAttribute('class', 'row');

    const divCardBodyEl = document.createElement('div');
    divCardBodyEl.setAttribute('class', 'col-2 card-body');

    const h4El = document.createElement('h4');
    h4El.setAttribute('class', 'card-title');
    h4El.textContent = 'Current Weather';
  }
  if (data.temp) {
    const tempEl = document.createElement('p');
    tempEl.setAttribute('class', 'card-text');
    tempEl.setAttribute('id', 'temp');
    tempEl.textContent = `Temp: ${data.temp}°F`;
  }

  if (data.wind) {
    const windEl = document.createElement('p');
    windEl.setAttribute('class', 'card-text');
    windEl.setAttribute('id', 'wind');
    windEl.textContent = `Wind: ${data.wind} MPH`;
  }
  if (data.humid) {
    const humidEl = document.createElement('p');
    humidEl.setAttribute('class', 'card-text');
    humidEl.setAttribute('id', 'humid');
    humidEl.textContent = `Humidity: ${data.humid}%`;
  }

  if (data.icon) {
    const divCardBody2El = document.createElement('div');
    divCardBody2El.setAttribute('class', 'col-2 card-body');

    const svgEl = document.createElement('svg');
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgEl.setAttribute('width', '150');
    svgEl.setAttribute('height', '150');
    svgEl.setAttribute('fill', 'currentColor');
    svgEl.setAttribute('class', 'bi bi-cloud-haze-fill');

    const pathEl = document.createElement('path');
    pathEl.setAttribute(
      'd',
      'M4 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M13.405 4.027a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973'
    );
    pathEl.setAttribute('transform', 'scale(8)');
  }

  if (data.desc) {
    const descEl = document.createElement('p');
    descEl.setAttribute('id', 'desc');
    descEl.textContent = data.desc;
  }

  //append a section to the body
}

function handleSubmitBtn() {
  event.preventDefault();

  if (!locationInput.value) {
    alert('Please enter a city');
  } else {
    for (let i = 0; i < locationInput.value.length; i++) {
      const data = getLocation();

      const buttonEl = document.createElement('button');
      buttonEl.setAttribute(
        'class',
        'btn btn-outline-light bg-dark text-capitalize text-light mx-2'
      );
      buttonEl.setAttribute('type', 'submit');
      // buttonEl.textContent = `${data[i].name} - ${data[i].state}`;
      buttonEl.textContent = `${locationInput.value}`;
      historyEl.appendChild(buttonEl);

      // console.log(d);
    }
    // getLocation(locationInput.value);
  }
}

function handleLocationInputField(event) {
  event.preventDefault();

  // console.log(event.key);
  setTimeout(getLocation, 1000);
  // getLocation(locationInput.value);
}

// USER INTERACTIONS =================================
submitBtn.addEventListener('click', handleSubmitBtn);
locationInput.addEventListener('input', handleLocationInputField);

// INITIALIZATION ====================================
