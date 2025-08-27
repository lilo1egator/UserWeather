"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function NavLinks() {
  const pathname = usePathname();

  const baseClasses =
    "relative rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  const inactive =
    "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white";
  const active =
    "text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-4";

  return (
    <nav className="flex items-center gap-2">
      <Link
        href="/"
        className={`${baseClasses} ${pathname === "/" ? active : inactive}`}
      >
        Users
      </Link>
      <Link
        href="/saved"
        className={`${baseClasses} ${pathname.startsWith("/saved") ? active : inactive}`}
      >
        Saved
      </Link>
    </nav>
  );
}