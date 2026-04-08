import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLinks } from "../../hooks/useLinks";

// ── Icons ─────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <rect x="2" y="2" width="6" height="6" rx="1.5" />
      <rect x="10" y="2" width="6" height="6" rx="1.5" />
      <rect x="2" y="10" width="6" height="6" rx="1.5" />
      <rect x="10" y="10" width="6" height="6" rx="1.5" />
    </svg>
  ),
  create: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <path d="M9 3v12M3 9h12" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <path d="M3 14l4-5 3 3 3-4 3 2" />
      <path d="M3 16h12" />
    </svg>
  ),
  qrcode: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="11" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="11" width="5" height="5" rx="1" />
      <path d="M11 11h2v2h-2zM13 13h2v2h-2zM11 15h2" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2
        M3.697 3.697l1.414 1.414M12.889 12.889l1.414 1.414
        M3.697 14.303l1.414-1.414M12.889 5.111l1.414-1.414" />
    </svg>
  ),
  collapse: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <path d="M11 4l-4 5 4 5" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <path d="M7 4l4 5-4 5" />
    </svg>
  ),
  upgrade: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <path d="M9 2l2.5 5H16l-4 3.5 1.5 5.5L9 13l-4.5 3L6 10.5 2 7h4.5L9 2z" />
    </svg>
  ),
};

// ── Nav data ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: "dashboard", end: true  },
  { label: "Create",    to: "/create",    icon: "create",    end: false },
  { label: "Analytics", to: "/analytics", icon: "analytics", end: false },
  { label: "QR Codes",  to: "/qrcode",    icon: "qrcode",    end: false },
];

const BOTTOM_ITEMS = [
  { label: "Settings",  to: "/settings",  icon: "settings",  end: false },
];

// ── Link stats badge ──────────────────────────────────────────────────────────
function StatBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-auto text-[10px] font-bold tabular-nums
      bg-white/[0.07] text-zinc-400 px-1.5 py-0.5 rounded-md leading-none">
      {count > 999 ? "999+" : count}
    </span>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { links } = useLinks();
  const navigate = useNavigate();

  const totalLinks = links.length;

  const sidebarWidth = collapsed ? "w-[60px]" : "w-[220px]";

  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 ${sidebarWidth}
        min-h-[calc(100vh-60px)] sticky top-[60px] self-start
        bg-[#08080a] border-r border-white/[0.05]
        transition-[width] duration-200 ease-out overflow-hidden`}
    >
      {/* ── Collapse toggle ── */}
      <div className={`flex ${collapsed ? "justify-center" : "justify-end"} px-3 pt-3 pb-1`}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-all"
        >
          {collapsed ? icons.expand : icons.collapse}
        </button>
      </div>

      {/* ── Main nav ── */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 py-1 overflow-hidden">
        <p className={`text-[10px] font-semibold uppercase tracking-widest
          text-zinc-600 px-2 mb-1 transition-all duration-200
          ${collapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto"}`}>
          Menu
        </p>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-150 group relative overflow-hidden
              ${collapsed ? "justify-center" : ""}
              ${isActive
                ? "text-white bg-white/[0.07]"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active accent stripe */}
                {isActive && (
                  <span className="absolute left-0 inset-y-2 w-[2.5px] rounded-r-full
                    bg-gradient-to-b from-sky-400 to-indigo-500" />
                )}

                {/* Icon */}
                <span className={`flex-shrink-0 transition-colors ${isActive ? "text-sky-400" : ""}`}>
                  {icons[item.icon]}
                </span>

                {/* Label + badge */}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.to === "/dashboard" && <StatBadge count={totalLinks} />}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Upgrade card (only expanded) ── */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="relative rounded-2xl overflow-hidden p-4
            bg-gradient-to-br from-sky-950/60 via-indigo-950/50 to-zinc-900/80
            border border-sky-900/40">
            {/* Decorative circle */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full
              bg-gradient-to-br from-sky-500/10 to-indigo-600/10 blur-xl" />

            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-sky-400">{icons.upgrade}</span>
              <p className="text-[12px] font-bold text-white">Upgrade to Pro</p>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
              Custom domains, unlimited links, team seats & priority support.
            </p>
            <a
              href="/#pricing"
              className="flex items-center justify-center w-full py-2 rounded-xl
                text-[12px] font-semibold text-white
                bg-gradient-to-r from-sky-500 to-indigo-600
                hover:from-sky-400 hover:to-indigo-500
                transition-all duration-200 shadow-md shadow-sky-950/40"
            >
              View plans
            </a>
          </div>
        </div>
      )}

      {/* ── Bottom nav ── */}
      <nav className={`flex flex-col gap-0.5 px-2 py-2 border-t border-white/[0.05]`}>
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-150 relative overflow-hidden
              ${collapsed ? "justify-center" : ""}
              ${isActive
                ? "text-white bg-white/[0.07]"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 inset-y-2 w-[2.5px] rounded-r-full
                    bg-gradient-to-b from-sky-400 to-indigo-500" />
                )}
                <span className={`flex-shrink-0 ${isActive ? "text-sky-400" : ""}`}>
                  {icons[item.icon]}
                </span>
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* User row */}
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2.5 mt-0.5 rounded-xl
            bg-white/[0.02] border border-white/[0.04]">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-indigo-600
              flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-zinc-300 truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-zinc-600 truncate leading-tight font-mono">
                Free plan
              </p>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}