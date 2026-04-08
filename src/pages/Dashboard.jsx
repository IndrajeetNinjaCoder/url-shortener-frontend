import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { URLShortenerForm } from "../components/dashboard/URLShortenerForm";
import { LinkTable } from "../components/dashboard/LinkTable";
import { StatsCard } from "../components/ui/StatsCard";
import { Loader } from "../components/ui/Loader";
import { useAuth } from "../hooks/useAuth";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../components/ui/Toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { links, addLink, removeLink, loading } = useLinks();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const totalClicks = links.reduce((s, l) => s + (l.totalClicks || 0), 0);
  const activeLinks = links.filter((l) => !l.expiresAt || new Date(l.expiresAt) > new Date()).length;
  const expiredLinks = links.length - activeLinks;

  const handleSuccess = (data) => {
    const linkRecord = {
      shortId: data.customAlias || data.shortUrl?.split("/").pop(),
      shortUrl: data.shortUrl,
      originalUrl: data.originalUrl || "",
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      totalClicks: 0,
      passwordProtected: data.passwordProtected,
      oneTime: data.oneTime,
      qrCode: data.qrCode,
    };
    addLink(linkRecord);
    addToast("Link created successfully!", "success");
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
              <span className="text-violet-400">{user?.name?.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Here's an overview of your links.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-all shadow-lg shadow-violet-600/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New link
          </button>
        </div>

        {/* Quick create form */}
        {showForm && (
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4">Create a new short link</h2>
            <URLShortenerForm onSuccess={handleSuccess} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total links" value={links.length} icon="🔗" />
          <StatsCard label="Total clicks" value={totalClicks} icon="👆" />
          <StatsCard label="Active links" value={activeLinks} icon="✅" />
          <StatsCard label="Expired" value={expiredLinks} icon="⏰" />
        </div>

        {/* Links table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Your links</h2>
            {links.length > 0 && (
              <Link to="/create" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                Create new →
              </Link>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : (
            <LinkTable links={links} onDelete={removeLink} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}