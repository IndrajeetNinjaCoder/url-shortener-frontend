import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconLink = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2}
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0M7.414 15.414a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0" />
  </svg>
);

const IconChevron = ({ open }) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <path d="M2 4l4 4 4-4" />
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="round" className="w-[18px] h-[18px]">
    <path d="M3 5h14M3 10h10M3 15h14" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="round" className="w-[18px] h-[18px]">
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
);

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group select-none flex-shrink-0">
      <div className="relative w-[30px] h-[30px] flex-shrink-0">
        {/* Glow */}
        <div className="absolute inset-0 rounded-[9px] bg-gradient-to-br from-sky-400 to-indigo-600
          opacity-80 group-hover:opacity-100 blur-[1px] scale-110 transition-opacity duration-200" />
        {/* Body */}
        <div className="relative rounded-[9px] w-full h-full bg-gradient-to-br from-sky-400 to-indigo-600
          flex items-center justify-center text-white" style={{ padding: "6px" }}>
          <IconLink />
        </div>
      </div>
      <span className="font-black text-[16px] tracking-tight leading-none text-white">
        Snap<span className="text-sky-400">URL</span>
      </span>
    </Link>
  );
}

// ── User Dropdown ─────────────────────────────────────────────────────────────
function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (path) => { navigate(path); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl
          hover:bg-white/[0.05] transition-colors duration-150 group"
      >
        {/* Avatar */}
        <div className="w-[28px] h-[28px] rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600
          flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0
          shadow-lg shadow-sky-950/50">
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <span className="hidden sm:block text-[13px] font-medium text-zinc-300
          group-hover:text-white transition-colors max-w-[128px] truncate">
          {user?.name}
        </span>
        <IconChevron open={open} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-52
          rounded-2xl bg-[#111114] border border-white/[0.07]
          shadow-2xl shadow-black/70 overflow-hidden z-50
          animate-[fadeSlideDown_0.15s_ease-out_both]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-[13px] font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">{user?.email}</p>
          </div>

          {/* Nav items */}
          <div className="py-1">
            {[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Create link", to: "/create" },
              { label: "Settings", to: "/settings" },
            ].map((item) => (
              <button
                key={item.to}
                onClick={() => go(item.to)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px]
                  text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors duration-100"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-white/[0.06] py-1">
            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px]
                text-red-400/70 hover:text-red-300 hover:bg-red-950/20 transition-colors duration-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => { logout(); navigate("/"); };

  const publicNavLinks = [
    { label: "Features", href: "/#features" },
    { label: "Pricing",  href: "/#pricing"  },
    { label: "Docs",     href: "#"          },
  ];

  const appNavLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Create",    to: "/create"    },
    { label: "Analytics", to: "/analytics" },
    { label: "QR Codes",  to: "/qrcode"    },
  ];

  const borderClass = scrolled
    ? "border-white/[0.07] shadow-[0_1px_0_0_rgba(255,255,255,0.03)]"
    : "border-transparent";

  const bgClass = scrolled
    ? "bg-[#08080a]/90 backdrop-blur-2xl"
    : "bg-transparent";

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b ${bgClass} ${borderClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px] gap-4">

            {/* ── Left: Logo ── */}
            <Logo />

            {/* ── Center: Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {user
                ? appNavLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/dashboard"}
                      className={({ isActive }) =>
                        `relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                          isActive
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.label}
                          {isActive && (
                            <span className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full
                              bg-gradient-to-r from-sky-500 to-indigo-500" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))
                : publicNavLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-3.5 py-2 rounded-lg text-[13px] font-medium
                        text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-all duration-150"
                    >
                      {link.label}
                    </a>
                  ))}
            </nav>

            {/* ── Right: Auth ── */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {user ? (
                <UserDropdown user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:block px-3.5 py-2 text-[13px] font-medium
                      text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="relative flex items-center px-4 py-2 text-[13px] font-semibold
                      text-white rounded-xl overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-600" />
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-500
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="relative leading-none">Get started</span>
                  </Link>
                </>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle mobile menu"
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl
                  text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                {mobileOpen ? <IconClose /> : <IconMenu />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="md:hidden bg-[#09090b]/98 backdrop-blur-2xl border-t border-white/[0.06]
            animate-[fadeSlideUp_0.2s_ease-out_both]">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0.5">
              {user ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-3.5 py-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600
                      flex items-center justify-center text-[12px] font-bold text-white">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white leading-tight">{user?.name}</p>
                      <p className="text-[11px] text-zinc-500 leading-tight">{user?.email}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/[0.06] mb-1" />

                  {appNavLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/dashboard"}
                      className={({ isActive }) =>
                        `flex items-center px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all ${
                          isActive
                            ? "text-white bg-white/[0.06]"
                            : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}

                  <div className="h-px bg-white/[0.06] my-1" />
                  <NavLink to="/settings" className="flex items-center px-3.5 py-3 rounded-xl text-[14px]
                    font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3.5 py-3 rounded-xl text-[14px] font-medium
                      text-red-400/70 hover:text-red-300 hover:bg-red-950/20 transition-all text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  {publicNavLinks.map((link) => (
                    <a key={link.href} href={link.href}
                      className="flex items-center px-3.5 py-3 rounded-xl text-[14px] font-medium
                        text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all">
                      {link.label}
                    </a>
                  ))}
                  <div className="h-px bg-white/[0.06] my-1" />
                  <Link to="/login" className="flex items-center px-3.5 py-3 rounded-xl text-[14px]
                    font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    Log in
                  </Link>
                  <Link to="/register" className="flex items-center justify-center mt-1 px-3.5 py-3
                    rounded-xl text-[14px] font-semibold text-white
                    bg-gradient-to-r from-sky-500 to-indigo-600
                    hover:from-sky-400 hover:to-indigo-500 transition-all">
                    Get started free →
                  </Link>
                </>
              )}
            </nav>
            {/* Safe area spacer for notched phones */}
            <div className="h-safe-bottom" />
          </div>
        )}
      </header>
    </>
  );
}