// DEPENDENCIES (DOM Elements) =======================
const locationInput = document.querySelector('#location');
const submitBtn = document.querySelector('#submit');
const historyEl = document.querySelector('#history');

// DATA ==============================================
const apiKey = '689f34b1104ca12a133c789e52a71a39';

// FUNCTIONS =========================================
function getLocation() {
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

          autofill.push(geoData);

          // console.log(`autofill city: ${autofill.city}, ${autofill.states}`);
          // console.log('autofill state:', autofill[0].states);

          $(function () {
            // let autofill = [`${data[i].name}, ${data[i].state}`];
            let autofillList = [autofill[0].city, autofill[0].states];
            $('#location').autocomplete({
              source: autofillList,
            });
          });
        }
      }
    });
}

function getWeather(data) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=40.675444&lon=-73.862071&units=imperial&lang=en&appid=${apiKey}`;
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      retrieveWeatherData({
        city: data.name,
        desc1: data.weather[0].main,
        desc2: data.weather[0].description,
        humid: data.main.humidity,
        icon: data.weather[0].icon,
        latitude: data.lat,
        longitude: data.lon,
        temp: data.main.temp,
        wind: data.wind.speed,
      });
      console.log('weather data: ', data);
    });
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
  setTimeout(getLocation(locationInput.value), 10000);
  // getLocation(locationInput.value);
}

// USER INTERACTIONS =================================
submitBtn.addEventListener('click', handleSubmitBtn);
locationInput.addEventListener('input', handleLocationInputField);

// INITIALIZATION ====================================
