import Link from "next/link";
import type { Metadata } from "next";

import "./globals.scss";
import NavLinks from "@/components/Links/Links";

export const metadata: Metadata = {
  title: "UserWeather",
  description: "Users + weather demo",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-100">
        <header
          className="
            h-16 sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur
            dark:border-slate-700/60 dark:bg-slate-900/60
          "
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/30 transition group-hover:scale-105">
                ☁️
              </span>
              <span className="text-base font-semibold tracking-tight">
                UserWeather
              </span>
            </Link>

            <nav className="flex items-center gap-2">
              <NavLinks />
            </nav>
          </div>
        </header>

        <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="h-16 border-t border-slate-200/70 bg-white/60 text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/50 flex items-center">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} UserWeather</p>
            <Link
              href="https://github.com/lilo1egator/UserWeather"
              className="rounded-md px-2 py-1 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              GitHub
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
