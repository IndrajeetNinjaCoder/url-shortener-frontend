import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { urlService } from "../services/urlService";
import { StatsCard } from "../components/ui/StatsCard";
import { HorizontalBarChart, DonutChart } from "../components/analytics/AnalyticsChart";
import { Loader } from "../components/ui/Loader";
import { CopyButton } from "../components/ui/CopyButton";
import { useLinks } from "../hooks/useLinks";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Analytics() {
  const { shortId } = useParams();
  const { links } = useLinks();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // If no shortId in params, show a selector
  const [selectedId, setSelectedId] = useState(shortId || "");

  const fetchAnalytics = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const result = await urlService.getAnalytics(id);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) fetchAnalytics(selectedId);
    else setLoading(false);
  }, [selectedId]);

  const shortUrl = `${BASE_URL}/${selectedId}`;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-7">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
            <p className="text-sm text-zinc-500">Click stats, device breakdown and geography.</p>
          </div>
          {selectedId && (
            <div className="flex items-center gap-2 p-2.5 pl-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm">
              <span className="text-violet-400 font-medium">{shortUrl.replace(/^https?:\/\//, "")}</span>
              <CopyButton text={shortUrl} />
            </div>
          )}
        </div>

        {/* Link selector */}
        {!shortId && (
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <label className="block text-xs font-semibold text-zinc-400 mb-2">Select a link to view analytics</label>
            {links.length === 0 ? (
              <p className="text-sm text-zinc-600">
                You haven't created any links yet.{" "}
                <Link to="/create" className="text-violet-400 hover:text-violet-300">Create one now →</Link>
              </p>
            ) : (
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-700 focus:border-violet-500 rounded-xl text-white outline-none transition-all"
              >
                <option value="">Choose a link…</option>
                {links.map((l) => (
                  <option key={l.shortId} value={l.shortId}>{l.shortUrl || l.shortId} — {l.originalUrl?.slice(0, 60)}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {loading && selectedId && (
          <div className="flex items-center justify-center py-24">
            <Loader size="lg" />
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-950/60 border border-red-800/50 text-sm text-red-300">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatsCard label="Total clicks" value={data.totalClicks ?? 0} icon="👆" />
              <StatsCard label="Countries" value={data.countries?.length ?? 0} icon="🌍" />
              <StatsCard label="Browsers" value={data.browsers?.length ?? 0} icon="🌐" className="col-span-2 lg:col-span-1" />
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Countries */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
                <h3 className="font-semibold text-white mb-1">Top countries</h3>
                <p className="text-xs text-zinc-500 mb-5">Where your clicks are coming from</p>
                <HorizontalBarChart
                  data={(data.countries || []).map((c) => ({ label: c.country, count: parseInt(c.count) }))}
                  valueKey="count"
                  labelKey="label"
                  color="#7c3aed"
                />
              </div>

              {/* Devices */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
                <h3 className="font-semibold text-white mb-1">Devices</h3>
                <p className="text-xs text-zinc-500 mb-5">Desktop, mobile, or tablet</p>
                <DonutChart
                  data={(data.devices || []).map((d) => ({ label: d.device, count: parseInt(d.count) }))}
                  valueKey="count"
                  labelKey="label"
                />
              </div>

              {/* Browsers */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 lg:col-span-2">
                <h3 className="font-semibold text-white mb-1">Browsers</h3>
                <p className="text-xs text-zinc-500 mb-5">Which browsers visitors used</p>
                <HorizontalBarChart
                  data={(data.browsers || []).map((b) => ({ label: b.browser, count: parseInt(b.count) }))}
                  valueKey="count"
                  labelKey="label"
                  color="#4f46e5"
                />
              </div>
            </div>

            {/* Raw data table */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h3 className="font-semibold text-white">Breakdown details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                {[
                  { title: "Countries", rows: data.countries, keyField: "country", countField: "count" },
                  { title: "Devices", rows: data.devices, keyField: "device", countField: "count" },
                  { title: "Browsers", rows: data.browsers, keyField: "browser", countField: "count" },
                ].map(({ title, rows, keyField, countField }) => (
                  <div key={title} className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">{title}</p>
                    {rows?.length ? (
                      <ul className="space-y-2">
                        {rows.slice(0, 6).map((row, i) => (
                          <li key={i} className="flex items-center justify-between gap-3">
                            <span className="text-sm text-zinc-300 truncate">{row[keyField] || "Unknown"}</span>
                            <span className="text-sm font-semibold text-zinc-400 tabular-nums">{row[countField]}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-zinc-600">No data yet</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!loading && !data && !selectedId && links.length > 0 && (
          <div className="text-center py-16 text-zinc-600">
            <p className="text-4xl mb-4">📊</p>
            <p className="font-medium text-zinc-400">Select a link above to view its analytics.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}