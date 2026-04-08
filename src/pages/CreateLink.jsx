import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { urlService } from "../services/urlService";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../components/ui/Toast";
import { Loader } from "../components/ui/Loader";
import { CopyButton } from "../components/ui/CopyButton";
import { QRFromBase64, QRGenerator } from "../components/dashboard/QRGenerator";

const EXPIRY_OPTIONS = [
  { value: "", label: "Never expires" },
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
];

export default function CreateLink() {
  const navigate = useNavigate();
  const { addLink } = useLinks();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    url: "",
    customAlias: "",
    expiryType: "",
    password: "",
    clickLimit: "",
    oneTime: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { url: form.url };
      if (form.customAlias) payload.customAlias = form.customAlias;
      if (form.expiryType) payload.expiryType = form.expiryType;
      if (form.password) payload.password = form.password;
      if (form.clickLimit) payload.clickLimit = parseInt(form.clickLimit);
      if (form.oneTime) payload.oneTime = true;

      const data = await urlService.shorten(payload);
      const shortId = data.customAlias || data.shortUrl?.split("/").pop();

      const linkRecord = {
        shortId,
        shortUrl: data.shortUrl,
        originalUrl: form.url,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        totalClicks: 0,
        passwordProtected: data.passwordProtected,
        oneTime: data.oneTime,
        qrCode: data.qrCode,
      };
      addLink(linkRecord);
      setResult({ ...data, shortId });
      addToast("Link created!", "success");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to create link.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setForm({ url: "", customAlias: "", expiryType: "", password: "", clickLimit: "", oneTime: false });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white mb-1">Create short link</h1>
          <p className="text-sm text-zinc-500">Fill in the details below to generate a new short URL.</p>
        </div>

        {result ? (
          /* Success state */
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-emerald-950/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">✓</div>
                <div>
                  <p className="font-semibold text-white">Link created successfully!</p>
                  <p className="text-xs text-zinc-500">Your short URL is ready to share.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-violet-400 font-medium hover:text-violet-300 transition-colors text-sm truncate">
                  {result.shortUrl}
                </a>
                <CopyButton text={result.shortUrl} />
              </div>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                {result.qrCode ? (
                  <QRFromBase64 data={result.qrCode} size={120} />
                ) : (
                  <QRGenerator url={result.shortUrl} size={120} />
                )}
              </div>
              <div className="flex-1 space-y-2 text-sm min-w-0">
                {[
                  ["Original URL", result.shortUrl ? form.url : "—"],
                  ["Short ID", result.shortId],
                  ["Expires", result.expiresAt ? new Date(result.expiresAt).toLocaleDateString() : "Never"],
                  ["Click limit", result.clickLimit ?? "Unlimited"],
                  ["One-time", result.oneTime ? "Yes" : "No"],
                  ["Password", result.passwordProtected ? "Protected" : "None"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="text-zinc-500 w-24 flex-shrink-0">{k}</span>
                    <span className="text-zinc-300 truncate">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={handleReset} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-all">
                Create another
              </button>
              <button onClick={() => navigate("/dashboard")} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-300 border border-zinc-700 transition-all">
                Go to dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={handleSubmit} className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-6 space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-950/60 border border-red-800/50 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Destination URL <span className="text-red-400">*</span>
                </label>
                <input
                  name="url"
                  type="url"
                  placeholder="https://your-long-url.com/with/a/very/long/path"
                  value={form.url}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Custom alias <span className="text-zinc-600 font-normal">(optional)</span></label>
                <div className="flex items-center gap-0 rounded-xl border border-zinc-700 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 overflow-hidden bg-zinc-950 transition-all">
                  <span className="pl-4 pr-2 text-sm text-zinc-500 whitespace-nowrap">snap.url/</span>
                  <input
                    name="customAlias"
                    type="text"
                    placeholder="my-link"
                    value={form.customAlias}
                    onChange={handleChange}
                    className="flex-1 pr-4 py-3 text-sm bg-transparent text-white placeholder-zinc-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Link expiry</label>
                  <select
                    name="expiryType"
                    value={form.expiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-700 focus:border-violet-500 rounded-xl text-white outline-none transition-all"
                  >
                    {EXPIRY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Click limit <span className="text-zinc-600 font-normal">(optional)</span></label>
                  <input
                    name="clickLimit"
                    type="number"
                    placeholder="Unlimited"
                    value={form.clickLimit}
                    onChange={handleChange}
                    min={1}
                    className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Password protect <span className="text-zinc-600 font-normal">(optional)</span></label>
                <input
                  name="password"
                  type="text"
                  placeholder="Leave blank for no password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="oneTime"
                    checked={form.oneTime}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600" />
                </label>
                <div>
                  <p className="text-sm font-medium text-zinc-300">One-time link</p>
                  <p className="text-xs text-zinc-600">This link will self-destruct after the first click.</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 font-semibold text-white transition-all shadow-lg shadow-violet-600/20"
              >
                {loading && <Loader size="sm" />}
                {loading ? "Creating link…" : "Create short link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}