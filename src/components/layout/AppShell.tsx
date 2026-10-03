import { NavLink, Outlet } from "react-router-dom";
import { cx } from "@/components/ui";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/learn", label: "Learn" },
  { to: "/simulations", label: "Simulations" },
  { to: "/history", label: "Case History" },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-line bg-brand-strong text-slate-200 md:sticky md:top-0 md:h-screen md:w-56 md:border-r md:border-b-0">
        <div className="flex items-center gap-2.5 px-4 py-4">
          <img src="/favicon.svg" alt="" className="h-7 w-7 rounded ring-1 ring-white/20" />
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-white">Care Navigator Lab</div>
            <div className="text-[11px] text-slate-400">Claims &amp; benefits training</div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cx(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors",
                  isActive ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/6 hover:text-white",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto hidden px-4 py-4 text-[11px] leading-snug text-slate-400 md:block">
          Educational simulation only. Completing cases here is not a coding, claims or insurance credential.
        </p>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
