import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaBuilding,
  FaArrowLeft,
} from "react-icons/fa";
import { fetchJobById } from "../features/jobSlice";
import { SkeletonLine } from "../components/Skeleton";
import { REGION_LABELS } from "../constants/enums";
import { DASHBOARD_BY_ROLE } from "../constants/roles";

export default function JobDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentJob, currentJobLoading, currentJobError } = useSelector(
    (state) => state.jobs,
  );
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  const renderApplyCta = () => {
    if (!token || !user) {
      return (
        <Link
          to="/Login"
          className="w-full bg-[#00236F] hover:bg-[#1E3A8A] text-white font-bold py-3 rounded-xl text-center block transition-colors"
        >
          Login to Apply
        </Link>
      );
    }
    if (user.role === "Job-Seeker") {
      return (
        <Link
          to="/Jop-seeker-Dashboard"
          className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-center block transition-colors"
        >
          Apply from Dashboard
        </Link>
      );
    }
    return (
      <Link
        to={DASHBOARD_BY_ROLE[user.role] || "/"}
        className="w-full bg-[#F2F4F6] text-[#00236F] font-bold py-3 rounded-xl text-center block"
      >
        Go to Dashboard
      </Link>
    );
  };

  if (currentJobLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <SkeletonLine className="h-8 w-2/3 mb-4" />
        <SkeletonLine className="h-4 w-1/3 mb-8" />
        <SkeletonLine className="h-32 w-full" />
      </div>
    );
  }

  if (currentJobError || !currentJob) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-bold text-[#00236F]">Job not found</h1>
        <p className="text-[#64748B] text-sm mt-2">
          {currentJobError || "This job may have been closed or removed."}
        </p>
        <Link to="/jobs" className="text-[#00236F] font-semibold text-sm mt-4 inline-block hover:underline">
          ← Back to job search
        </Link>
      </div>
    );
  }

  const companyName =
    currentJob.employerId?.employerProfile?.companyName ||
    currentJob.company ||
    currentJob.employerId?.username ||
    "Confidential Employer";

  const salaryLabel =
    currentJob.salaryMin || currentJob.salaryMax
      ? `${currentJob.currency || "USD"} ${currentJob.salaryMin || 0}–${currentJob.salaryMax || currentJob.salaryMin}`
      : "Negotiable";

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/jobs" className="text-[#64748B] text-xs font-semibold flex items-center gap-2 mb-6 hover:text-[#00236F]">
          <FaArrowLeft /> Back to job search
        </Link>

        <div className="bg-white rounded-2xl border border-[#F2F4F6] shadow-sm p-8">
          <span className="inline-block bg-[#F2F4F6] text-[#00236F] text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
            {currentJob.category}
          </span>
          <h1 className="text-2xl font-extrabold text-[#191C1E]">{currentJob.title}</h1>
          <p className="text-[#64748B] text-sm mt-1 flex items-center gap-2">
            <FaBuilding className="text-[#00236F]" /> {companyName}
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-[#00236F]" />
              {currentJob.region !== "Other"
                ? REGION_LABELS[currentJob.region] || currentJob.region
                : currentJob.location}
            </span>
            <span className="flex items-center gap-1.5">
              <FaBriefcase className="text-[#00236F]" />
              {currentJob.employmentType}
            </span>
            <span className="flex items-center gap-1.5">
              <FaMoneyBillWave className="text-[#00236F]" />
              {salaryLabel}
            </span>
          </div>

          <div className="mt-8 border-t border-[#F2F4F6] pt-6">
            <h2 className="font-bold text-[#191C1E] text-sm mb-2">Job Description</h2>
            <p className="text-[#64748B] text-sm leading-relaxed whitespace-pre-line">
              {currentJob.description || "No description provided."}
            </p>
          </div>

          {currentJob.requiredSkills?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold text-[#191C1E] text-sm mb-2">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {currentJob.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-[#F2F4F6] text-[#00236F] text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">{renderApplyCta()}</div>
        </div>
      </div>
    </div>
  );
}
