# Vanilla JS Weather Application 🌤️

A production-grade, context-aware weather application built entirely with Vanilla JavaScript, HTML, and CSS. This project demonstrates advanced frontend architecture, including a secure Backend-For-Frontend (BFF) proxy, custom debounce engines, and geolocation integration, without relying on any heavy frameworks like React or Tailwind.

## 🚀 Live Demo
[View Live Application](https://pavanganeshbutha.github.io/weather-app)

## ✨ Key Features
* **Secure BFF Architecture:** Utilizes a Cloudflare Worker as a proxy to completely hide the OpenWeatherMap API key and enforce strict CORS origin whitelisting.
* **Context-Aware Geolocation:** Automatically requests the user's coordinates on the first visit to provide localized weather data instantly.
* **Algorithmic Debouncing:** Features a custom closure-based debounce engine on the search bar to prevent API spam and optimize network performance.
* **Intelligent Lifestyle Engine:** A built-in rules engine that analyzes temperature and weather condition codes to provide actionable advice (e.g., "High UV index. Wear sunscreen," or "Don't forget your umbrella!").
* **Responsive Grid Layout:** A mobile-first UI built with native CSS Grid (`minmax`) and Flexbox, ensuring a seamless experience from mobile devices to 4K monitors.
* **State Persistence:** Remembers the user's last searched city using browser `localStorage`.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend/Proxy:** Cloudflare Workers
* **APIs:** OpenWeatherMap (Current & 5-Day Forecast), Browser Geolocation API, `Intl.DateTimeFormat` API
* **Deployment:** GitHub Pages

## 🏗️ Architecture Highlight: The Cloudflare Worker Proxy
To prevent exposing the OpenWeatherMap API key in the client-side JavaScript, this application routes all requests through a Cloudflare Worker. The worker:
1. Validates the incoming origin against a strict whitelist to prevent unauthorized API drain.
2. Dynamically constructs the query using either a city name (`?q=London`) or geographic coordinates (`?lat=x&lon=y`).
3. Forces the `&units=metric` parameter for consistent Celsius readouts.
4. Fetches both the Current Weather and 5-Day Forecast concurrently using `Promise.all`.
5. Returns a unified, filtered JSON payload to the frontend.

## 💻 Local Setup & Development

### Prerequisites
* A free [OpenWeatherMap API Key](https://openweathermap.org/api)
* A [Cloudflare](https://dash.cloudflare.com/) account (for the Worker proxy)

### 1. Setup the Cloudflare Worker
1. Create a new Cloudflare Worker.
2. Copy the contents of your worker code into the Cloudflare editor.
3. Add your OpenWeatherMap API key as an environment variable named `WEATHER_API_KEY`.
4. **Crucial:** Update the `ALLOWED_ORIGINS` array in the worker code to include `http://127.0.0.1:5500` (or your local dev server port) for local testing.
5. Deploy the worker and note its URL.

### 2. Setup the Frontend
1. Clone this repository.
2. Open `app.js` and update the `api` variable inside the `fetchWeather` function to point to your new Cloudflare Worker URL.
3. Run a local development server (like VS Code's Live Server) to view the application.

## 📝 License
&copy; 2026 Pavan Ganesh Butha. All rights reserved.
