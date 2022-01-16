function formatDate() {
  let dayName = days[currentDate.getDay()];
  let month = months[currentDate.getMonth()];
  let dayNumber = currentDate.getDate();
  let year = currentDate.getFullYear();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  return `${dayName}, ${month} ${dayNumber} ${year} ${hours}:${minutes}`;
}
function submitForm(event) {
  event.preventDefault();
  var newCity = searchBox.value;
  let endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=metric`;
  axios.get(endpoint).then(reportTemp);
}

function pageLoad() {
  let endpoint = `https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=${apiKey}&units=metric`;
  axios.get(endpoint).then(reportTemp);
}

function reportTemp(response) {
  temp = Math.round(response.data.main.temp);
  temperature.innerHTML = temp;
  cityName.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = response.data.wind.speed;
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", `${response.data.weather[0].description}`);
  getForecast(response.data.coord);
}

function getForecast(coordinates) {
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

function getLocation() {
  event.preventDefault();
  console.log("called");
  navigator.geolocation.getCurrentPosition(useCurrentLocation);
}

function useCurrentLocation(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let endpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let url = `${endpoint}lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  console.log(url);
  axios.get(url).then(reportTemp);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `         
         <div class="col-2" id="forecast">
            <div class="forecastDate">${formatForecastDay(forecastDay.dt)}</div>
            <div> <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="${
          forecastDay.weather[0].description
        }" width="50px" class="forecastIcon"> </div>
            <div class="forecastTemps"> 
              <span class="forecastTempsMax">${Math.round(
                forecastDay.temp.max
              )}°</span>
              <span class="forecastTempsMin">${Math.round(
                forecastDay.temp.min
              )}°</span> 
            </div>
          </div>`;
    }
  });

  function formatForecastDay(timestamp) {
    let forecastDate = new Date(timestamp * 1000);
    let forecastDay = forecastDate.getDay();

    return days[forecastDay];
  }

  forecastElement.innerHTML = forecastHTML;
}

let currentLocationButton = document.querySelector("#currentLocation");
let date = document.querySelector("#date");
let description = document.querySelector("#description");
let submitButton = document.querySelector("#submit-button");
let searchBox = document.querySelector("#search-box");
let cityName = document.querySelector("#city-name");
var temp = "";
var apiKey = "dbec88a6d2d425ce902660bf47e59907";
var temperature = document.querySelector("#temp");
var percip = document.querySelector("#percip");
var humidity = document.querySelector("#humidity");
var wind = document.querySelector("#wind");
var icon = document.querySelector("#icon");
let currentDate = new Date();
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

pageLoad();

date.innerHTML = formatDate();
submitButton.addEventListener("click", submitForm);
currentLocationButton.addEventListener("click", getLocation);
