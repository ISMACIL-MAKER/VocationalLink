import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="bg-blue-500 h-screen w-40">
      side bar
      <div>
        <Outlet />
      </div>
    </div>
  );
}
