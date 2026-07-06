import { useState } from "react";
import {
  FaGooglePlay,
  FaBriefcase,
  FaUserClock,
  FaRegBookmark,
} from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function Dashoard_employe() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { jobs, loading, error } = useSelector((state) => state.JOP);
  const Jops = jobs?.length || 0;

  console.log(jobs);
  // 1. Stat Cards Data (Xogta kooban ee sare)
  const stats = [
    {
      id: 1,
      title: "Applications Sent",
      count: 24,
      icon: <FaUserClock />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: 2,
      title: "Total Applicants",
      count: 3,
      icon: <IoCalendarClearOutline />,
      color: "text-emerald-600 bg-emerald-50",
    },
 
  ];

  // 2. Mock Job Recommendations (Halkan hadhow waxaa fariisan doona xogta backend-ka)
  const [jobss, setJobs] = useState([
    {
      id: 1,
      title: "Senior UX Designer",
      company: "NovaStream Technologies",
      location: "Remote / San Francisco",
      matchScore: "94%",
    },
    {
      id: 2,
      title: "Frontend Developer (React)",
      company: "Ayan Software Solutions",
      location: "Hargeisa, Somalia",
      matchScore: "88%",
    },
    {
      id: 3,
      title: "Product UI Designer",
      company: "CreativeHub Middle East",
      location: "Hybrid / Dubai",
      matchScore: "90%",
    },
  ]);

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
      
      </div>

      {/* JOBS CONTAINER (DYNAMIC CONTAINER VIA MAP) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobss.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-xl border border-[#F2F4F6] shadow-sm flex flex-col justify-between h-64 hover:border-[#00236F] transition-all relative"
          >
            {/* Top Row: Company Icon & Match Score */}
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#F2F4F6] text-[#00236F] rounded-lg text-lg">
                <FaBriefcase />
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {job.matchScore} Match
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
            </div>

            {/* Bottom Row: Apply Button */}
            <div className="w-full pt-2">
              <button className="w-full bg-[#00236F] hover:bg-[#1E3A8A] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
