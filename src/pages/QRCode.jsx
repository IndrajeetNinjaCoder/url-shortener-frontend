import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { QRGenerator, QRFromBase64, QRDownloadButton } from "../components/dashboard/QRGenerator";
import { CopyButton } from "../components/ui/CopyButton";
import { useLinks } from "../hooks/useLinks";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function QRCodePage() {
  const [searchParams] = useSearchParams();
  const { links } = useLinks();

  const urlParam = searchParams.get("url");
  const idParam = searchParams.get("id");

  const [selectedId, setSelectedId] = useState(idParam || "");
  const [customUrl, setCustomUrl] = useState(urlParam || "");
  const [size, setSize] = useState(256);

  const activeLink = links.find((l) => l.shortId === selectedId);
  const activeUrl = customUrl || (activeLink ? activeLink.shortUrl || `${BASE_URL}/${selectedId}` : "");

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-7">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">QR Codes</h1>
          <p className="text-sm text-zinc-500">Generate scannable QR codes for any of your short links.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Select a short link</label>
              {links.length === 0 ? (
                <p className="text-sm text-zinc-600">
                  No links yet.{" "}
                  <Link to="/create" className="text-violet-400 hover:text-violet-300">Create one →</Link>
                </p>
              ) : (
                <select
                  value={selectedId}
                  onChange={(e) => { setSelectedId(e.target.value); setCustomUrl(""); }}
                  className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-700 focus:border-violet-500 rounded-xl text-white outline-none transition-all"
                >
                  <option value="">Choose a link…</option>
                  {links.map((l) => (
                    <option key={l.shortId} value={l.shortId}>
                      {l.shortUrl?.replace(/^https?:\/\//, "") || l.shortId}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <div className="h-px w-6 bg-zinc-700" />
              </div>
              <p className="text-center text-xs text-zinc-600 py-1">or enter a custom URL</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Custom URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={customUrl}
                onChange={(e) => { setCustomUrl(e.target.value); setSelectedId(""); }}
                className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Size: {size}×{size}px</label>
              <input
                type="range"
                min={128}
                max={512}
                step={64}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>128px</span><span>512px</span>
              </div>
            </div>
          </div>

          {/* QR Preview */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center justify-center gap-5">
            {activeUrl ? (
              <>
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  {activeLink?.qrCode ? (
                    <QRFromBase64 data={activeLink.qrCode} size={size > 300 ? 200 : 160} />
                  ) : (
                    <QRGenerator url={activeUrl} size={size > 300 ? 200 : 160} />
                  )}
                </div>
                <div className="text-center space-y-1 w-full">
                  <p className="text-xs text-zinc-500">Encoded URL:</p>
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800">
                    <span className="text-xs text-violet-400 truncate flex-1 text-center">{activeUrl}</span>
                    <CopyButton text={activeUrl} />
                  </div>
                </div>
                <div className="flex gap-3 w-full">
                  <QRDownloadButton url={activeUrl} filename={`qr-${selectedId || "custom"}`} />
                  <CopyButton text={activeUrl} className="flex-1 justify-center py-2.5" />
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4 text-3xl">📷</div>
                <p className="text-zinc-500 text-sm font-medium">Select a link or enter a URL</p>
                <p className="text-zinc-600 text-xs mt-1">Your QR code will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* All QR codes for existing links */}
        {links.length > 0 && (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold text-white">All link QR codes</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-800">
              {links.map((link) => {
                const url = link.shortUrl || `${BASE_URL}/${link.shortId}`;
                return (
                  <div key={link.shortId} className="bg-zinc-900 p-5 flex flex-col items-center gap-3 hover:bg-zinc-800/60 transition-colors">
                    {link.qrCode ? (
                      <QRFromBase64 data={link.qrCode} size={100} />
                    ) : (
                      <QRGenerator url={url} size={100} />
                    )}
                    <div className="text-center w-full">
                      <p className="text-xs text-violet-400 font-medium truncate">{url.replace(/^https?:\/\//, "")}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{link.totalClicks ?? 0} clicks</p>
                    </div>
                    <QRDownloadButton url={url} filename={`qr-${link.shortId}`} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}