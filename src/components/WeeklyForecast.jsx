import { getWeatherIcon } from "../services/weatherService";

const WeeklyForecast = ({ weekly }) => {
  return (
    <div className="weekly-forecast">
      <h3>📅 Прогноз на неделю</h3>
      <div className="weekly-list">
        {weekly.map((day, index) => (
          <div key={index} className="weekly-item">
            <div className="weekly-day">
              <img src={getWeatherIcon(day.icon)} alt="" className="weekly-icon" />
              <span>{day.day}</span>
            </div>
            <div className="weekly-temps">
              <span className="day-temp">{day.dayTemp}°</span>
              <span className="night-temp">{day.nightTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;