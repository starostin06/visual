import { getWeatherIcon } from "../services/weatherService";

const HourlyForecast = ({ hourly }) => {
  return (
    <div className="hourly-forecast">
      <h3>⏰ Почасовой прогноз</h3>
      <div className="hourly-list">
        {hourly.map((item, index) => (
          <div key={index} className="hourly-item">
            <div className="hourly-time">{item.time}</div>
            <img src={getWeatherIcon(item.icon)} alt="" className="hourly-icon" />
            <div className="hourly-temp">{item.temp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;