import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUsers, FaBriefcase, FaClipboardCheck, FaCoins } from "react-icons/fa";
import { fetchAdminAnalytics } from "../features/adminSlice";
import VerificationPortalTab from "./admin/VerificationPortalTab";
import PaymentApprovalTab from "./admin/PaymentApprovalTab";
import EmployerApprovalTab from "./admin/EmployerApprovalTab";
import MarketAnalyticsTab from "./admin/MarketAnalyticsTab";

const TABS = [
  { id: "verifications", label: "Skill Verification Portal" },
  { id: "payments", label: "Payment Approval Gate" },
  { id: "employers", label: "Employer Approval Portal" },
  { id: "analytics", label: "Market Analytics & Audit Logs" },
];

function KpiCard({ icon: Icon, label, value, accent }) {
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

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("verifications");
  const { user } = useSelector((state) => state.auth);
  const { analytics } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  const totalUsers =
    analytics.userBreakdown.seekers +
    analytics.userBreakdown.employers +
    analytics.userBreakdown.admins;

  const revenueLabel =
    analytics.revenue.length > 0
      ? analytics.revenue.map((entry) => `${entry.total.toLocaleString()} ${entry.currency}`).join(" + ")
      : "0";

  const kpis = [
    { label: "Total Users", value: totalUsers, icon: FaUsers, accent: "bg-blue-50 text-blue-600" },
    {
      label: "Active Jobs",
      value: analytics.totalActiveJobs,
      icon: FaBriefcase,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending Approvals",
      value: analytics.pendingApprovals.total,
      icon: FaClipboardCheck,
      accent: "bg-amber-50 text-amber-600",
    },
    { label: "Total Revenue", value: revenueLabel, icon: FaCoins, accent: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-[#1E3A8A] text-2xl font-bold tracking-tight">
          Super-Admin Dashboard
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          Welcome, {user?.username}. Here's the global platform overview.
        </p>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
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

      {activeTab === "verifications" && <VerificationPortalTab />}
      {activeTab === "payments" && <PaymentApprovalTab />}
      {activeTab === "employers" && <EmployerApprovalTab />}
      {activeTab === "analytics" && <MarketAnalyticsTab />}
    </div>
  );
}
