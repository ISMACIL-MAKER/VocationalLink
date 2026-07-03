import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      side bar
      <div>
        <Outlet />
      </div>
    </div>
  );
}
