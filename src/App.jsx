import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import TodayWeather from "./components/TodayWeather";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import { fetchWeather } from "./services/weatherService";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastCity, setLastCity] = useState("Москва");

  const loadWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await fetchWeather(city);
      setData(weatherData);
      setLastCity(city);
      // Сохраняем последний город в localStorage
      localStorage.setItem("lastCity", city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем последний город при старте
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      loadWeather(savedCity);
    } else {
      loadWeather("Москва");
    }
  }, []);

  // Автообновление каждые 3 часа (10800000 мс)
  useEffect(() => {
    if (!lastCity) return;
    
    const interval = setInterval(() => {
      console.log("🔄 Автообновление погоды...");
      loadWeather(lastCity);
    }, 10800000); // 3 часа

    return () => clearInterval(interval);
  }, [lastCity]);

  const handleSearch = (city) => {
    if (city.trim()) {
      loadWeather(city);
    }
  };

  // Определяем класс фона в зависимости от погоды
  const getWeatherBackground = (condition) => {
    const backgrounds = {
      "Солнечно": "sunny",
      "Облачно": "cloudy",
      "Дождь": "rainy",
      "Снег": "snowy",
      "Гроза": "stormy",
      "Туман": "foggy"
    };
    return backgrounds[condition] || "default";
  };

  if (loading && !data) {
    return (
      <div className="app">
        <div className="left-panel">
          <SearchBar onSearch={handleSearch} city="Москва" />
          <div className="loading">Загрузка погоды...</div>
        </div>
        <div className="right-panel"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="left-panel">
          <SearchBar onSearch={handleSearch} city="Москва" />
          <div className="error">Ошибка: {error}</div>
        </div>
        <div className="right-panel"></div>
      </div>
    );
  }

  const bgClass = getWeatherBackground(data?.condition);

  return (
    <div className={`app ${bgClass}`}>
      <div className="left-panel">
        <SearchBar onSearch={handleSearch} city={data.city} />
        <TodayWeather 
          city={data.city}
          temp={data.temp}
          condition={data.condition}
          icon={data.icon}
          humidity={data.humidity}
          wind={data.wind}
          pressure={data.pressure}
          airPollution={data.airPollution}
        />
      </div>
      
      <div className="right-panel">
        <HourlyForecast hourly={data.hourly} />
        <WeeklyForecast weekly={data.weekly} />
      </div>
    </div>
  );
}

export default App;