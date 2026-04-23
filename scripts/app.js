const form = document.querySelector("form");
const cityInput = document.querySelector("#city-input");
const currentWeather = document.querySelector("#current-weather");

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

async function fetchWeather(city) {
  try {
    const api = `https://weather-proxy.pavanganeshbutha.workers.dev/?city=${city}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    renderCurrentWeather(data);
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
});
