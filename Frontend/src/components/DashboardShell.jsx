import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSignOutAlt, FaBell, FaSearch, FaCog } from "react-icons/fa";
import toast from "react-hot-toast";
import { logoutUser } from "../features/authSlice";
import { fetchNotifications } from "../features/notificationSlice";

const DEFAULT_TOP_NAV = [{ label: "Messages" }, { label: "Explore", path: "/jobs" }];

export default function DashboardShell({
  navItems,
  roleLabel,
  topNavItems = DEFAULT_TOP_NAV,
  searchPlaceholder = "Search jobs, skills, or companies...",
  searchPath = "/jobs",
  searchParamName = "q",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");

  const { user } = useSelector((state) => state.auth);
  const { items: notifications } = useSelector((state) => state.notifications);
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
    }
  }, [dispatch, user?.id]);

  const isActive = (path) =>
    `${location.pathname}${location.search}` === path ||
    (location.pathname === path && !location.search);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/Login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const [base, existingQuery] = searchPath.split("?");
    const params = new URLSearchParams(existingQuery);
    if (searchValue.trim()) {
      params.set(searchParamName, searchValue.trim());
    }
    const queryString = params.toString();
    navigate(queryString ? `${base}?${queryString}` : base);
  };

  const profileNavItem = navItems.find((item) => item.label === "Profile") || navItems[0];

  return (
    <div className="bg-surface-alt min-h-screen flex flex-row">
      {/* SIDEBAR */}
      <div className="w-64 bg-surface border-r border-border flex flex-col justify-between p-5 h-screen sticky top-0">
        <div className="flex flex-col gap-6">
          <div className="text-primary font-bold text-xl tracking-wide px-2">
            <h1>VocationalLink</h1>
          </div>

          <div className="flex items-center gap-3 p-2 bg-surface-alt rounded-lg border border-border">
            <img
              className="w-10 h-10 rounded-full object-cover border border-border"
              src={
                user?.profileImage ||
                "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              }
              alt="Profile"
            />
            <div className="truncate">
              <h1 className="text-text font-bold text-sm truncate">
                {user?.username || roleLabel}
              </h1>
              <p className="text-text-secondary text-xs capitalize truncate">
                {user?.seekerProfile?.targetJobTitles?.[0] || user?.role || roleLabel}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 mt-2">
            {navItems.map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? "bg-success/10 text-success font-bold"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text"
                }`}
                onClick={() => navigate(path)}
              >
                <Icon className="text-base" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-border pt-4">
          <button
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-base" />
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <div className="bg-surface border-b border-border sticky top-0 z-40 flex items-center gap-4 px-6 py-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder={searchPlaceholder}
              className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm bg-surface-alt focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </form>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => navigate(navItems[0]?.path || "/")}
              className={`transition-colors ${
                isActive(navItems[0]?.path) ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
              }`}
            >
              Dashboard
            </button>
            {topNavItems.map((item) =>
              item.path ? (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <button
                  key={item.label}
                  onClick={() => toast("This feature is coming soon.")}
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => navigate(navItems[0]?.path || "/")}
              className="relative p-2 rounded-lg text-text-secondary hover:bg-surface-alt hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => toast("Settings are coming soon.")}
              className="p-2 rounded-lg text-text-secondary hover:bg-surface-alt hover:text-primary transition-colors"
              aria-label="Settings"
            >
              <FaCog />
            </button>
            <button onClick={() => navigate(profileNavItem?.path || "/")} aria-label="Your profile">
              <img
                className="w-8 h-8 rounded-full object-cover border border-border"
                src={
                  user?.profileImage ||
                  "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                }
                alt="Profile"
              />
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
