import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTrash, FaCreditCard, FaBriefcase } from "react-icons/fa";
import { deleteEmployerJob } from "../../features/employerSlice";
import PostJobModal from "../../components/employer/PostJobModal";
import PaymentModal from "../../components/employer/PaymentModal";
import EmptyState from "../../components/EmptyState";

const JOB_STATUS_LABELS = {
  draft: "Draft",
  pending_payment: "Pending Payment",
  active: "Active",
  closed: "Closed",
  expired: "Expired",
};

const JOB_STATUS_STYLES = {
  draft: "bg-surface-alt text-text-secondary border-border",
  pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-surface-alt text-text-secondary border-border",
  expired: "bg-red-50 text-red-700 border-red-200",
};

export default function JobManagementTab() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, jobsLoading } = useSelector((state) => state.employer);
  const [showPostModal, setShowPostModal] = useState(() => searchParams.get("new") === "1");

  // Consume the one-shot "?new=1" deep link (from the sidebar's Post Job
  // item) by stripping it from the URL — doesn't touch local component state.
  if (searchParams.get("new") === "1") {
    searchParams.delete("new");
    setSearchParams(searchParams, { replace: true });
  }

  const [paymentJob, setPaymentJob] = useState(null);

  const handleDelete = (jobId) => {
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    dispatch(deleteEmployerJob(jobId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-text font-bold text-lg">Job Management</h2>
          <p className="text-xs text-text-secondary">
            Post new roles and manage payment activation for each listing.
          </p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Post New Job
        </button>
      </div>

      {jobsLoading ? (
        <p className="text-sm text-text-secondary">Loading your jobs...</p>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={FaBriefcase}
          title="No jobs posted yet"
          description="Post your first job to start building your vocational team."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm truncate">{job.title}</h3>
                  <p className="text-xs text-text-secondary mt-0.5 truncate">
                    {job.location} • {job.category}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    JOB_STATUS_STYLES[job.status] || JOB_STATUS_STYLES.draft
                  }`}
                >
                  {JOB_STATUS_LABELS[job.status] || job.status}
                </span>
              </div>

              <p className="text-xs text-text-secondary mt-3">
                {job.applicantCount || 0} applicant(s) • Posted{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </p>

              <div className="flex gap-2 mt-4">
                {job.status === "pending_payment" && (
                  <button
                    onClick={() => setPaymentJob(job)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <FaCreditCard /> Complete Payment
                  </button>
                )}
                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PostJobModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPosted={(job) => {
          setShowPostModal(false);
          setPaymentJob(job);
        }}
      />
      <PaymentModal job={paymentJob} onClose={() => setPaymentJob(null)} />
    </div>
  );
}
