import { useEffect, useRef, useState } from "react";

// Lightweight QR rendering using the free QR code API
export function QRGenerator({ url, size = 200, className = "" }) {
  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&bgcolor=18181b&color=ffffff&margin=20`;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={qrSrc}
        alt={`QR code for ${url}`}
        width={size}
        height={size}
        className="rounded-xl"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}

// If the backend returns a base64 qrCode field, use it directly
export function QRFromBase64({ data, size = 200, className = "" }) {
  if (!data) return null;
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={data}
        alt="QR code"
        width={size}
        height={size}
        className="rounded-xl"
      />
    </div>
  );
}

export function QRDownloadButton({ url, filename = "qr-code" }) {
  const handleDownload = () => {
    const size = 400;
    const encodedUrl = encodeURIComponent(url);
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&bgcolor=18181b&color=ffffff&margin=20`;
    const a = document.createElement("a");
    a.href = qrSrc;
    a.download = `${filename}.png`;
    a.target = "_blank";
    a.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-200 border border-zinc-700 transition-all"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download PNG
    </button>
  );
}