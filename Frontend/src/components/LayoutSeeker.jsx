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
  const navigate = useNavigate();
  return (
    <div className="bg-[#F2F4F6] h-screen w-40 flex flex-col justify-between">
      {/* 
      sidebar head
      */}
      <div className=" ">
        <div className="mb-10 text-[#00236F] font-bold p-4">
          <h1>VocationalLink</h1>
        </div>

        <div className=" flex flex-row text-sm  ">
          <img
            className="w-10 h-12 rounded-full "
            src="https://tse3.mm.bing.net/th/id/OIP.6E59fA0XA6lx8RsJjtAjXwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
          />
          <div className="pl-2">
            <h1 className="text-[#191C1E] font-bold">Alex Johnson</h1>
            <p className="text-[#444651]">Product Designer</p>
          </div>
        </div>
      </div>
      {/* 
      sidebar links
      */}

      <nav className="bg-blue-300 flex flex-col pl-6 gap-10 mb-8">
        <div
          className="flex items-center gap-2"
          onClick={() => navigate("/Dashbord")}
        >
          <span>
            <FaChartBar />
          </span>
          Dashbord
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => navigate("/Dashbord")}
        >
          <span>
            <FaUsers />
          </span>
          Profile
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => navigate("/Dashbord")}
        >
          <span>
            <FaCode />
          </span>
          Skills
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => navigate("/Dashbord")}
        >
          <span>
            <FaUsers />
          </span>
          My CV
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => navigate("/Dashbord")}
        >
          <span>
            <FaUsers />
          </span>
          Applications
        </div>
      </nav>
      {/* 
      sidebar logout
      */}

      <div>
        <button onClick={() => navigate("/")}>Logout</button>
      </div>

      <div className="bg-red-300">
        <Outlet />
      </div>
    </div>
  );
}
