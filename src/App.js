import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Import images
import clearSky from './assets/clear-sky.jpg';
import cloudySky from './assets/cloudy-sky.jpg';
import rainySky from './assets/rainy-sky.jpg';
import snowySky from './assets/snowy-sky.jpg';
import thunderstormSky from './assets/thunderstorm-sky.jpg';
import defaultSky from './assets/default-sky.jpg';

const App = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  // Access the API key from the environment variables
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  // Set background image
  useEffect(() => {
    const setBackground = (image) => {
      document.body.style.backgroundImage = `url(${image})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
    };

    if (weatherData) {
      const weatherCondition = weatherData.weather[0].main.toLowerCase();
      switch (weatherCondition) {
        case "clear":
          setBackground(clearSky);
          break;
        case "clouds":
          setBackground(cloudySky);
          break;
        case "rain":
          setBackground(rainySky);
          break;
        case "snow":
          setBackground(snowySky);
          break;
        case "thunderstorm":
          setBackground(thunderstormSky);
          break;
        default:
          setBackground(defaultSky);
          break;
      }
    } else {
      // Set default background image on page load
      setBackground(defaultSky);
    }
  }, [weatherData]);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: location,
          appid: API_KEY,
          units: "metric", // For temperature in Celsius
        },
      });
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setWeatherData(null);
      setError("City not found. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location) {
      fetchWeather();
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p className="temperature">{weatherData.main.temp}°C</p>
          <p className="condition">{weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;
