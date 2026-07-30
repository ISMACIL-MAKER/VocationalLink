import { FaChartBar } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import DashboardShell from "./DashboardShell";

const NAV_ITEMS = [
  { label: "Dashboard", icon: FaChartBar, path: "/emmploye-Dashoard" },
  { label: "Profile", icon: CgProfile, path: "/employer-profile" },
];

export default function LayoutEmployer() {
  return <DashboardShell navItems={NAV_ITEMS} roleLabel="Employer" />;
}
