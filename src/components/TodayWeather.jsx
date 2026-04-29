import { getWeatherIcon } from "../services/weatherService";

const TodayWeather = ({ city, temp, condition, icon, humidity, wind, pressure, airPollution }) => {
  return (
    <div className="today-weather">
      <h2 className="city">{city}</h2>
      <img src={getWeatherIcon(icon)} alt={condition} className="weather-icon" />
      <div className="main-temp">{temp}°</div>
      <div className="condition">{condition}</div>
      
      <div className="details">
        <div className="detail-item">
          <span className="detail-label">💧 Влажность</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">💨 Ветер</span>
          <span className="detail-value">{wind} м/с</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">🌡️ Давление</span>
          <span className="detail-value">{pressure} мм</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">🌫️ Качество воздуха</span>
          <span className="detail-value">{airPollution?.text || "Нет данных"}</span>
        </div>
      </div>
    </div>
  );
};

export default TodayWeather;