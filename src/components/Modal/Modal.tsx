import { useEffect } from "react";
import { UserWithWeather, WeatherCode } from "@/types/user";
import { getWeatherVisual } from "@/lib/weather-ui";

type Props = { user: UserWithWeather; setShowModal: (v: boolean) => void };

const Temp = ({
  value,
  className = "",
  prefix,
}: {
  value: number | string;
  className?: string;
  prefix?: "up" | "down";
}) => (
  <span
    className={
      "inline-flex items-baseline gap-1 leading-none whitespace-nowrap tabular-nums flex-col" +
      className
    }
  >
    {prefix === "up" && <span aria-hidden>⬆</span>}
    {prefix === "down" && <span aria-hidden>⬇</span>}
    <span className="after:content-['°']">{value}</span>
  </span>
);

export default function Modal({ user, setShowModal }: Props) {
  const { weather, location } = user;
  const onClose = () => setShowModal(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fmtHour = new Intl.DateTimeFormat(undefined, { hour: "2-digit" });
  const fmtDay = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "2-digit" });

  const hourlyCards = (() => {
    const h = weather.hourly;
    if (!h?.time?.length || !h.temperature_2m?.length) return [];
    const t = h.time, v = h.temperature_2m;
    let i = weather.current?.time ? t.indexOf(weather.current.time) : 0;
    if (i < 0) i = 0;
    const end = Math.min(t.length, i + 6);
    return t.slice(i, end).map((ts, k) => ({ time: fmtHour.format(new Date(ts)), temp: Math.round(v[i + k]) }));
  })();

  const dailyCards = (() => {
    const d = weather.daily;
    if (!d?.time?.length || !d.temperature_2m_min?.length || !d.temperature_2m_max?.length) return [];
    return d.time.slice(0, 7).map((ts, i) => ({
      day: fmtDay.format(new Date(ts)),
      min: Math.round(d.temperature_2m_min[i]),
      max: Math.round(d.temperature_2m_max[i]),
    }));
  })();

  const now = weather.temperature != null ? Math.round(weather.temperature) : "—";
  const min = weather.min != null ? Math.round(weather.min) : "—";
  const max = weather.max != null ? Math.round(weather.max) : "—";
  const code = weather.current?.weathercode ?? weather.code ?? null;
  const { icon, label } = getWeatherVisual(code as WeatherCode | null);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto overflow-x-hidden overscroll-contain"
      onMouseDown={onBackdrop}
    >
      <div className="mx-auto w-full max-w-[680px]">
        <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10">
            <div className="min-w-0">
              <h3 className="truncate text-base sm:text-lg font-semibold">
                Weather — {location.city}, {location.country}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Current • Hourly • Daily
              </p>
            </div>
            <button
              aria-label="Close"
              className="h-8 w-8 shrink-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Content (vertical only) */}
          <div className="max-h-[90dvh] overflow-y-auto overflow-x-hidden px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="mt-2 grid gap-4 sm:gap-5 sm:grid-cols-3">
              {/* Left: Now + Min/Max */}
              <div className="sm:col-span-1 rounded-xl border border-black/10 p-4 bg-gradient-to-b from-white to-slate-50 dark:border-white/10 dark:from-slate-900 dark:to-slate-900/60">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] uppercase text-slate-500">Now</div>
                    <div className="mt-0.5 font-extrabold leading-none">
                      <Temp value={now} className="text-5xl sm:text-6xl" />
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full border border-blue-500/30 text-blue-700 bg-blue-50 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300">
                    <span className="mr-1">{icon}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg p-3 bg-slate-100 dark:bg-slate-800">
                    <div className="text-[11px] text-slate-500">Min</div>
                    <Temp value={min} className="text-lg sm:text-xl font-semibold" />
                  </div>
                  <div className="rounded-lg p-3 bg-slate-100 dark:bg-slate-800">
                    <div className="text-[11px] text-slate-500">Max</div>
                    <Temp value={max} className="text-lg sm:text-xl font-semibold" />
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-black/10 dark:border-white/10 p-3 text-[11px] text-slate-500 dark:text-slate-400 break-words">
                  <div className="font-medium text-slate-700 dark:text-slate-200">Location</div>
                  <div className="mt-1">
                    Lat: {location.coordinates.latitude} · Lon: {location.coordinates.longitude}
                  </div>
                </div>
              </div>

              {/* Right: Hourly + Daily */}
              <div className="sm:col-span-2 space-y-4 sm:space-y-5 overflow-x-hidden">
                {/* Hourly */}
                {hourlyCards.length > 0 && (
                  <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Hourly temperature</h4>
                      <span className="text-[11px] text-slate-500">next hours</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {hourlyCards.map((h, i) => (
                        <div
                          key={i}
                          className="min-w-0 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 p-3 text-center"
                        >
                          <div className="text-[11px] sm:text-xs text-slate-500">{h.time}</div>
                          <Temp value={h.temp} className="mt-1 text-lg font-semibold" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Daily */}
                {dailyCards.length > 0 && (
                  <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Next days (min / max)</h4>
                      <span className="text-[11px] text-slate-500">{dailyCards.length} days</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
                      {dailyCards.map((d, i) => (
                        <div
                          key={i}
                          className="min-w-0 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-3"
                        >
                          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">
                            {d.day}
                          </div>
                          <div className="mt-1 flex justify-between column font-semibold ">
                            <Temp prefix="up" value={d.max} />
                            <Temp prefix="down" value={d.min} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-4 py-3 border-top border-black/10 dark:border-white/10">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
