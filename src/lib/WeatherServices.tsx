import { UserCardData, UserWithWeather, WeatherCode } from "@/types/user";
import { useHttp } from "@/hooks/http.hooks";

/* ---------- API types ---------- */

interface ApiUser {
  gender: string;
  email: string;
  name: { title: string; first: string; last: string };
  picture: { medium: string };
  location: {
    city: string;
    country: string;
    coordinates: { latitude: string; longitude: string };
  };
  login: { uuid: string };
}

type WeatherApi = {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather?: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  hourly?: { time: string[]; temperature_2m: number[] };
  daily?: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
};

type WeatherData = UserWithWeather["weather"];


export default function WeatherServices() {
  const url = "https://randomuser.me/api/";
  const weatherUrl = "https://api.open-meteo.com/v1/forecast";
  const { loading, error, request, clearError } = useHttp();

  const _transformUser = (user: ApiUser): UserCardData => {
    const { name, email, gender, picture, location, login } = user;
    return {
      id: login.uuid,
      name: `${name.title} ${name.first} ${name.last}`.trim(),
      email,
      gender: gender ? gender[0].toUpperCase() + gender.slice(1).toLowerCase() : "",
      image: picture.medium,
      location: {
        city: location.city,
        country: location.country,
        coordinates: {
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
        },
      },
    };
  };

  const toWeatherCode = (n?: number | null): WeatherCode | null =>
    n == null || !(n in WeatherCode) ? null : (n as WeatherCode);

  const first = <T,>(arr?: T[]) => (Array.isArray(arr) && arr.length ? arr[0] : null);

  const _transformUserWeather = (data: WeatherApi): WeatherData => {
    const cw = data.current_weather;
    const hourly = data.hourly;
    const daily = data.daily;

    return {
      temperature: cw?.temperature ?? null,
      min: first(daily?.temperature_2m_min),
      max: first(daily?.temperature_2m_max),
      code: toWeatherCode(cw?.weathercode),

      current: cw
        ? {
            temperature: cw.temperature,
            windspeed: cw.windspeed,
            winddirection: cw.winddirection,
            weathercode: toWeatherCode(cw.weathercode) ?? WeatherCode.ClearSky,
            time: cw.time,
          }
        : null,
      hourly: hourly ? { time: hourly.time, temperature_2m: hourly.temperature_2m } : null,
      daily: daily
        ? {
            time: daily.time,
            temperature_2m_min: daily.temperature_2m_min,
            temperature_2m_max: daily.temperature_2m_max,
          }
        : null,
    };
  };

  const getAllUsers = async (page: number): Promise<UserCardData[]> => {
    const response = (await request(`${url}?results=6&page=${page}`)) as {
      results: ApiUser[];
    };

    return response.results
      .map((u: ApiUser) => {
        try {
          return _transformUser(u);
        } catch {
          console.warn("Skip user: transform failed");
          return null;
        }
      })
      .filter(Boolean) as UserCardData[];
  };

  const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    const res = (await request(
      `${weatherUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&temperature_unit=celsius`
    )) as WeatherApi;

    return _transformUserWeather(res);
  };

  const getAllUsersWithWeather = async (page: number): Promise<UserWithWeather[]> => {
    const users = await getAllUsers(page);

    const settled = await Promise.allSettled(
      users.map(async (u: UserCardData) => {
        const lat = Number(u.location.coordinates.latitude);
        const lon = Number(u.location.coordinates.longitude);

        if (Number.isNaN(lat) || Number.isNaN(lon)) {
          throw new Error("Invalid coordinates");
        }

        try {
          const weather = await getWeather(lat, lon);
          return { ...u, weather } as UserWithWeather;
        } catch (e) {
          clearError();
          throw e;
        }
      })
    );

    return settled
      .filter(
        (r): r is PromiseFulfilledResult<UserWithWeather> => r.status === "fulfilled"
      )
      .map((r) => r.value);
  };

  return { getAllUsers, loading, error, clearError, getWeather, getAllUsersWithWeather };
}
