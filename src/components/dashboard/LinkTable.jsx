import { useState } from "react";
import { Link } from "react-router-dom";
import { CopyButton } from "../ui/CopyButton";
import { timeAgo } from "../../utils/formatDate";
import { useToast } from "../ui/Toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function truncate(str, n = 40) {
  return str?.length > n ? str.slice(0, n) + "…" : str;
}

export function LinkTable({ links, onDelete }) {
  const { addToast } = useToast();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (shortId) => {
    if (!confirm("Delete this link and all its analytics?")) return;
    setDeletingId(shortId);
    try {
      await onDelete(shortId);
      addToast("Link deleted.", "success");
    } catch {
      addToast("Failed to delete link.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (!links.length) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-2xl">🔗</div>
        <p className="text-zinc-400 font-medium mb-1">No links yet</p>
        <p className="text-zinc-600 text-sm">Create your first short link to get started.</p>
        <Link to="/create" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-colors">
          Create link
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Original URL</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Short URL</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Clicks</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Created</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {links.map((link) => {
            const shortUrl = link.shortUrl || `${BASE_URL}/${link.shortId}`;
            return (
              <tr key={link.shortId} className="hover:bg-zinc-900/40 transition-colors group">
                <td className="px-5 py-4 max-w-xs">
                  <div className="flex items-center gap-2.5">
                    {link.preview?.image ? (
                      <img src={link.preview.image} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded bg-zinc-800 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-300 hover:text-white truncate block transition-colors"
                        title={link.originalUrl}
                      >
                        {truncate(link.originalUrl, 45)}
                      </a>
                      {link.preview?.title && (
                        <p className="text-xs text-zinc-600 truncate mt-0.5">{link.preview.title}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                    >
                      {shortUrl.replace(/^https?:\/\//, "")}
                    </a>
                    <CopyButton text={shortUrl} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {link.expiresAt && (
                      <span className="text-xs text-amber-500/80">⏳ Expires {timeAgo(link.expiresAt)}</span>
                    )}
                    {link.passwordProtected && (
                      <span className="text-xs text-zinc-500">🔒</span>
                    )}
                    {link.oneTime && (
                      <span className="text-xs text-zinc-500">1×</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-white font-semibold tabular-nums">
                    {link.totalClicks ?? 0}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-500 whitespace-nowrap">
                  {timeAgo(link.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/analytics/${link.shortId}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 transition-all"
                      title="Analytics"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </Link>
                    <Link
                      to={`/qrcode?url=${encodeURIComponent(shortUrl)}&id=${link.shortId}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 transition-all"
                      title="QR Code"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(link.shortId)}
                      disabled={deletingId === link.shortId}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}