import { FaChartBar, FaBuilding, FaPlusCircle, FaBriefcase, FaUsers, FaSearch } from "react-icons/fa";
import DashboardShell from "./DashboardShell";

const NAV_ITEMS = [
  { label: "Dashboard", icon: FaChartBar, path: "/emmploye-Dashoard?tab=overview" },
  { label: "Company Profile", icon: FaBuilding, path: "/employer-profile" },
  { label: "Post Job", icon: FaPlusCircle, path: "/emmploye-Dashoard?tab=jobs&new=1" },
  { label: "My Jobs", icon: FaBriefcase, path: "/emmploye-Dashoard?tab=jobs" },
  { label: "Applicants", icon: FaUsers, path: "/emmploye-Dashoard?tab=ats" },
  { label: "Talent Search", icon: FaSearch, path: "/emmploye-Dashoard?tab=skillFinder" },
];

const TOP_NAV_ITEMS = [{ label: "Messages" }, { label: "Explore Talent", path: "/emmploye-Dashoard?tab=skillFinder" }];

export default function LayoutEmployer() {
  return (
    <DashboardShell
      navItems={NAV_ITEMS}
      roleLabel="Employer"
      topNavItems={TOP_NAV_ITEMS}
      searchPlaceholder="Search applicants, jobs, or skills..."
      searchPath="/emmploye-Dashoard?tab=skillFinder"
      searchParamName="skillName"
    />
  );
}
