import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaArchive,
  FaDatabase,
  FaCode,
  FaLifeRing,
  FaSignOutAlt,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
{
  /*
     #1E3A8A
     #10B981
     #64748B
     #F8FAFC
     #C5C5D3
     #C5C5D3
     #FFFFFF
     #F2F4F6
     #F2F4F6
     #191C1E
     #00236F
    */
}

export default function LayoutSeeker() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  return (
    <div className="bg-[#F2F4F6] min-h-screen w-50 flex flex-col justify-around">
      {/* 
      sidebar head
      */}
      <div className=" ">
        <div className="mb-2 text-[#00236F] font-bold p-4">
          <h1 className="text-[20px] ">VocationalLink</h1>
        </div>

        <div className=" flex flex-row text-sm  ">
          <img
            className="w-10 h-12 rounded-full "
            src="https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
          />
          <div className="pl-2">
            <h1 className="text-[#191C1E] font-bold">{user?.username}</h1>
            <p className="text-[#444651]">{user?.role}</p>
          </div>
        </div>
      </div>
      {/* 
      sidebar links
      */}

      <nav className=" flex flex-col pl-5 gap-10 mb-4 text-sm">
        <div
          className="flex items-center gap-2 hover:bg-[#6CF8BB] hover:rounded p-1  "
          onClick={() => navigate("/Dashbord")}
        >
          <span className="text-[#1E3A8A] ">
            <FaChartBar />
          </span>
          Dashbord
        </div>
        <div
          className="flex items-center gap-2 hover:bg-[#6CF8BB] hover:rounded p-1"
          onClick={() => navigate("/Dashbord")}
        >
          <span className="text-[#1E3A8A]">
            <CgProfile />
          </span>
          Profile
        </div>
        <div
          className="flex items-center gap-2 hover:bg-[#6CF8BB] hover:rounded p-1"
          onClick={() => navigate("/Dashbord")}
        >
          <span className="text-[#1E3A8A]">
            <FaCode />
          </span>
          Skills
        </div>
        <div
          className="flex items-center gap-2 hover:bg-[#6CF8BB] hover:rounded p-1"
          onClick={() => navigate("/Dashbord")}
        >
          <span className="text-[#1E3A8A]">
            <FaUsers />
          </span>
          My CV
        </div>
        <div
          className="flex items-center gap-2 hover:bg-[#6CF8BB] hover:rounded p-1"
          onClick={() => navigate("/Dashbord")}
        >
          <span className="text-[#1E3A8A]">
            <FaUsers />
          </span>
          Applications
        </div>
      </nav>
      {/* 
      sidebar logout
      */}

      <div className="flex items-center gap-3 pl-4" onClick={() => navigate("/")}>
        <span className="text-red-900">
          <FaSignOutAlt />
        </span>
        Sign Out
      </div>

      <div className="bg-red-300">
        <Outlet />
      </div>
    </div>
  );
}
