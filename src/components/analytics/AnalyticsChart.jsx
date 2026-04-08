// Simple bar chart built with pure CSS/SVG — no extra deps needed

export function BarChart({ data = [], valueKey = "count", labelKey = "label", color = "#7c3aed" }) {
  if (!data.length) return <EmptyChart />;
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0));

  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((item, i) => {
        const val = Number(item[valueKey]) || 0;
        const pct = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group min-w-0">
            <div className="relative w-full flex items-end justify-center h-32">
              <div
                className="w-full max-w-[48px] rounded-t-lg transition-all duration-500 relative"
                style={{ height: `${Math.max(pct, 4)}%`, backgroundColor: color, opacity: 0.85 }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {val}
                </div>
              </div>
            </div>
            <span className="text-xs text-zinc-500 truncate w-full text-center">{item[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBarChart({ data = [], valueKey = "count", labelKey = "label", color = "#7c3aed" }) {
  if (!data.length) return <EmptyChart />;
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0));

  return (
    <div className="flex flex-col gap-3 w-full">
      {data.slice(0, 8).map((item, i) => {
        const val = Number(item[valueKey]) || 0;
        const pct = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-24 flex-shrink-0 truncate text-right">{item[labelKey] || "Unknown"}</span>
            <div className="flex-1 h-5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs text-zinc-400 w-8 text-right tabular-nums font-medium">{val}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({ data = [], valueKey = "count", labelKey = "label" }) {
  if (!data.length) return <EmptyChart />;
  const colors = ["#7c3aed", "#4f46e5", "#2563eb", "#0891b2", "#059669", "#ca8a04", "#dc2626"];
  const total = data.reduce((s, d) => s + (Number(d[valueKey]) || 0), 0);

  let offset = 0;
  const slices = data.slice(0, 6).map((d, i) => {
    const val = Number(d[valueKey]) || 0;
    const pct = total > 0 ? val / total : 0;
    const startAngle = offset * 360;
    const endAngle = (offset + pct) * 360;
    offset += pct;
    return { ...d, val, pct, startAngle, endAngle, color: colors[i % colors.length] };
  });

  const polarToCartesian = (cx, cy, r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx, cy, r, start, end) => {
    if (end - start >= 360) end = 359.999;
    const s = polarToCartesian(cx, cy, r, start);
    const e = polarToCartesian(cx, cy, r, end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  return (
    <div className="flex items-center gap-6 w-full">
      <svg viewBox="0 0 100 100" className="w-32 h-32 flex-shrink-0">
        {slices.map((slice, i) => (
          <path
            key={i}
            d={describeArc(50, 50, 40, slice.startAngle, slice.endAngle)}
            fill="none"
            stroke={slice.color}
            strokeWidth="18"
            strokeLinecap="butt"
          />
        ))}
        <circle cx="50" cy="50" r="22" fill="#18181b" />
        <text x="50" y="54" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontWeight="600">{total}</text>
      </svg>
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-xs text-zinc-400 truncate flex-1">{slice[labelKey] || "Unknown"}</span>
            <span className="text-xs font-semibold text-zinc-300 tabular-nums">{slice.val}</span>
            <span className="text-xs text-zinc-600 tabular-nums w-10 text-right">
              {(slice.pct * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
      No data available
    </div>
  );
}