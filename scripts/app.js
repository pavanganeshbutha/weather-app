const form = document.querySelector("form");
const cityInput = document.querySelector("#city-input");
const currentWeather = document.querySelector("#current-weather");
const weatherForecastSection = document.querySelector("#weather-forecast");

function getLifestyleAdvice(temp, weatherId) {
  if (weatherId >= 200 && weatherId < 599) {
    return "Don't forget your umbrella! ☔";
  }
  if (weatherId === 800 && temp <= 30) {
    return "Perfect clear weather for a walk! 🚶‍♂️";
  }
  if (temp < 10) {
    return "It's freezing outside. Bundle up! 🧥";
  }
  if (weatherId === 800 && temp > 30) {
    return "High UV index and extreme heat. Wear sunscreen and stay hydrated. 🧴☀️";
  }

  return "A normal day. Dress comfortably.";
}

function renderCurrentWeather(data) {
  currentWeather.replaceChildren();

  const { name } = data;
  const { temp } = data.main;
  const { id, description, icon } = data.weather[0];

  const h2 = document.createElement("h2");
  h2.textContent = name;

  const p = document.createElement("p");
  p.classList.add("temperature");
  p.textContent = `${Math.round(temp)}℃`;

  const img = document.createElement("img");
  img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  img.alt = description;

  currentWeather.append(h2, p, img);

  const advice = getLifestyleAdvice(temp, id);
  const adviceP = document.createElement("p");
  adviceP.classList.add("lifestyle-advice");
  adviceP.textContent = advice;
  currentWeather.appendChild(adviceP);
}

function filterForecastData(forecastList) {
  const forecastFilteredList = forecastList.filter((forecast) =>
    forecast.dt_txt.includes("12:00:00"),
  );
  return forecastFilteredList;
}

function renderForecast(forecastList) {
  weatherForecastSection.replaceChildren();

  forecastList.forEach((forecast) => {
    const article = document.createElement("article");
    article.classList.add("forecast-card");

    const { temp } = forecast.main;
    const { icon, description } = forecast.weather[0];

    const p = document.createElement("p");
    p.textContent = `${Math.round(temp)}℃`;

    const img = document.createElement("img");
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    img.alt = description;

    article.append(p, img);

    const dateObj = new Date(forecast.dt * 1000);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(dateObj);

    const h3 = document.createElement("h3");
    h3.textContent = dayName;

    article.prepend(h3);

    weatherForecastSection.appendChild(article);
  });
}

async function fetchWeather(location) {
  try {
    const query =
      typeof location === "string"
        ? `city=${location}`
        : `lat=${location.lat}&lon=${location.lon}`;

    const api = `https://weather-proxy.pavanganeshbutha.workers.dev/?${query}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    localStorage.setItem("lastSearchedCity", data.current.name);
    renderCurrentWeather(data.current);
    const dailyForecast = filterForecastData(data.forecast.list);
    renderForecast(dailyForecast);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function debounce(targetFunction, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      targetFunction(...args);
    }, delay);
  };
}

function handleInputSearch(event) {
  const query = event.target.value.trim();
  console.log(query);
}

const debouncedSearch = debounce(handleInputSearch, 500);

cityInput.addEventListener("input", debouncedSearch);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city === "") {
    return;
  }
  fetchWeather(city);
  cityInput.value = "";
});

function initApp() {
  const lastSearchedCity = localStorage.getItem("lastSearchedCity");
  if (lastSearchedCity) {
    fetchWeather(lastSearchedCity);
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.warn("Geolocation blocked/failed. Falling back to default.");
        fetchWeather("London");
      },
    );
  }
}

initApp();
