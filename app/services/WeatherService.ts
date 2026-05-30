// Walt Disney World coordinates: 28.3852° N, 81.5639° W
const WDW_LAT = 28.3852;
const WDW_LON = -81.5639;
const WEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? '';

export interface DailyForecast {
  date: Date;
  high: number;
  low: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  daily: DailyForecast[];
}

export async function fetchWDWWeather(): Promise<WeatherData> {
  if (!WEATHER_API_KEY) {
    throw new Error('OpenWeatherMap API key not configured. Set EXPO_PUBLIC_OPENWEATHER_API_KEY in .env.local');
  }
  const url =
    `https://api.openweathermap.org/data/3.0/onecall` +
    `?lat=${WDW_LAT}&lon=${WDW_LON}` +
    `&exclude=minutely,hourly,alerts` +
    `&units=imperial` +
    `&appid=${WEATHER_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  const data = await res.json();

  return {
    current: {
      temp: Math.round(data.current.temp),
      feelsLike: Math.round(data.current.feels_like),
      description: data.current.weather[0].description,
      icon: data.current.weather[0].icon,
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_speed),
    },
    daily: data.daily.slice(0, 7).map((d: any) => ({
      date: new Date(d.dt * 1000),
      high: Math.round(d.temp.max),
      low: Math.round(d.temp.min),
      description: d.weather[0].description,
      icon: d.weather[0].icon,
      humidity: d.humidity,
      windSpeed: Math.round(d.wind_speed),
    })),
  };
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
