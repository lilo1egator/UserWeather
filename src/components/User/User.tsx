'use client';

import { UserWithWeather } from "@/types/user";
import { usePathname } from "next/navigation";
import Modal from "../Modal/Modal";
import { getWeatherVisual } from "@/lib/weather-ui";
import { useState } from "react";

export default function User({
  values,
  addToSaveUsers,
}: { values: UserWithWeather; addToSaveUsers?: (user: UserWithWeather ) => void }) {

  const [showModal, setShowModal] = useState<boolean>(false);

  const pathname = usePathname();
  const canSave = pathname === "/" && !!addToSaveUsers;

  const code = values.weather.current?.weathercode ?? values.weather.code ?? null;
  const { icon, label } = getWeatherVisual(code);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <img
          src={values.image}
          alt={values.name}
          className="h-16 w-16 rounded-full border object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">{values.name}</h2>
          <p className="text-sm text-slate-500">{values.gender}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="font-medium">Location: </span>
          {values.location.city}, {values.location.country}
        </p>
        <p>
          <span className="font-medium">Email: </span>
          {values.email}
        </p>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 shadow-sm dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
          </div>
          <div className="flex flex-col items-end leading-tight text-slate-600 dark:text-slate-300">
            <span className="text-base font-semibold">
              {values.weather.temperature != null ? Math.round(values.weather.temperature) : "—"}°
            </span>
            <span className="text-xs">
              min {values.weather.min != null ? Math.round(values.weather.min) : "—"}° / max {values.weather.max != null ? Math.round(values.weather.max) : "—"}°
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {canSave && (
          <button
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => addToSaveUsers?.(values)}
          >
            Save
          </button>
        )}
        <button
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
          onClick={() => setShowModal(true)}   
        >
          Weather
        </button>
      </div>

      {showModal ? <Modal user={values} setShowModal={() => setShowModal(false)} /> : null}
    </div>
  );
}
