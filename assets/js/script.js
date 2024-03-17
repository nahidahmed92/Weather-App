// DEPENDENCIES (DOM Elements) =======================
const locationInput = document.querySelector('#location');
const submitBtn = document.querySelector('#submit');
const historyEl = document.querySelector('#history');

// DATA ==============================================
const apiKey = '689f34b1104ca12a133c789e52a71a39';

// FUNCTIONS =========================================
function getLocation(city) {
  const locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

  fetch(locationURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(`location data: ${JSON.stringify(data)}`);
      if (!data) {
        return;
      } else {
        for (let i = 0; i < data.length; i++) {
          const d = {
            city: data[i].name,
            latitude: data[i].lat,
            longitude: data[i].lon,
            states: data[i].state,
          };
          $(function () {
            const autofill = [`${data[i].name}, ${data[i].state}`];
            $('#location').autocomplete({
              source: autofill,
            });
          });
        }
      }
    });
}

// USER INTERACTIONS =================================

// INITIALIZATION ====================================
