import { useSearchParams } from "react-router-dom";
import OverviewTab from "./employer/OverviewTab";
import ATSPipelineTab from "./employer/ATSPipelineTab";
import SkillFinderTab from "./employer/SkillFinderTab";
import JobManagementTab from "./employer/JobManagementTab";

export default function DashboardEmployer() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  return (
    <div className="w-full bg-surface-alt min-h-screen">
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "ats" && <ATSPipelineTab />}
      {activeTab === "skillFinder" && <SkillFinderTab />}
      {activeTab === "jobs" && <JobManagementTab />}
    </div>
  );
}
