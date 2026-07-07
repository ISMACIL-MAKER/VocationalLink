import { useEffect, useState } from "react";
import { FaBriefcase, FaUserClock } from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";

export default function Dashoard_employe() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  const fetchEmployerApplications = async () => {
    if (!user?.id) {
      setAppLoading(false);
      return;
    }
    try {
      const [appRes, notifRes, jobRes] = await Promise.all([
        fetch(`http://localhost:5000/api/Application/employer/${user.id}`),
        fetch(`http://localhost:5000/api/Notification/${user.id}`),
        fetch("http://localhost:5000/api/Jop/recentJop"),
      ]);
      const appData = await appRes.json();
      const notifData = await notifRes.json();
      const jobData = await jobRes.json();
      if (appRes.ok) {
        setApplications(appData);
      }
      if (notifRes.ok) {
        setNotifications(notifData);
      }
      if (jobRes.ok) {
        setJobs(jobData);
      }
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerApplications();
  }, [user?.id]);

  const handleUpdateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/Application/${applicationId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employerId: user?.id, status }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to update status.");
        return;
      }
      setApplications((prev) =>
        prev.map((item) =>
          item._id === applicationId ? { ...item, status: data.application.status } : item,
        ),
      );
    } catch {
      alert("Server error while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const jobOptions = Array.from(
    new Map(
      applications
        .filter((item) => item?.jobId?._id)
        .map((item) => [item.jobId._id, { id: item.jobId._id, title: item.jobId.title }]),
    ).values(),
  );

  const filteredApplications =
    selectedJobId === "all"
      ? applications
      : applications.filter((item) => item?.jobId?._id === selectedJobId);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/Notification/${notificationId}/read`,
        { method: "PUT" },
      );
      if (!response.ok) return;
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, read: true } : item,
        ),
      );
    } catch {
      // ignore network errors
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    setDeletingJobId(jobId);
    try {
      const response = await fetch(`http://localhost:5000/api/Jop/${jobId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: user?.id, role: user?.role }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to delete job.");
        return;
      }

      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      setApplications((prev) => prev.filter((item) => item?.jobId?._id !== jobId));
      alert("Job deleted successfully.");
    } catch {
      alert("Server error while deleting job.");
    } finally {
      setDeletingJobId(null);
    }
  };

  const myJobs = jobs.filter(
    (job) => String(job.employerId || job.id || "") === String(user?.id || ""),
  );

  // 1. Stat Cards Data (Xogta kooban ee sare)
  const stats = [
    {
      id: 1,
      title: "Pending Review",
      count: applications.filter((item) => item.status === "pending").length,
      icon: <FaUserClock />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: 2,
      title: "Total Applicants",
      count: applications.length,
      icon: <IoCalendarClearOutline />,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: 3,
      title: "Accepted",
      count: applications.filter((item) => item.status === "accepted").length,
      icon: <FaBriefcase />,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-[#1E3A8A] text-2xl font-bold tracking-tight">
        Employer Dashboard  
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          Welcome back, Alex. Here's what's happening with your recruitment.
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
       Recent Applicants
        </h2>
        <div className="mt-3 max-w-xs">
          <label className="text-xs font-semibold text-[#475569]">Filter by Job Post</label>
          <select
            className="w-full mt-1 border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm bg-white"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="all">All Jobs</option>
            {jobOptions.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-[#191C1E] text-lg font-bold mb-2">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-[#64748B]">No notifications yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {notifications.slice(0, 5).map((note) => (
              <div
                key={note._id}
                className={`bg-white border rounded-xl p-4 shadow-sm ${
                  note.read ? "border-[#E2E8F0]" : "border-[#BFDBFE]"
                }`}
              >
                <h3 className="text-sm font-semibold text-[#1E293B]">{note.title}</h3>
                <p className="text-sm text-[#475569] mt-1">{note.message}</p>
                {!note.read && (
                  <button
                    onClick={() => markAsRead(note._id)}
                    className="mt-2 text-xs text-[#1D4ED8] font-semibold"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-[#191C1E] text-lg font-bold mb-2">My Posted Jobs</h2>
        {myJobs.length === 0 ? (
          <p className="text-sm text-[#64748B]">No jobs posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm"
              >
                <h3 className="text-sm font-bold text-[#1E3A8A]">{job.title}</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  {job.company} - {job.location}
                </p>
                <button
                  disabled={deletingJobId === job._id}
                  onClick={() => handleDeleteJob(job._id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white text-xs font-bold py-2 px-3 rounded-lg"
                >
                  {deletingJobId === job._id ? "Deleting..." : "Delete Job"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JOBS CONTAINER (DYNAMIC CONTAINER VIA MAP) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {appLoading && (
          <p className="text-sm text-[#64748B]">Loading applicants...</p>
        )}
        {!appLoading && filteredApplications.length === 0 && (
          <p className="text-sm text-[#64748B]">No applicants yet.</p>
        )}
        {filteredApplications.map((application) => (
          <div
            key={application._id}
            className="bg-white p-6 rounded-xl border border-[#F2F4F6] shadow-sm flex flex-col justify-between min-h-64 hover:border-[#00236F] transition-all relative"
          >
            {/* Top Row: Company Icon & Match Score */}
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#F2F4F6] text-[#00236F] rounded-lg text-lg">
                <FaBriefcase />
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {application?.jobId?.matchScore || "N/A"}% Match
              </span>
            </div>

            {/* Middle Row: Job Titles & Info */}
            <div className="my-4">
              <h3
                className="text-[#1E3A8A] font-bold text-base truncate hover:text-clip"
                title={application?.jobId?.title}
              >
                {application?.jobId?.title || "Job deleted"}
              </h3>
              <p className="text-[#191C1E] text-sm font-medium mt-1">
                {application.seekerName}
              </p>
              <p className="text-[#64748B] text-xs mt-0.5">{application.seekerEmail}</p>
            </div>

            {/* Bottom Row: Apply Button */}
            <div className="w-full pt-2">
              <div className="w-full bg-[#EFF6FF] text-[#1E3A8A] text-xs font-bold py-2 px-4 rounded-lg text-center mb-2">
                Status: {application.status}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={updatingId === application._id}
                  onClick={() => handleUpdateStatus(application._id, "accepted")}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold py-2 px-3 rounded-lg"
                >
                  Accept
                </button>
                <button
                  disabled={updatingId === application._id}
                  onClick={() => handleUpdateStatus(application._id, "rejected")}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white text-xs font-bold py-2 px-3 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
