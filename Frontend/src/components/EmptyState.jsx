export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-[#E2E8F0] w-full">
      {Icon && <Icon className="text-4xl text-[#C5C5D3] mb-4" />}
      <h3 className="text-[#191C1E] font-bold text-base">{title}</h3>
      {description && (
        <p className="text-[#64748B] text-sm mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
