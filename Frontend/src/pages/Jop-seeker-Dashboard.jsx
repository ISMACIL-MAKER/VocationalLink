import { useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import OverviewTab from "./seeker/OverviewTab";
import PortfolioTab from "./seeker/PortfolioTab";
import ApplicationsTrackerTab from "./seeker/ApplicationsTrackerTab";

const TABS = [
  { id: "overview", label: "Browse Jobs" },
  { id: "portfolio", label: "Portfolio" },
  { id: "applications", label: "Applications" },
];

export default function DashboardSeeker() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useSelector((state) => state.auth);

  const skills = user?.seekerProfile?.skills || [];
  const hasVerifiedSkill = skills.some((skill) =>
    skill.certificates?.some((cert) => cert.verificationStatus === "verified"),
  );
  const hasPendingCert = skills.some((skill) =>
    skill.certificates?.some((cert) => cert.verificationStatus === "pending"),
  );

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      {/* VERIFICATION STATUS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          {hasVerifiedSkill ? (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
              <FaCheckCircle /> Verified Skill Badge
            </span>
          ) : hasPendingCert ? (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full">
              <FaHourglassHalf /> Pending Verification
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-[#F2F4F6] text-[#64748B] border border-[#E2E8F0] text-xs font-bold px-3 py-1.5 rounded-full">
              No Certificates Yet
            </span>
          )}
        </div>
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

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "portfolio" && <PortfolioTab />}
      {activeTab === "applications" && <ApplicationsTrackerTab />}
    </div>
  );
}
