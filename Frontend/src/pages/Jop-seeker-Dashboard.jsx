import LayoutSeeker from "../components/LayoutSeeker";

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
import { FaGooglePlay } from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
const colors = {
  1: "  #00236F",
  2: "  #10B981",
  3: "  #64748B",
  4: "  #F8FAFC",
  4: "  #191C1E",
};
export default function Dashoard_seeker() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex">
      <div className=" bg-[#F2F4F6]">
        <LayoutSeeker />
      </div>
      <div className="bg-[#F8FAFC] w-screen">
        <div className="p-5">
          <h1 className="text-[#1E3A8A] text-2xl font-bold">
            Welcome back, {user?.username}
          </h1>
          <p className="text-[#64748B]">
            You have 3 new job matches based on your skills.
          </p>
        </div>
        {/* container*/}
        <div className="flex justify-around gap-10 items-center p-4">
          {/* ccar 1*/}
          <div className=" w-60 h-40  flex flex-col justify-between bg-[#FFFFFF] shadow-lg rounded">
            <div className="p-4  rounded">
              <span>
                <FaGooglePlay />
              </span>
            </div>
            <div className="p-4 text-2xl font-bold">
              <h1>24</h1>
            </div>
            <div className="pb-4 pl-4 text-sm text-[#00236F] font-bold">
              <p>Applications Sent</p>
            </div>
          </div>
          {/* ccar 2*/}
          <div className=" w-60 h-40  flex flex-col justify-between bg-[#FFFFFF] shadow-lg rounded">
            <div className="p-4  rounded">
              <span>
                <IoCalendarClearOutline />
              </span>
            </div>
            <div className="p-4 text-2xl font-bold">
              <h1>24</h1>
            </div>
            <div className="pb-4 pl-4 text-sm text-[#00236F] font-bold">
              <p>Interviews Scheduled</p>
            </div>
          </div>
          {/* ccar 3*/}
          <div className=" w-60 h-40  flex flex-col justify-between bg-[#FFFFFF] shadow-lg rounded">
            <div className="p-4  rounded">
              <span className="bg-[#00236F] ">
                <CiBookmark />
              </span>
            </div>
            <div className="p-4 text-2xl font-bold">
              <h1>24</h1>
            </div>
            <div className="pb-4 pl-4 text-sm text-[#00236F] font-bold">
              <p>Saved Jobs</p>
            </div>
          </div>
        </div>
        {/* Recent jop*/}

        <div className="bg-[#F8FAFC] w-full">
          <div className="p-4">
            <h1 className="text-[#191C1E] text-lg font-bold">
              Recent Job Recommendations
            </h1>
            <p className="text-[#64748B] text-sm">
              Tailored matches based on your Product Design skills.
            </p>
          </div>
            {/* Recent card*/}
           <div className="flex justify-around gap-10 items-center p-4">
          {/* ccar 1*/}
          <div className=" w-60 h-60  flex flex-col justify-between bg-[#FFFFFF] shadow-lg rounded">
            <div className="p-4  rounded">
              <span>
                <FaGooglePlay />
              </span>
            </div>
            <div className="p-2 text-lg font-bold">
              <h1 className="text-[#1E3A8A]">Senior UX Designer</h1>
            </div>
            <div className="pl-3 tetx-[#C5C5D3]">
                <p className="">NovaStream Technologies</p>
                <p>Remote / San Francisco</p>
            </div>
            <div className="pb-4 pl-4 text-sm text-[#00236F] font-bold flex items-center">
              <button className="bg-[#00236F] px-6 py-2 text-white font-bold rounded ">Apply Now</button>
            </div>
          </div>
          {/* ccar 2*/}
          <div className=" w-60 h-40  flex flex-col justify-between bg-[#FFFFFF] shadow-lg rounded">
            <div className="p-4  rounded">
              <span>
                <IoCalendarClearOutline />
              </span>
            </div>
            <div className="p-4 text-2xl font-bold">
              <h1>24</h1>
            </div>
            <div className="pb-4 pl-4 text-sm text-[#00236F] font-bold">
              <p>Interviews Scheduled</p>
            </div>
          </div>
          {/* ccar 3*/}
          <div className=" w-60 h-40  flex flex-col justify-between bg-[#FFFFFF] shadow-lg rounded">
            <div className="p-4  rounded">
              <span>
                <CiBookmark />
              </span>
            </div>
            <div className="p-4 text-2xl font-bold">
              <h1>24</h1>
            </div>
            <div className="pb-4 pl-4 text-sm text-[#00236F] font-bold">
              <p>Saved Jobs</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
