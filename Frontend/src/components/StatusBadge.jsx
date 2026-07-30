const STATUS_STYLES = {
  // Certificate verification statuses
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  // Application pipeline statuses
  reviewed: "bg-blue-50 text-blue-700 border-blue-200",
  shortlisted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  interview_scheduled: "bg-purple-50 text-purple-700 border-purple-200",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const STATUS_LABELS = {
  pending: "Pending Review",
  verified: "Verified",
  rejected: "Rejected",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  hired: "Hired",
};

export default function StatusBadge({ status, className = "" }) {
  const style = STATUS_STYLES[status] || "bg-[#F2F4F6] text-[#64748B] border-[#E2E8F0]";
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${style} ${className}`}
    >
      {label}
    </span>
  );
}
