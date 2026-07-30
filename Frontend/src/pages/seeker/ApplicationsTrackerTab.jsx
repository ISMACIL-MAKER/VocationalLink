import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown, FaChevronUp, FaCalendarAlt } from "react-icons/fa";
import { fetchSeekerApplications } from "../../features/applicationSlice";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { APPLICATION_STAGES } from "../../constants/enums";

const STAGE_LABELS = {
  pending: "Applied",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  hired: "Hired",
};

function StageProgress({ status }) {
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-xs font-semibold text-red-600">Application not successful</span>
      </div>
    );
  }

  const currentIndex = APPLICATION_STAGES.indexOf(status);
  return (
    <div>
      <div className="flex items-center gap-1">
        {APPLICATION_STAGES.map((stage, idx) => (
          <div
            key={stage}
            className={`h-1.5 flex-1 rounded-full ${
              idx <= currentIndex ? "bg-[#00236F]" : "bg-[#E2E8F0]"
            }`}
          />
        ))}
      </div>
      <p className="text-[10px] text-[#64748B] mt-1.5">
        Stage {currentIndex + 1} of {APPLICATION_STAGES.length}: {STAGE_LABELS[status] || status}
      </p>
    </div>
  );
}

export default function ApplicationsTrackerTab() {
  const dispatch = useDispatch();
  const { seekerApplications, loading } = useSelector((state) => state.applications);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchSeekerApplications(statusFilter || undefined));
  }, [dispatch, statusFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-[#191C1E] font-bold text-lg">My Applications</h2>
          <p className="text-xs text-[#64748B]">
            Track where each application stands in the employer's hiring pipeline.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs capitalize bg-white"
        >
          <option value="">All Statuses</option>
          {[...APPLICATION_STAGES, "rejected"].map((status) => (
            <option key={status} value={status}>
              {STAGE_LABELS[status] || status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading applications...</p>
      ) : seekerApplications.length === 0 ? (
        <EmptyState
          icon={FaCalendarAlt}
          title="No applications found"
          description="Applications you submit from Browse Jobs will show up here with live pipeline status."
        />
      ) : (
        <div className="space-y-4">
          {seekerApplications.map((application) => {
            const isExpanded = expandedId === application._id;
            return (
              <div
                key={application._id}
                className="bg-white border border-[#F2F4F6] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : application._id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#191C1E] text-sm truncate">
                      {application.jobId?.title || "Job removed"}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {application.jobId?.company} • Applied{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-3 max-w-sm">
                      <StageProgress status={application.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={application.status} />
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#F2F4F6] p-5 bg-[#F8FAFC]">
                    {application.interview?.scheduledAt && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-[#191C1E] mb-1">
                          Interview Details
                        </h4>
                        <p className="text-xs text-[#64748B]">
                          {new Date(application.interview.scheduledAt).toLocaleString()} —{" "}
                          {application.interview.mode}
                          {application.interview.location &&
                            ` @ ${application.interview.location}`}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-[#191C1E] mb-1">
                        Feedback from Employer
                      </h4>
                      {application.feedbackNotes?.length > 0 ? (
                        <div className="space-y-2">
                          {application.feedbackNotes.map((note) => (
                            <div
                              key={note._id}
                              className="bg-white border border-[#E2E8F0] rounded-lg p-3 text-xs text-[#334155]"
                            >
                              {note.note}
                              <p className="text-[10px] text-[#94A3B8] mt-1">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#94A3B8]">No feedback shared yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
