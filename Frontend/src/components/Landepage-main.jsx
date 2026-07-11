
 import { useDispatch } from "react-redux";
  import { recentJop } from "../features/JopSlice";
import { useEffect } from "react";
 

export default function Landepage(){
    




  

   
  


  

    



    

    return(
        <div className="flex flex-row h-80 w-full bg-[#F8FAFC]  justify-around items-center ">
           <div className="">

             <h1 className="text-3xl text-[#00236F] font-bold">4,005+</h1>
             <p className="text-1xl  text-[#757682]">JOBS POSTED</p>
           </div>
           <div className="">
             <h1 className="text-3xl text-[#00236F] font-bold">14,005+</h1>
             <p className="text-1xl  text-[#757682]">EMPLOYERS</p>
           </div>
           <div className="">
             <h1 className="text-3xl text-[#00236F] font-bold">14,005+</h1>
             <p className="text-1xl  text-[#757682]">JOB SEEKERS</p>
           </div>
           <div className="">
             <h1 className="text-3xl text-[#00236F] font-bold">14,005+</h1>
             <p className="text-1xl  text-[#757682]">MATCHES MADE</p>
           </div>
          
        </div>
    )
}