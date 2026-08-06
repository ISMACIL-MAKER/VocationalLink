import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from "react-icons/fa";
import { fetchFeaturedJobs } from "../features/jobSlice";
import { applyToJob } from "../features/applicationSlice";
import { SkeletonJobCard } from "./Skeleton";
import EmptyState from "./EmptyState";
import { REGION_LABELS } from "../constants/enums";

function QuickApplyButton({ jobId }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [status, setStatus] = useState("idle"); // idle | applying | applied | error

  if (!token || !user) {
    return (
      <Link
        to="/Login"
        className="w-full text-center bg-surface-alt text-primary font-bold text-xs py-2.5 rounded-lg hover:bg-border transition-colors"
      >
        Login to Apply
      </Link>
    );
  }

  if (user.role !== "Job-Seeker") {
    return (
      <Link
        to={`/jobs/${jobId}`}
        className="w-full text-center bg-surface-alt text-primary font-bold text-xs py-2.5 rounded-lg hover:bg-border transition-colors"
      >
        View Details
      </Link>
    );
  }

  const handleQuickApply = async () => {
    setStatus("applying");
    const result = await dispatch(applyToJob({ jobId }));
    setStatus(applyToJob.fulfilled.match(result) ? "applied" : "error");
  };

  if (status === "applied") {
    return (
      <span className="w-full text-center bg-success/10 text-success-dark font-bold text-xs py-2.5 rounded-lg block">
        ✔️ Applied
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleQuickApply}
        disabled={status === "applying"}
        className="w-full bg-primary hover:bg-primary-dark disabled:bg-border text-white font-bold text-xs py-2.5 rounded-lg transition-colors"
      >
        {status === "applying" ? "Applying..." : "Quick Apply"}
      </button>
      {status === "error" && (
        <span className="text-[10px] text-red-600 text-center">
          Could not submit application. Try again.
        </span>
      )}
    </div>
  );
}

export default function FeaturedJobsSection() {
  const dispatch = useDispatch();
  const { featuredJobs, featuredLoading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchFeaturedJobs());
  }, [dispatch]);

  return (
    <div className="bg-surface py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">Latest Featured Jobs</h2>
            <p className="text-xs text-text-secondary mt-1">
              Fresh vocational opportunities posted by verified employers.
            </p>
          </div>
          <Link to="/jobs" className="text-primary text-xs font-bold hover:underline">
            View all jobs →
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonJobCard key={idx} />
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <EmptyState
            icon={FaBriefcase}
            title="No jobs posted yet"
            description="Verified employers haven't posted any active jobs yet. Check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => {
              const companyName =
                job.employerId?.employerProfile?.companyName ||
                job.company ||
                job.employerId?.username ||
                "Confidential Employer";
              const logo = job.employerId?.employerProfile?.companyLogo;
              const salaryLabel =
                job.salaryMin || job.salaryMax
                  ? `${job.currency || "USD"} ${job.salaryMin || 0}–${job.salaryMax || job.salaryMin}`
                  : "Negotiable";

              return (
                <div
                  key={job._id}
                  className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {logo ? (
                        <img
                          src={logo}
                          alt={companyName}
                          className="w-10 h-10 rounded-xl object-cover border border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-surface-alt text-primary font-bold flex items-center justify-center text-sm">
                          {companyName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-text font-bold text-xs truncate">{companyName}</p>
                        <span className="text-[10px] text-text-secondary">{job.category}</span>
                      </div>
                    </div>

                    <Link to={`/jobs/${job._id}`}>
                      <h3 className="text-primary font-bold text-base line-clamp-2 hover:underline">
                        {job.title}
                      </h3>
                    </Link>

                    <div className="flex flex-col gap-1.5 mt-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-primary" />
                        {job.region !== "Other"
                          ? REGION_LABELS[job.region] || job.region
                          : job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaBriefcase className="text-primary" />
                        {job.employmentType}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaMoneyBillWave className="text-primary" />
                        {salaryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <QuickApplyButton jobId={job._id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
