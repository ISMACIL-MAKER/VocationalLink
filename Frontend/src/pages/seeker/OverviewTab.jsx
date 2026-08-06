import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaBriefcase, FaPaperPlane, FaMapMarkerAlt, FaBolt, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { fetchJobs, hideJob } from "../../features/jobSlice";
import { fetchSeekerApplications, applyToJob } from "../../features/applicationSlice";
import { SkeletonJobCard } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatEmploymentType = (type) =>
  type ? type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ") : null;

export default function OverviewTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { seekerApplications } = useSelector((state) => state.applications);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [hidingJobId, setHidingJobId] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchSeekerApplications());
  }, [dispatch]);

  const skills = user?.seekerProfile?.skills || [];
  const hasVerifiedSkill = skills.some((skill) =>
    skill.certificates?.some((cert) => cert.verificationStatus === "verified"),
  );
  const hasPendingCert = skills.some((skill) =>
    skill.certificates?.some((cert) => cert.verificationStatus === "pending"),
  );

  const appliedJobIds = useMemo(
    () => new Set(seekerApplications.map((app) => app?.jobId?._id).filter(Boolean)),
    [seekerApplications],
  );
  const hiddenJobIds = useMemo(
    () => new Set((user?.hiddenJobs || []).map((id) => String(id))),
    [user?.hiddenJobs],
  );
  const visibleJobs = jobs.filter((job) => !hiddenJobIds.has(String(job._id)));

  const interviews = seekerApplications.filter((app) => app.status === "interview_scheduled");
  const nextInterviewLabel = useMemo(() => {
    const upcoming = interviews
      .map((app) => app.interview?.scheduledAt)
      .filter(Boolean)
      .map((date) => new Date(date))
      .sort((a, b) => a - b)[0];
    return upcoming ? `Next: ${WEEKDAYS[upcoming.getDay()]}` : null;
  }, [interviews]);

  const stats = [
    {
      id: 1,
      title: "Applications Sent",
      count: seekerApplications.length,
      hint: null,
      icon: <FaPaperPlane />,
      color: "text-primary bg-primary/10",
    },
    {
      id: 2,
      title: "Interviews Scheduled",
      count: interviews.length,
      hint: nextInterviewLabel,
      icon: <FaRegCalendarCheck />,
      color: "text-success bg-success/10",
    },
    {
      id: 3,
      title: "Available Jobs",
      count: visibleJobs.length,
      hint: visibleJobs.length > 0 ? "Open Now" : null,
      icon: <FaBriefcase />,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const handleApply = async (job) => {
    setApplyingJobId(job._id);
    await dispatch(applyToJob({ jobId: job._id }));
    setApplyingJobId(null);
  };

  const handleHide = async (jobId) => {
    setHidingJobId(jobId);
    const result = await dispatch(hideJob({ jobId }));
    if (hideJob.fulfilled.match(result)) {
      toast.success("Job hidden from your list.");
    } else {
      toast.error(result.payload || "Failed to hide job.");
    }
    setHidingJobId(null);
  };

  return (
    <div>
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-primary text-2xl font-bold tracking-tight">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            You have{" "}
            <span className="text-success font-semibold">
              {visibleJobs.length} new job matches
            </span>{" "}
            based on your skills.
          </p>
        </div>

        {hasVerifiedSkill ? (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
            <FaCheckCircle /> Verified Skill Badge
          </span>
        ) : hasPendingCert ? (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
            <FaHourglassHalf /> Pending Verification
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-surface-alt text-text-secondary border border-border text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
            No Certificates Yet
          </span>
        )}
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg w-fit ${stat.color} text-lg`}>{stat.icon}</div>
              {stat.hint && (
                <span className="text-[10px] font-bold text-text-secondary bg-surface-alt px-2 py-1 rounded-full">
                  {stat.hint}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-text">{stat.count}</h2>
              <p className="text-xs text-text-secondary font-medium mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT JOB RECOMMENDATIONS */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-text text-lg font-bold">Recent Job Recommendations</h2>
          <p className="text-text-secondary text-xs">
            Tailored matches calculated by our skill-matching algorithm.
          </p>
        </div>
        <Link to="/jobs" className="text-primary text-sm font-semibold hover:underline shrink-0">
          View All Matches →
        </Link>
      </div>

      {jobsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonJobCard key={idx} />
          ))}
        </div>
      ) : visibleJobs.length === 0 ? (
        <EmptyState
          icon={FaBriefcase}
          title="No job matches yet"
          description="Build out your Skills portfolio so we can match you with the right vocational jobs."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleJobs.map((job) => {
            const matchScore = job.matchScore ? Number(job.matchScore) : null;
            const tags = [
              ...(job.requiredSkills || []).slice(0, 2),
              formatEmploymentType(job.employmentType),
            ].filter(Boolean);

            return (
              <div
                key={job._id}
                className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between h-64 hover:border-primary transition-all relative"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-surface-alt text-primary rounded-lg text-lg">
                    <FaBriefcase />
                  </div>
                  {matchScore != null && (
                    <span className="bg-success/10 text-success text-xs font-bold px-2.5 py-1 rounded-full border border-success/20">
                      {matchScore >= 80 ? "High Match" : `${matchScore}% Match`}
                    </span>
                  )}
                </div>

                <div className="my-4">
                  <h3 className="text-primary font-bold text-base truncate" title={job.title}>
                    {job.title}
                  </h3>
                  <p className="text-text text-sm font-medium mt-1">{job.company}</p>
                  <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[10px]" /> {job.location}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold bg-surface-alt text-text-secondary px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full pt-2 grid grid-cols-2 gap-2">
                  <button
                    disabled={appliedJobIds.has(job._id) || applyingJobId === job._id}
                    onClick={() => handleApply(job)}
                    className="w-full bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-secondary text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {appliedJobIds.has(job._id) ? (
                      "Applied"
                    ) : applyingJobId === job._id ? (
                      "Applying..."
                    ) : (
                      <>
                        <FaBolt /> Apply Now
                      </>
                    )}
                  </button>
                  <button
                    disabled={hidingJobId === job._id}
                    onClick={() => handleHide(job._id)}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                  >
                    {hidingJobId === job._id ? "Hiding..." : "Hide"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
