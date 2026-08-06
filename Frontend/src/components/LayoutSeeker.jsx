import { FaChartBar, FaUser, FaTools, FaFileAlt, FaSearch, FaClipboardList } from "react-icons/fa";
import DashboardShell from "./DashboardShell";

const NAV_ITEMS = [
  { label: "Dashboard", icon: FaChartBar, path: "/Jop-seeker-Dashboard?tab=overview" },
  { label: "Profile", icon: FaUser, path: "/Jop-seeker-Dashboard?tab=profile" },
  { label: "Skills", icon: FaTools, path: "/Jop-seeker-Dashboard?tab=skills" },
  { label: "My CV", icon: FaFileAlt, path: "/Jop-seeker-Dashboard?tab=cv" },
  { label: "Search Jobs", icon: FaSearch, path: "/jobs" },
  { label: "Applications", icon: FaClipboardList, path: "/Jop-seeker-Dashboard?tab=applications" },
];

export default function LayoutSeeker() {
  return <DashboardShell navItems={NAV_ITEMS} roleLabel="Job Seeker" />;
}
