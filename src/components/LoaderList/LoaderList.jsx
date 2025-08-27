"use client";

export default function Loader() {
  return (
    <div className="flex w-full items-center justify-center py-10 col-span-full">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <span className="ml-3 text-sm text-slate-600 dark:text-slate-300">
        Loading...
      </span>
    </div>
  );
}
