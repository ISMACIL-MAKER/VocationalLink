import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaBriefcase,
  FaUsers,
  FaStar,
  FaCreditCard,
} from "react-icons/fa";
import { fetchEmployerJobs, fetchEmployerApplications } from "../features/employerSlice";
import ATSPipelineTab from "./employer/ATSPipelineTab";
import SkillFinderTab from "./employer/SkillFinderTab";
import JobManagementTab from "./employer/JobManagementTab";

const TABS = [
  { id: "ats", label: "ATS Candidate Pipeline" },
  { id: "skillFinder", label: "Vocational Skill Finder" },
  { id: "jobs", label: "Job Management" },
];

const REGISTRATION_BADGE = {
  not_submitted: {
    label: "Registration Not Submitted",
    icon: FaHourglassHalf,
    className: "bg-[#F2F4F6] text-[#64748B] border-[#E2E8F0]",
  },
  pending: {
    label: "Pending Registration",
    icon: FaHourglassHalf,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved: {
    label: "Registered Employer",
    icon: FaCheckCircle,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Registration Rejected",
    icon: FaTimesCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-[#F2F4F6] shadow-sm hover:shadow-md transition-all">
      <div className={`p-2.5 rounded-lg w-fit text-lg ${accent}`}>
        <Icon />
      </div>
      <h2 className="text-2xl font-extrabold text-[#191C1E] mt-3">{value}</h2>
      <p className="text-xs text-[#64748B] font-medium mt-1">{label}</p>
    </div>
  );
}

export default function DashboardEmployer() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("ats");
  const { user } = useSelector((state) => state.auth);
  const { jobs, applications } = useSelector((state) => state.employer);
  const employerProfile = user?.employerProfile || {};

  useEffect(() => {
    dispatch(fetchEmployerJobs());
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  const registration =
    REGISTRATION_BADGE[employerProfile.registrationStatus] ||
    REGISTRATION_BADGE.not_submitted;
  const RegistrationIcon = registration.icon;

  const isSubscriptionActive = employerProfile.subscriptionStatus === "active";
  const tierLabel = employerProfile.subscriptionTier
    ? employerProfile.subscriptionTier.charAt(0).toUpperCase() +
      employerProfile.subscriptionTier.slice(1)
    : "Free";

  const stats = [
    {
      label: "Total Active Jobs",
      value: jobs.filter((job) => job.status === "active").length,
      icon: FaBriefcase,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Applicants",
      value: applications.length,
      icon: FaUsers,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Shortlisted Candidates",
      value: applications.filter((app) => app.status === "shortlisted").length,
      icon: FaStar,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Pending Payment",
      value: jobs.filter((job) => job.status === "pending_payment").length,
      icon: FaCreditCard,
      accent: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[#1E3A8A] text-2xl font-bold tracking-tight">
            Employer Dashboard
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Welcome back, {employerProfile.companyName || user?.username}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${registration.className}`}
          >
            <RegistrationIcon /> {registration.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
              isSubscriptionActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-[#F2F4F6] text-[#64748B] border-[#E2E8F0]"
            }`}
          >
            {isSubscriptionActive ? `${tierLabel} Plan — Active` : "Free Tier"}
          </span>
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-2 border-b border-[#E2E8F0] mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-[#00236F] text-[#00236F]"
                : "border-transparent text-[#64748B] hover:text-[#191C1E]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "ats" && <ATSPipelineTab />}
      {activeTab === "skillFinder" && <SkillFinderTab />}
      {activeTab === "jobs" && <JobManagementTab />}
    </div>
  );
}
