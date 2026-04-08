export function StatsCard({ label, value, icon, trend, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
          {trend !== undefined && (
            <p
              className={`mt-1.5 text-xs font-medium ${
                trend >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last week
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-lg">
            {icon}
          </div>
        )}
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-violet-500/5" />
    </div>
  );
}