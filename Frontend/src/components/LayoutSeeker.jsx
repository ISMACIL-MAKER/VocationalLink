import { FaChartBar } from "react-icons/fa";
import DashboardShell from "./DashboardShell";

const NAV_ITEMS = [{ label: "Dashboard", icon: FaChartBar, path: "/Jop-seeker-Dashboard" }];

export default function LayoutSeeker() {
  return <DashboardShell navItems={NAV_ITEMS} roleLabel="Job Seeker" />;
}
