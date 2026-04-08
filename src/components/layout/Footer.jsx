import { Link } from "react-router-dom";

// ── Column data ───────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features",  href: "/#features" },
      { label: "Pricing",   href: "/#pricing"  },
      { label: "Changelog", href: "#"          },
      { label: "Docs",      href: "#"          },
      { label: "API",       href: "#"          },
    ],
  },
  {
    heading: "Use cases",
    links: [
      { label: "Marketing",  href: "#" },
      { label: "Developers", href: "#" },
      { label: "Teams",      href: "#" },
      { label: "Agencies",   href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "#" },
      { label: "Blog",    href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy",    href: "#" },
      { label: "Terms of service",  href: "#" },
      { label: "Cookie policy",     href: "#" },
      { label: "Security",          href: "#" },
    ],
  },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" clipRule="evenodd"
          d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482
          0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608
          1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
          0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0
          0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203
          2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678
          1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10C20 4.477 15.523 0 10 0z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M13.914 2h2.354l-5.14 5.88L17 18h-4.732l-3.71-4.853L4.34 18H1.986l5.5-6.286L2 2h4.854l3.353 4.43L13.914 2z" />
      </svg>
    ),
  },
];

// ── Logo ──────────────────────────────────────────────────────────────────────
function FooterLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 select-none group">
      <div className="relative w-7 h-7 flex-shrink-0">
        <div className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-sky-400 to-indigo-600
          opacity-70 group-hover:opacity-90 transition-opacity duration-200" />
        <div className="relative rounded-[8px] w-full h-full flex items-center justify-center text-white"
          style={{ padding: "5px" }}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2}
            strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0M7.414 15.414a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0" />
          </svg>
        </div>
      </div>
      <span className="font-black text-[15px] tracking-tight text-white leading-none">
        Snap<span className="text-sky-400">URL</span>
      </span>
    </Link>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#07070a] border-t border-white/[0.05] overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Main columns ── */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-6 gap-10">

          {/* Brand col */}
          <div className="col-span-2 flex flex-col gap-5">
            <FooterLogo />
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-[220px]">
              The link management platform for teams that move fast.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                    bg-white/[0.04] border border-white/[0.06]
                    text-zinc-500 hover:text-white hover:bg-white/[0.07]
                    hover:border-white/[0.12] transition-all duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full
                  bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] text-zinc-600 font-medium">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-zinc-500 hover:text-zinc-200
                        transition-colors duration-150 leading-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/[0.05]" />

        {/* ── Legal bar ── */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-zinc-600 order-2 sm:order-1">
            © {year} SnapURL, Inc. — Built for developers.
          </p>
          <div className="flex items-center gap-5 order-1 sm:order-2">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}