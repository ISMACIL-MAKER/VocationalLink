export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse bg-[#E2E8F0] rounded ${className}`} />;
}

export function SkeletonJobCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#F2F4F6] shadow-sm flex flex-col gap-3">
      <SkeletonLine className="h-4 w-2/3" />
      <SkeletonLine className="h-3 w-1/2" />
      <SkeletonLine className="h-3 w-full" />
      <SkeletonLine className="h-3 w-5/6" />
      <SkeletonLine className="h-8 w-28 mt-2" />
    </div>
  );
}
