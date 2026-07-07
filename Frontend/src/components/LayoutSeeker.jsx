import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaUsers,
  FaCode,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export default function LayoutSeeker() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")),
  );
  const navigate = useNavigate();
  const location = useLocation(); // Si aan u ogaano bogga uu taagan yahay oo aan u 'active' gareyno link-ga
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/Notification/${currentUser.id}`,
        );
        const data = await response.json();
        if (!response.ok) return;
        setUnreadCount(data.filter((item) => !item.read).length);
      } catch {
        // ignore silent errors
      }
    };
    fetchUnread();
  }, [currentUser?.id]);

  useEffect(() => {
    const refreshUser = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("profile-updated", refreshUser);
    return () => window.removeEventListener("profile-updated", refreshUser);
  }, []);

  // Function lagu hubinayo bogga uu isticmaalahu taagan yahay si loogu iftiimiyo
  const isActive = (path) => location.pathname === path;

  return (
    // Isbedel: 'flex-row' si uu nidaamku u noqdo mid dhinac walba iska ag fadhiyo
    <div className="bg-[#F8FAFC] min-h-screen flex flex-row">
      
      {/* ---------------- SIDEBAR (BIDIX) ---------------- */}
      <div className="w-64 bg-white border-r border-[#F2F4F6] flex flex-col justify-between p-5 h-screen sticky top-0">
        
        {/* Top: Logo & Profile */}
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="text-[#00236F] font-bold text-xl tracking-wide px-2">
            <h1>VocationalLink</h1>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-lg border border-[#F2F4F6]">
            <img
              className="w-10 h-10 rounded-full object-cover border border-[#C5C5D3]"
              src={
                currentUser?.profileImage ||
                "https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              }
              alt="Profile"
            />
            <div className="truncate">
              <h1 className="text-[#191C1E] font-bold text-sm truncate">
                {currentUser?.username || "Ismail Rabiic"}
              </h1>
              <p className="text-[#64748B] text-xs capitalize">
                {currentUser?.role || "Job Seeker"}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mt-4">
            <button
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/Jop-seeker-Dashboard")
                  ? "bg-[#F2F4F6] text-[#00236F] font-bold"
                  : "text-[#64748B] hover:bg-[#F2F4F6] hover:text-[#191C1E]"
              }`}
              onClick={() => navigate("/Jop-seeker-Dashboard")}
            >
              <FaChartBar className="text-[#1E3A8A] text-base" />
              Dashboard
            </button>

            <button
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/seeker-profile")
                  ? "bg-[#F2F4F6] text-[#00236F] font-bold"
                  : "text-[#64748B] hover:bg-[#F2F4F6] hover:text-[#191C1E]"
              }`}
              onClick={() => navigate("/seeker-profile")}
            >
              <CgProfile className="text-[#1E3A8A] text-lg" />
              Profile
            </button>

           
            
            <button
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/Applications")
                  ? "bg-[#F2F4F6] text-[#00236F] font-bold"
                  : "text-[#64748B] hover:bg-[#F2F4F6] hover:text-[#191C1E]"
              }`}
              onClick={() => navigate("/Applications")}
            >
              <FaUsers className="text-[#1E3A8A] text-base" />
              Applications
            </button>

            <button
              className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F2F4F6] hover:text-[#191C1E] transition-all"
              onClick={() => navigate("/Applications")}
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

        {/* Bottom: Logout Section */}
        <div className="border-t border-[#F2F4F6] pt-4">
          <button
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            onClick={() => {
              localStorage.removeItem("user"); // Waa muhiim in session-ka la furao marka la baxayo
              navigate("/");
            }}
          >
            <FaSignOutAlt className="text-base" />
            Sign Out
          </button>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT AREA (MIDIG) ---------------- */}
      {/* Qaybtaan waxay qaadanaysaa inta soo hartay ee shaashadda, dhexdeedana waxaa ku furmaya boggaga kale */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}