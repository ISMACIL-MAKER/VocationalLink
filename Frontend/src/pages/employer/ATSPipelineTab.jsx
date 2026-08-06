import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUsers, FaCheckCircle, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { updateApplicationStage } from "../../features/employerSlice";
import CandidateDetailModal from "../../components/employer/CandidateDetailModal";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { REGION_LABELS, APPLICATION_STAGES } from "../../constants/enums";
import { computeMatchScore } from "../../utils/matchScore";

const COLUMNS = [
  { key: "pending", label: "Pending" },
  { key: "reviewed", label: "Reviewed" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview_scheduled", label: "Interview" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

function CandidateCard({ application, onOpen }) {
  const dispatch = useDispatch();
  const seeker = application.seekerId || {};
  const skills = seeker.seekerProfile?.skills || [];
  const region = seeker.seekerProfile?.region;
  const matchScore = computeMatchScore(application.jobId, skills);

  const currentIndex = APPLICATION_STAGES.indexOf(application.status);
  const nextStage =
    currentIndex >= 0 && currentIndex < APPLICATION_STAGES.length - 1
      ? APPLICATION_STAGES[currentIndex + 1]
      : null;

  const handleAdvance = (e) => {
    e.stopPropagation();
    if (!nextStage) return;
    dispatch(updateApplicationStage({ applicationId: application._id, status: nextStage }));
  };

  return (
    <div
      onClick={() => onOpen(application._id)}
      className="w-full text-left bg-surface border border-border rounded-xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-bold text-text text-sm truncate">
            {seeker.username || application.seekerName}
          </h4>
          <p className="text-xs text-text-secondary mt-0.5 truncate">{application.jobId?.title}</p>
        </div>
        {matchScore !== null && (
          <span className="shrink-0 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
            {matchScore}% Match
          </span>
        )}
      </div>

      {region && (
        <p className="text-[10px] text-text-secondary mt-2 flex items-center gap-1">
          <FaMapMarkerAlt /> {REGION_LABELS[region] || region}
        </p>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill._id}
              className="text-[10px] font-semibold bg-surface-alt text-primary px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              {skill.skillName}
              {skill.certificates?.some((c) => c.verificationStatus === "verified") && (
                <FaCheckCircle className="text-emerald-500" />
              )}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <StatusBadge status={application.status} />
        {nextStage && (
          <button
            onClick={handleAdvance}
            title={`Advance to ${nextStage.replace(/_/g, " ")}`}
            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
          >
            Advance <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ATSPipelineTab() {
  const { applications, applicationsLoading } = useSelector((state) => state.employer);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  // Derived (not synced via effect) so the modal always reflects the latest
  // application data after a stage change, feedback note, or interview update.
  const selectedApplication =
    applications.find((app) => app._id === selectedApplicationId) || null;

  if (applicationsLoading) {
    return <p className="text-sm text-text-secondary">Loading candidate pipeline...</p>;
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={FaUsers}
        title="No applicants yet"
        description="Once candidates apply to your active jobs, they'll appear here for you to review and move through your hiring pipeline."
      />
    );
  }

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnApps = applications.filter((app) => app.status === column.key);
          return (
            <div key={column.key} className="w-72 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-text uppercase tracking-wide">
                  {column.label}
                </h3>
                <span className="text-[10px] bg-surface-alt text-text-secondary font-bold px-2 py-0.5 rounded-full">
                  {columnApps.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnApps.map((application) => (
                  <CandidateCard
                    key={application._id}
                    application={application}
                    onOpen={setSelectedApplicationId}
                  />
                ))}
                {columnApps.length === 0 && (
                  <p className="text-[10px] text-text-secondary italic">No candidates</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CandidateDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplicationId(null)}
      />
    </div>
  );
}
