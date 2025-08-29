export interface UserCardData {
  id: string;
  name: string;
  email: string;
  gender: string;
  image: string;
  location: { 
    city: string; 
    country: string 
        coordinates: { 
            latitude: string; 
            longitude: string 
        };
    };
}

export interface WeatherMini {
  temperature: number | null;
  min: number | null;
  max: number | null;
  code: WeatherCode | null;

  current: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: WeatherCode;
    time: string; // ISO
  } | null;

  hourly: {
    time: string[];
    temperature_2m: number[];
  } | null;

  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  } | null;
}

export enum WeatherCode {
  ClearSky = 0,
  MainlyClear = 1,
  PartlyCloudy = 2,
  Overcast = 3,
  Fog = 45,
  DepositingRimeFog = 48,
  LightDrizzle = 51,
  RainShowers = 61,
  SnowFall = 71,
  Thunderstorm = 95,
}

export type UserWithWeather = UserCardData & {weather: WeatherMini};