import { WeatherCode } from "@/types/user";

export function getWeatherVisual(code?: WeatherCode | null) {
  switch (code) {
    case WeatherCode.ClearSky: return { icon: "☀️", label: "Clear" };
    case WeatherCode.MainlyClear: return { icon: "🌤️", label: "Mostly clear" };
    case WeatherCode.PartlyCloudy: return { icon: "⛅", label: "Partly cloudy" };
    case WeatherCode.Overcast: return { icon: "☁️", label: "Overcast" };
    case WeatherCode.Fog:
    case WeatherCode.DepositingRimeFog: return { icon: "🌫️", label: "Fog" };
    case WeatherCode.LightDrizzle: return { icon: "🌦️", label: "Drizzle" };
    case WeatherCode.RainShowers: return { icon: "🌧️", label: "Rain" };
    case WeatherCode.SnowFall: return { icon: "❄️", label: "Snow" };
    case WeatherCode.Thunderstorm: return { icon: "⛈️", label: "Thunderstorm" };
    default: return { icon: "🌡️", label: "Weather" };
  }
}
