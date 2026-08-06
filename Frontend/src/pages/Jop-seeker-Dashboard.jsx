import { useSearchParams } from "react-router-dom";
import OverviewTab from "./seeker/OverviewTab";
import ProfileTab from "./seeker/ProfileTab";
import SkillsTab from "./seeker/SkillsTab";
import CvTab from "./seeker/CvTab";
import ApplicationsTrackerTab from "./seeker/ApplicationsTrackerTab";

export default function DashboardSeeker() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  return (
    <div className="w-full bg-surface-alt min-h-screen">
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "skills" && <SkillsTab />}
      {activeTab === "cv" && <CvTab />}
      {activeTab === "applications" && <ApplicationsTrackerTab />}
    </div>
  );
}
