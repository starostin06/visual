const API_KEY = '6708ea1b36c68d420aae8970fc836a70';

const getRussianDay = (date, isToday = false, isTomorrow = false) => {
  if (isToday) return "Сегодня";
  if (isTomorrow) return "Завтра";
  
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  return days[date.getDay()];
};

const translateWeather = (weatherEn) => {
  const translations = {
    "Clear": "Солнечно",
    "Clouds": "Облачно",
    "Rain": "Дождь",
    "Snow": "Снег",
    "Thunderstorm": "Гроза",
    "Drizzle": "Морось",
    "Mist": "Туман",
    "Smoke": "Дымка",
    "Haze": "Мгла",
    "Fog": "Туман"
  };
  return translations[weatherEn] || weatherEn;
};

// Получаем иконку погоды
export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Получаем загрязнение воздуха
const fetchAirPollution = async (lat, lon) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    const aqi = data.list[0].main.aqi;
    const aqiText = {
      1: "Отличное",
      2: "Хорошее",
      3: "Умеренное",
      4: "Плохое",
      5: "Очень плохое"
    };
    
    return {
      value: aqi,
      text: aqiText[aqi] || "Неизвестно"
    };
  } catch (error) {
    console.error("Ошибка загрузки качества воздуха:", error);
    return { value: 0, text: "Нет данных" };
  }
};

export const fetchRealWeather = async (city) => {
  try {
    // Получаем координаты города
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}&lang=ru`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      throw new Error('Город не найден');
    }

    const { lat, lon, name } = geoData[0];

    // Получаем прогноз
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Получаем качество воздуха
    const airPollution = await fetchAirPollution(lat, lon);

    // Почасовой прогноз
    const hourly = weatherData.list.slice(0, 5).map((item, index) => ({
      time: index === 0 ? "Сейчас" : new Date(item.dt * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon
    }));

    // Недельный прогноз (исправлено: уникальные дни по датам)
    const weekly = [];
    const addedDates = new Set();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    for (const item of weatherData.list) {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      // Пропускаем уже добавленные даты
      if (addedDates.has(dateKey)) continue;
      
      // Определяем, сегодня или завтра
      const isToday = dateKey === today.toISOString().split('T')[0];
      const isTomorrow = dateKey === tomorrow.toISOString().split('T')[0];
      
      weekly.push({
        day: getRussianDay(date, isToday, isTomorrow),
        dayTemp: Math.round(item.main.temp_max || item.main.temp),
        nightTemp: Math.round(item.main.temp_min || item.main.temp - 3),
        icon: item.weather[0].icon
      });
      
      addedDates.add(dateKey);
      
      // Останавливаемся после 7 дней
      if (weekly.length >= 7) break;
    }

    const current = weatherData.list[0];
    
    return {
      city: name,
      temp: Math.round(current.main.temp),
      condition: translateWeather(current.weather[0].main),
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      wind: Math.round(current.wind.speed),
      pressure: Math.round(current.main.pressure * 0.750064),
      airPollution: airPollution,
      hourly: hourly,
      weekly: weekly
    };
    
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

export const fetchWeather = async (city) => {
  console.log('🌍 Загружаем реальную погоду для города:', city);
  return await fetchRealWeather(city);
};