import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaUserClock,
  FaRegBookmark,
} from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";
import { fetchJobs } from "../features/JopSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardSeeker() {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.JOP);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hiddenJobIds, setHiddenJobIds] = useState([]);

  const Jops = jobs?.length || 0;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/Application/seeker/${user.id}`,
        );
        const data = await response.json();
        if (response.ok) {
          setApplications(data);
          const ids = data
            .map((application) => application?.jobId?._id)
            .filter(Boolean);
          setAppliedJobIds(ids);
        }
      } catch {
        // Ignore silently for now.
      }
    };
    fetchMyApplications();
  }, [user?.id]);

  useEffect(() => {
    const fetchHiddenJobs = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/User/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setHiddenJobIds((data.hiddenJobs || []).map((item) => String(item)));
        }
      } catch {
        // Ignore silently.
      }
    };
    fetchHiddenJobs();
  }, [user?.id]);

  const handleApply = async (job) => {
    if (!user?.id) {
      alert("Please login first.");
      return;
    }

    setApplyingJobId(job._id);
    try {
      const response = await fetch("http://localhost:5000/api/Application/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          seekerId: user.id,
          seekerName: user.username,
          seekerEmail: user.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to apply.");
        return;
      }

      setAppliedJobIds((prev) => [...new Set([...prev, job._id])]);
      setApplications((prev) => [
        ...prev,
        { _id: data?.application?._id || job._id, jobId: { _id: job._id }, status: "pending" },
      ]);
      alert("Application sent successfully.");
    } catch {
      alert("Server error while applying.");
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleHideJob = async (jobId) => {
    const confirmed = window.confirm("Hide this job from your list?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/Jop/${jobId}/hide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seekerId: user?.id, role: user?.role }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to hide job.");
        return;
      }
      setHiddenJobIds((prev) => [...new Set([...prev, String(jobId)])]);
      alert("Job hidden successfully.");
    } catch {
      alert("Server error while hiding job.");
    }
  };

  const visibleJobs = jobs.filter((job) => !hiddenJobIds.includes(String(job._id)));

  // 1. Stat Cards Data (Xogta kooban ee sare)
  const stats = [
    {
      id: 1,
      title: "Applications Sent",
      count: applications.length,
      icon: <FaUserClock />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: 2,
      title: "Accepted",
      count: applications.filter((item) => item.status === "accepted").length,
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

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-[#1E3A8A] text-2xl font-bold tracking-tight">
          Welcome back, {user?.username || "Ismail Rabiic"} 👋
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          You have{" "}
          <span className="text-[#10B981] font-semibold">
            {visibleJobs.length} new job matches
          </span>{" "}
          based on your skills.
        </p>
      </div>

      {/* STATS TILES (GRID SYSTEM) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-6 rounded-xl border border-[#F2F4F6] shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all"
          >
            <div className={`p-2.5 rounded-lg w-fit ${stat.color} text-lg`}>
              {stat.icon}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#191C1E]">
                {stat.count}
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-1">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT JOB RECOMMENDATIONS SECTION */}
      <div className="mb-6">
        <h2 className="text-[#191C1E] text-lg font-bold">
          Recent Job Recommendations
        </h2>
        <p className="text-[#64748B] text-xs">
          Tailored matches calculated by our skill-matching algorithm.
        </p>
      </div>

      {/* JOBS CONTAINER (DYNAMIC CONTAINER VIA MAP) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-xl border border-[#F2F4F6] shadow-sm flex flex-col justify-between h-64 hover:border-[#00236F] transition-all relative"
          >
            {/* Top Row: Company Icon & Match Score */}
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#F2F4F6] text-[#00236F] rounded-lg text-lg">
                <FaBriefcase />
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {job.matchScore}%
              </span>
            </div>

            {/* Middle Row: Job Titles & Info */}
            <div className="my-4">
              <h3
                className="text-[#1E3A8A] font-bold text-base truncate hover:text-clip"
                title={job.title}
              >
                {job.title}
              </h3>
              <p className="text-[#191C1E] text-sm font-medium mt-1">
                {job.company}
              </p>

              <p className="text-[#64748B] text-xs mt-0.5">{job.location}</p>
              <p className="text-[#191C1E] text-sm font-medium mt-1">
                <br />
                {job.Description}
              </p>
            </div>

            {/* Bottom Row: Apply Button */}
            <div className="w-full pt-2 grid grid-cols-2 gap-2">
              <button
                disabled={appliedJobIds.includes(job._id) || applyingJobId === job._id}
                onClick={() => handleApply(job)}
                className="w-full bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#94A3B8] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                {appliedJobIds.includes(job._id)
                  ? "Applied"
                  : applyingJobId === job._id
                    ? "Applying..."
                    : "Apply Now"}
              </button>
              <button
                onClick={() => handleHideJob(job._id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                Hide
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
