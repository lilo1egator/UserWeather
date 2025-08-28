'use client';

import { UserCardData } from "@/types/user";
import { usePathname } from "next/navigation";

export default function User({
  values,
  addToSaveUsers,
}: { values: UserCardData; addToSaveUsers?: (id: string) => void }) {
  const pathname = usePathname();

  const canSave = pathname === "/" && !!addToSaveUsers;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <img
          src={values.image}
          alt={values.name}
          className="h-16 w-16 rounded-full border object-cover"
        />
        <div>
          <h2 className="font-semibold">{values.name}</h2>
          <p className="text-sm text-slate-500">{values.gender}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <p><span className="font-medium">Location: </span>{values.location.city}, {values.location.country}</p>
        <p><span className="font-medium">Email: </span>{values.email}</p>
      </div>

      <div className="mt-4 flex gap-2">
        {canSave && (
          <button
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => addToSaveUsers?.(values.id)}
          >
            Save
          </button>
        )}

        <button className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
          Weather
        </button>
      </div>
    </div>
  );
}
