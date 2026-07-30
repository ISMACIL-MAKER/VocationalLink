import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaBriefcase, FaUserClock, FaRegBookmark } from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";
import { fetchJobs, hideJob } from "../../features/jobSlice";
import { fetchSeekerApplications, applyToJob } from "../../features/applicationSlice";
import { SkeletonJobCard } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

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

  const appliedJobIds = useMemo(
    () => new Set(seekerApplications.map((app) => app?.jobId?._id).filter(Boolean)),
    [seekerApplications],
  );
  const hiddenJobIds = useMemo(
    () => new Set((user?.hiddenJobs || []).map((id) => String(id))),
    [user?.hiddenJobs],
  );
  const visibleJobs = jobs.filter((job) => !hiddenJobIds.has(String(job._id)));

  const stats = [
    {
      id: 1,
      title: "Applications Sent",
      count: seekerApplications.length,
      icon: <FaUserClock />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: 2,
      title: "Hired",
      count: seekerApplications.filter((item) => item.status === "hired").length,
      icon: <IoCalendarClearOutline />,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: 3,
      title: "Available Jobs",
      count: visibleJobs.length,
      icon: <FaRegBookmark />,
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
      <div className="mb-8">
        <h1 className="text-[#1E3A8A] text-2xl font-bold tracking-tight">
          Welcome back, {user?.username} 👋
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          You have{" "}
          <span className="text-[#10B981] font-semibold">
            {visibleJobs.length} new job matches
          </span>{" "}
          based on your skills.
        </p>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-6 rounded-xl border border-[#F2F4F6] shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all"
          >
            <div className={`p-2.5 rounded-lg w-fit ${stat.color} text-lg`}>{stat.icon}</div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#191C1E]">{stat.count}</h2>
              <p className="text-xs text-[#64748B] font-medium mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT JOB RECOMMENDATIONS */}
      <div className="mb-6">
        <h2 className="text-[#191C1E] text-lg font-bold">Recent Job Recommendations</h2>
        <p className="text-[#64748B] text-xs">
          Tailored matches calculated by our skill-matching algorithm.
        </p>
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
          description="Build out your Portfolio skill matrix so we can match you with the right vocational jobs."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl border border-[#F2F4F6] shadow-sm flex flex-col justify-between h-64 hover:border-[#00236F] transition-all relative"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#F2F4F6] text-[#00236F] rounded-lg text-lg">
                  <FaBriefcase />
                </div>
                {job.matchScore && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {job.matchScore}%
                  </span>
                )}
              </div>

              <div className="my-4">
                <h3 className="text-[#1E3A8A] font-bold text-base truncate" title={job.title}>
                  {job.title}
                </h3>
                <p className="text-[#191C1E] text-sm font-medium mt-1">{job.company}</p>
                <p className="text-[#64748B] text-xs mt-0.5">{job.location}</p>
                <p className="text-[#64748B] text-xs mt-1 line-clamp-2">{job.description}</p>
              </div>

              <div className="w-full pt-2 grid grid-cols-2 gap-2">
                <button
                  disabled={appliedJobIds.has(job._id) || applyingJobId === job._id}
                  onClick={() => handleApply(job)}
                  className="w-full bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#94A3B8] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                >
                  {appliedJobIds.has(job._id)
                    ? "Applied"
                    : applyingJobId === job._id
                      ? "Applying..."
                      : "Apply Now"}
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
          ))}
        </div>
      )}
    </div>
  );
}
