import { useState } from "react";
import { urlService } from "../../services/urlService";
import { Loader } from "../ui/Loader";

const EXPIRY_OPTIONS = [
  { value: "", label: "No expiry" },
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
];

export function URLShortenerForm({ onSuccess, compact = false }) {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiryType, setExpiryType] = useState("");
  const [password, setPassword] = useState("");
  const [clickLimit, setClickLimit] = useState("");
  const [oneTime, setOneTime] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) { setError("Please enter a URL."); return; }
    setLoading(true);
    try {
      const payload = { url };
      if (customAlias) payload.customAlias = customAlias;
      if (expiryType) payload.expiryType = expiryType;
      if (password) payload.password = password;
      if (clickLimit) payload.clickLimit = parseInt(clickLimit);
      if (oneTime) payload.oneTime = true;

      const data = await urlService.shorten(payload);
      // Pass the original URL along with the API response
      onSuccess?.({ ...data, originalUrl: url });
      setUrl("");
      setCustomAlias("");
      setExpiryType("");
      setPassword("");
      setClickLimit("");
      setOneTime(false);
      setShowAdvanced(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to shorten URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex gap-2 ${compact ? "" : "flex-col sm:flex-row"}`}>
        <div className="flex-1 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            placeholder="https://your-long-url.com/paste-here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full pl-10 pr-4 ${compact ? "py-2.5 text-sm" : "py-3.5 text-base"} bg-zinc-900 border border-zinc-700/60 hover:border-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-zinc-500 outline-none transition-all`}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-violet-600/25 ${compact ? "px-5 py-2.5 text-sm" : "px-7 py-3.5 text-base whitespace-nowrap"}`}
        >
          {loading ? <Loader size="sm" /> : null}
          {loading ? "Shortening…" : "Shorten URL"}
        </button>
      </div>

      {!compact && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <svg className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            Advanced options
          </button>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Custom alias</label>
                <input
                  type="text"
                  placeholder="my-custom-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-900 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-lg text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Expiry</label>
                <select
                  value={expiryType}
                  onChange={(e) => setExpiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-lg text-white outline-none transition-all"
                >
                  {EXPIRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password protect</label>
                <input
                  type="text"
                  placeholder="Optional password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-lg text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Click limit</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  value={clickLimit}
                  onChange={(e) => setClickLimit(e.target.value)}
                  min={1}
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-lg text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={oneTime}
                    onChange={(e) => setOneTime(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600" />
                </label>
                <span className="text-xs font-medium text-zinc-400">One-time link (self-destructs after first use)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400 font-medium">{error}</p>
      )}
    </form>
  );
}