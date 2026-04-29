export const mockWeatherData = {
  city: "Москва",
  temp: 27,
  condition: "Солнечно",
  humidity: 80,
  wind: 5,
  pressure: 756,
  uv: 3,
  hourly: [
    { time: "Сейчас", temp: 27 },
    { time: "16:00", temp: 28 },
    { time: "17:00", temp: 27 },
    { time: "18:00", temp: 26 },
    { time: "19:00", temp: 25 }
  ],
  weekly: [
    { day: "Среда, 16", dayTemp: 26, nightTemp: 17 },
    { day: "Четверг, 17", dayTemp: 26, nightTemp: 17 },
    { day: "Пятница, 18", dayTemp: 26, nightTemp: 17 },
    { day: "Суббота, 19", dayTemp: 26, nightTemp: 17 },
    { day: "Воскресенье, 20", dayTemp: 26, nightTemp: 17 },
    { day: "Понедельник, 21", dayTemp: 26, nightTemp: 17 },
    { day: "Вторник, 22", dayTemp: 26, nightTemp: 17 }
  ]
};