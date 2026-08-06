export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse bg-border rounded ${className}`} />;
}

export function SkeletonJobCard() {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-3">
      <SkeletonLine className="h-4 w-2/3" />
      <SkeletonLine className="h-3 w-1/2" />
      <SkeletonLine className="h-3 w-full" />
      <SkeletonLine className="h-3 w-5/6" />
      <SkeletonLine className="h-8 w-28 mt-2" />
    </div>
  );
}
