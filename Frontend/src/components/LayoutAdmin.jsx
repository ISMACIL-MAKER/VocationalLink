import { FaChartBar } from "react-icons/fa";
import DashboardShell from "./DashboardShell";

const NAV_ITEMS = [{ label: "Dashboard", icon: FaChartBar, path: "/admin-dashboard" }];

export default function LayoutAdmin() {
  return <DashboardShell navItems={NAV_ITEMS} roleLabel="Super Admin" />;
}
