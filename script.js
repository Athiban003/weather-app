"use strict";

const forecast = document.querySelector(".section2-forecast");
const input = document.querySelector(".text-input");
const searchBtn = document.querySelector(".search-btn");
const cityError = document.querySelector(".city-error");
const futureForecast = document.querySelector(".future-forecast");
const apiKey = "08a69723bae64c8cbe5123325251402"; // Replace with your API key

async function fetchData(city) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      cityError.innerHTML = "City not found";
      throw new Error("City not found or API error");
    }
    const data = await response.json();
    cityError.innerHTML = "";
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getWeather(city) {
  const weatherData = await fetchData(city);
  renderWeatherData(weatherData);
}
function renderWeatherData(weatherData) {
  forecast.innerHTML = "";
  if (weatherData) {
    console.log(weatherData);
    forecast.insertAdjacentHTML(
      "afterbegin",
      `
      <div>
      <h2>${weatherData.location.name}(${weatherData.current.last_updated})</h2>
      <p>Temperature: ${weatherData.current.temp_c}°C</p>
      <p>Climate: ${weatherData.current.wind_kph}km/h</p>
      <p>Humidity: ${weatherData.current.humidity}%</p>
      </div>
      <div class="show-climate">
      <img src=https://${weatherData.current.condition.icon} alt="current-climate">
      <p>${weatherData.current.condition.text}</P>
      </div>
      `
    );
    futureForecast.innerHTML = "";
    for (let i = 1; i <= 2; i++) {
      const date = weatherData?.forecast?.forecastday[i].date;
      const climate = weatherData?.forecast?.forecastday[i].day.condition.text;
      const icon = weatherData?.forecast?.forecastday[i].day.condition.icon;
      const temperature = weatherData?.forecast?.forecastday[i].day.maxtemp_c;
      const wind = weatherData?.forecast?.forecastday[i].day.maxwind_kph;
      const humidity = weatherData?.forecast?.forecastday[i].day.avghumidity;
      getFutureForeCast(date, climate, icon, temperature, wind, humidity);
    }
  }
}

function getFutureForeCast(date, climate, image, temperature, wind, humidity) {
  futureForecast.insertAdjacentHTML(
    "beforeend",
    `<div>
      <p class="future-date">${date}</p>
      <div class="future-climate">
        <p>${climate}</p>
        <img src=https://${image} alt="Weather">
      </div>
      <p>Temperature: ${temperature}°C</p>
      <p>Wind Speed: ${wind}km/h</p>
      <p>Humidity: ${humidity}%</P>
    </div>`
  );
}

searchBtn.addEventListener("click", () => {
  getWeather(input.value);
  futureForecast.innerHTML = "";
  input.value = "";
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather(input.value);
    futureForecast.innerHTML = "";
    input.value = "";
  }
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, showError);
  } else {
    console.log("Geolocation is not supported by your browser");
  }
}

async function fetchWeatherByLocation(position) {
  console.log(position);
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching weather data");
    }
    const data = await response.json();
    console.log(data);
    renderWeatherData(data);
  } catch (e) {
    console.error("Error fetching data:", error);
  }
  console.log(lat, lon);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

// get user location by default
getLocation();
