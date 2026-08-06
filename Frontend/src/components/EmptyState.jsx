export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-surface rounded-2xl border border-dashed border-border w-full">
      {Icon && <Icon className="text-4xl text-border mb-4" />}
      <h3 className="text-text font-bold text-base">{title}</h3>
      {description && (
        <p className="text-text-secondary text-sm mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
