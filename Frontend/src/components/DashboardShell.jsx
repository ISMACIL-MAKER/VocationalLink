import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import { logoutUser } from "../features/authSlice";
import { fetchNotifications } from "../features/notificationSlice";

export default function DashboardShell({ navItems, roleLabel }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items: notifications } = useSelector((state) => state.notifications);
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
    }
  }, [dispatch, user?.id]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/Login");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-row">
      <div className="w-64 bg-white border-r border-[#F2F4F6] flex flex-col justify-between p-5 h-screen sticky top-0">
        <div className="flex flex-col gap-6">
          <div className="text-[#00236F] font-bold text-xl tracking-wide px-2">
            <h1>VocationalLink</h1>
          </div>

          <div className="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-lg border border-[#F2F4F6]">
            <img
              className="w-10 h-10 rounded-full object-cover border border-[#C5C5D3]"
              src={
                user?.profileImage ||
                "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              }
              alt="Profile"
            />
            <div className="truncate">
              <h1 className="text-[#191C1E] font-bold text-sm truncate">
                {user?.username || roleLabel}
              </h1>
              <p className="text-[#64748B] text-xs capitalize">
                {user?.role || roleLabel}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 mt-4">
            {navItems.map(({ label, icon: Icon, path }) => (
              <button
                key={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? "bg-[#F2F4F6] text-[#00236F] font-bold"
                    : "text-[#64748B] hover:bg-[#F2F4F6] hover:text-[#191C1E]"
                }`}
                onClick={() => navigate(path)}
              >
                <Icon className="text-[#1E3A8A] text-base" />
                {label}
              </button>
            ))}

            <button
              className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F2F4F6] hover:text-[#191C1E] transition-all"
              onClick={() => navigate(navItems[0]?.path || "/")}
            >
              <span className="flex items-center gap-3">
                <FaBell className="text-[#1E3A8A] text-base" />
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="border-t border-[#F2F4F6] pt-4">
          <button
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-base" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
