import { NavLink } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

// ── Mobile bottom nav icons ───────────────────────────────────────────────────
const mobileNavItems = [
  {
    label: "Home",
    to: "/dashboard",
    end: true,
    icon: (active) => (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.75} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M7 18V12h6v6" />
      </svg>
    ),
  },
  {
    label: "Create",
    to: "/create",
    end: false,
    icon: (active) => (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.75} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v8M6 10h8" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    to: "/analytics",
    end: false,
    icon: (active) => (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.75} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <path d="M3 15l4-5 3 3 3-4 4 2" />
        <path d="M3 17h14" />
      </svg>
    ),
  },
  {
    label: "QR",
    to: "/qrcode",
    end: false,
    icon: (active) => (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.75} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="12" y="3" width="5" height="5" rx="1" />
        <rect x="3" y="12" width="5" height="5" rx="1" />
        <path d="M12 12h2v2h-2zM14 14h3v3h-3z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/settings",
    end: false,
    icon: (active) => (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.75} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 1v2M10 17v2M1 10h2M17 10h2
          M3.343 3.343l1.414 1.414M15.243 15.243l1.414 1.414
          M3.343 16.657l1.414-1.414M15.243 4.757l1.414-1.414" />
      </svg>
    ),
  },
];

// ── Mobile bottom navigation ──────────────────────────────────────────────────
function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30
      bg-[#08080a]/95 backdrop-blur-2xl
      border-t border-white/[0.06]
      safe-area-bottom">
      <div className="flex items-stretch h-[56px]">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 relative
              ${isActive ? "text-sky-400" : "text-zinc-600 hover:text-zinc-400"}`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px]
                    rounded-b-full bg-gradient-to-r from-sky-500 to-indigo-500" />
                )}
                {item.icon(isActive)}
                <span className={`text-[9px] font-semibold uppercase tracking-wider leading-none
                  ${isActive ? "text-sky-400" : "text-zinc-600"}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* iOS safe area */}
      <div className="h-safe-bottom bg-transparent" />
    </nav>
  );
}

// ── Page header helper (exported for use in pages) ────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
      <div>
        <h1 className="text-[22px] font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-zinc-500 mt-1 leading-snug">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ── DashboardLayout ───────────────────────────────────────────────────────────
export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      {/* Body: sidebar + main content */}
      <div className="flex pt-[60px]">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col">
          {/* Scrollable content area */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-7
            pb-[calc(1.75rem+56px)] md:pb-7
            max-w-[1200px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}