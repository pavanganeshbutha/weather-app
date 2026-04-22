const form = document.querySelector("form");
const cityInput = document.querySelector("#city-input");

async function fetchWeather(city) {
  try {
    const api = `https://weather-proxy.pavanganeshbutha.workers.dev/?city=${city}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    console.log(data);
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
