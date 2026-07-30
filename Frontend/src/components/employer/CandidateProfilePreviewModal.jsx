import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import Modal from "../Modal";
import { inviteCandidate } from "../../features/employerSlice";
import { REGION_LABELS } from "../../constants/enums";

export default function CandidateProfilePreviewModal({ candidate, onClose }) {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.employer);
  const activeJobs = jobs.filter((job) => job.status === "active");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [inviting, setInviting] = useState(false);

  if (!candidate) return null;

  const skills = candidate.seekerProfile?.skills || [];

  const handleInvite = async () => {
    if (!selectedJobId) return;
    setInviting(true);
    const result = await dispatch(
      inviteCandidate({ candidateId: candidate._id, jobId: selectedJobId }),
    );
    setInviting(false);
    if (inviteCandidate.fulfilled.match(result)) {
      setSelectedJobId("");
    }
  };

  return (
    <Modal isOpen={!!candidate} onClose={onClose} title="Candidate Profile">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <img
            src={
              candidate.profileImage ||
              "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
            }
            alt={candidate.username}
            className="w-16 h-16 rounded-full object-cover border border-[#F2F4F6]"
          />
          <div>
            <h3 className="font-bold text-[#191C1E] text-base">{candidate.username}</h3>
            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
              <FaMapMarkerAlt />{" "}
              {REGION_LABELS[candidate.seekerProfile?.region] || candidate.seekerProfile?.region}
            </p>
            <p className="text-[10px] text-[#94A3B8] capitalize mt-0.5">
              {candidate.seekerProfile?.availability?.replace("_", " ")}
            </p>
          </div>
        </div>

        {candidate.bio && <p className="text-sm text-[#64748B]">{candidate.bio}</p>}

        <div>
          <h4 className="text-xs font-bold text-[#191C1E] mb-2">Skill Matrix</h4>
          <div className="space-y-2">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-3 py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-[#191C1E]">{skill.skillName}</p>
                  <p className="text-[10px] text-[#64748B] capitalize">
                    {skill.category} • {skill.proficiency} • {skill.yearsExperience} yrs
                  </p>
                </div>
                {skill.certificates?.some((c) => c.verificationStatus === "verified") && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaCheckCircle /> Verified
                  </span>
                )}
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-[#94A3B8]">No skills listed.</p>
            )}
          </div>
        </div>

        <div className="border-t border-[#F2F4F6] pt-4">
          <h4 className="text-xs font-bold text-[#191C1E] mb-2">Invite to Apply</h4>
          {activeJobs.length === 0 ? (
            <p className="text-xs text-[#94A3B8]">
              You have no active job posts yet. Activate a job in Job Management to invite
              candidates.
            </p>
          ) : (
            <div className="flex gap-2">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select a job...</option>
                {activeJobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
              <button
                onClick={handleInvite}
                disabled={!selectedJobId || inviting}
                className="bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#94A3B8] text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <FaPaperPlane /> {inviting ? "Sending..." : "Invite"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
