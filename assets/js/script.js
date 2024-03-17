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
      // console.log(`location data: ${JSON.stringify(data)}`);
      if (!data) {
        return;
      } else {
        for (let i = 0; i < data.length; i++) {
          let d = {
            city: data[i].name,
            latitude: data[i].lat,
            longitude: data[i].lon,
            states: data[i].state,
          };

          // console.log('d', d.city);
          $(function () {
            let autofill = [`${data[i].name}, ${data[i].state}`];
            $('#location').autocomplete({
              source: autofill,
            });
          });
        }
      }
    });
}

function handleSubmitBtn() {
  event.preventDefault();

  if (!locationInput.value) {
    alert('Please enter a city');
  } else {
    for (let i = 0; i < locationInput.value.length; i++) {
      const data = getLocation(locationInput.value);
      console.log('data: ', data);
      const buttonEl = document.createElement('button');
      buttonEl.setAttribute(
        'class',
        'btn btn-outline-light bg-dark text-capitalize text-light mx-2'
      );
      buttonEl.setAttribute('type', 'submit');
      // buttonEl.textContent = `${data[i].name} - ${data[i].state}`;
      buttonEl.textContent = `${locationInput.value}`;
      historyEl.appendChild(buttonEl);

      let d = {
        city: data[i].name,
        latitude: data[i].lat,
        longitude: data[i].lon,
        states: data[i].state,
      };
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
