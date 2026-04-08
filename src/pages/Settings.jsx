import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../components/ui/Toast";
import { CopyButton } from "../components/ui/CopyButton";

function generateApiKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return "sk_" + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const STORED_KEY = "snapurl_api_key";

export default function Settings() {
  const { user } = useAuth();
  const { links, clearLinks } = useLinks();
  const { addToast } = useToast();

  const [apiKey] = useState(() => {
    let k = localStorage.getItem(STORED_KEY);
    if (!k) { k = generateApiKey(); localStorage.setItem(STORED_KEY, k); }
    return k;
  });
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const maskedKey = apiKey.slice(0, 7) + "•".repeat(24) + apiKey.slice(-6);

  const handleClearData = () => {
    if (!confirm("This will remove all locally cached link data. Your links on the server will remain. Continue?")) return;
    clearLinks();
    addToast("Local data cleared.", "success");
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "api", label: "API Key" },
    { id: "data", label: "Data" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-sm text-zinc-500">Manage your account and preferences.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="font-semibold text-white">Profile information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/20">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-zinc-500">{user?.email}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { label: "Full name", value: user?.name },
                  { label: "Email address", value: user?.email },
                  { label: "Account ID", value: `#${user?.id}` },
                  { label: "Plan", value: "Free tier" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">{label}</p>
                    <p className="text-sm font-medium text-zinc-200">{value}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/30">
                <p className="text-sm text-amber-300 font-medium mb-0.5">Profile editing coming soon</p>
                <p className="text-xs text-zinc-500">Name and email editing will be available in a future update.</p>
              </div>
            </div>
          </div>
        )}

        {/* API Key tab */}
        {activeTab === "api" && (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="font-semibold text-white">API Key</h2>
              <p className="text-xs text-zinc-500 mt-1">Use this key to authenticate API requests programmatically.</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Secret key</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700"
                    >
                      {showKey ? "Hide" : "Reveal"}
                    </button>
                    <CopyButton text={apiKey} />
                  </div>
                </div>
                <code className="block text-sm text-violet-300 font-mono break-all">
                  {showKey ? apiKey : maskedKey}
                </code>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Usage example</p>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <pre className="text-xs text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap">
{`curl -X POST https://api.snapurl.io/shorten \\
  -H "Authorization: Bearer ${showKey ? apiKey : maskedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
                  </pre>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/30">
                <p className="text-sm text-red-300 font-medium mb-0.5">⚠️ Keep your API key secret</p>
                <p className="text-xs text-zinc-500">Never expose this key in public repositories or client-side code.</p>
              </div>
            </div>
          </div>
        )}

        {/* Data tab */}
        {activeTab === "data" && (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="font-semibold text-white">Data & storage</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Links cached locally</p>
                  <p className="text-2xl font-bold text-white">{links.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Total clicks tracked</p>
                  <p className="text-2xl font-bold text-white">{links.reduce((s, l) => s + (l.totalClicks || 0), 0)}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <p className="text-sm font-medium text-zinc-300 mb-1">Local cache</p>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                  SnapURL stores your link metadata in your browser for fast access. This doesn't affect your actual links on the server.
                </p>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-800/50 bg-red-950/30 hover:bg-red-950/60 transition-all"
                >
                  Clear local cache
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <p className="text-sm font-medium text-zinc-300 mb-1">Export data</p>
                <p className="text-xs text-zinc-500 mb-4">Download all your link data as a JSON file.</p>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(links, null, 2)], { type: "application/json" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = "snapurl-links.json";
                    a.click();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-all"
                >
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}