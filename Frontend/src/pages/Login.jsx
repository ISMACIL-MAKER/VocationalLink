import { useState } from "react";
import {  Link, useNavigate } from "react-router-dom";


{
  /*
     #1E3A8A
     #10B981
     #64748B
     #F8FAFC
     #C5C5D3
     #FFFFFF
     #F2F4F6
     #191C1E
     #00236F
    */
}

export default function Login() {
  const Navigate=useNavigate();
  const [loading,setloading]=useState(false);
  const [FromData, SetFromData] = useState({
    email: "",
    password: "",
  });

  const Handelchange = (e) => {
    SetFromData({ ...FromData, [e.target.name]: e.target.value });
  };

  const HandelSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const response = await fetch("http://localhost:5000/api/User/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FromData),
      });

      const Data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Waxbaa khaldamay");
      }
      alert("Login susses ");
      localStorage.setItem("token", Data.Token);
      localStorage.setItem("user", JSON.stringify(Data.user));
      if (Data.user.role === "Jop-seeker") {
        Navigate("/Jop-seeker-Dashboard");
      } else {
        Navigate("/emmploye-Dashoard");
      }
    } catch (error) {
       alert(error.message || "cilad ba dhaxday");
    }
  };

  return (
    <div className="bg-[#F8FAFC] h-screen flex justify-center items-center ">
      <div className="w-100 h-110 bg-[#FFFFFF] shadow-2xl border border-[#F2F4F6] rounded">
        <div className="flex justify-between p-8">
          <h1 className="text-[#191C1E]  font-medium">Welcome back </h1>
          <Link className="text-[#00236F] font-medium" to="/Register">
            Create an account
          </Link>
        </div>
        {/*FORM CONTAINER*/}
        <div className=" p-10">
          <form onSubmit={HandelSubmit} className="flex flex-col p-2 mb-10">
            <label className="text-[191C1E] text-sm mb-2 ">Email:</label>
            <input
              className="border p-1 rounded w-full mb-4 text-[#00236F] text-sm"
              type="email"
              value={FromData.email}
              onChange={Handelchange}
              name="email"
              placeholder="📩    example@gmail.com"
              required
            />
            <label className="text-[191C1E] text-sm mb-2">Password:</label>
            <input
              className="border rounded text-[#00236F] text-sm p-1 w-full mb-4 font-bold text-lg"
              type="password"
              required
              name="password"
              value={FromData.password}
              onChange={Handelchange}
              placeholder="🔐   ..................."
            />
            <button disabled={loading} className="bg-[#00236F] rounded py-2 text-[#FFFFFF] font-bold text-sm">
            
              {loading?"Loading":" Sign in to Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
