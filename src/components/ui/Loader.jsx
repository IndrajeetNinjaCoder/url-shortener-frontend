export function Loader({ size = "md", className = "" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <div
      className={`animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500 ${sizes[size]} ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-zinc-500 text-sm font-medium tracking-wide">Loading…</p>
      </div>
    </div>
  );
}