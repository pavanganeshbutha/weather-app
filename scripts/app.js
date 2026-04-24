const form = document.querySelector("form");
const cityInput = document.querySelector("#city-input");
const currentWeather = document.querySelector("#current-weather");
const weatherForecastSection = document.querySelector("#weather-forecast");

function renderCurrentWeather(data) {
  currentWeather.replaceChildren();

  const { name } = data;
  const { temp } = data.main;
  const { description, icon } = data.weather[0];

  const h2 = document.createElement("h2");
  h2.textContent = name;

  const p = document.createElement("p");
  p.textContent = `${temp}`;

  const img = document.createElement("img");
  img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  img.alt = description;

  currentWeather.append(h2, p, img);
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
    p.textContent = `${temp}`;

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

async function fetchWeather(city) {
  try {
    const api = `https://weather-proxy.pavanganeshbutha.workers.dev/?city=${city}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    localStorage.setItem("lastSearchedCity", city);
    renderCurrentWeather(data.current);
    const dailyForecast = filterForecastData(data.forecast.list);
    renderForecast(dailyForecast);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

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
  }
}

initApp();
