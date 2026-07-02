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
export default function Register() {

  const[ FromData,SetFromData]=useState({
    username:"",
    email:"",
    password:"",
    role:"Job-Seeker",
  });

  const navigate=useNavigate();

  const handleChange=(e)=>{
    SetFromData({
      ...FromData,
      [e.target.name]:e.target.value,
    });
  }

  const handelsubmit=async(e)=>{
    e.preventDefault();

    try {
      const resonse=await fetch("http://localhost:5000/api/User/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },body:JSON.stringify({
          username:FromData.username,
          email:FromData.email,
          password:FromData.password,
          role:FromData.role

        }),
      });

      const data=await resonse.json();

      if(!resonse.ok){
        throw new Error(data.message || "waxab khaldamay")
      }

      alert("walagu gulayastay Register");

      setTimeout(()=>{
        navigate("/Login");
      },1000)


    } catch (error) {

      console.log(error.message);
      
    }
  
  }


  return (
    <div className="bg-[#F8FAFC] h-screen flex justify-center items-center m-2">
      <div className="w-100 min-h-screen bg-[#FFFFFF] shadow-2xl border border-[#F2F4F6] rounded">
        <div className="flex flex-col p-8">
          <h1 className="text-[#191C1E] text-2xl  font-bold mb-8 text-center">
            Create an account{" "}
          </h1>
          <p className="text-[#C5C5D3] text-sm flex flex-col">
            {" "}
            Already have an account?{" "}
            <Link className="text-[#00236F] font-bold" to="/Login">
              Sign in
            </Link>
          </p>{" "}
        </div>
        {/*FORM CONTAINER*/}
        <div className=" p-10">
          <form onSubmit={handelsubmit} className="flex flex-col p-2 mb-10">
            <label className="text-[191C1E] text-sm mb-2 ">Full Name:</label>
            <input
              className="border p-1 rounded w-full mb-4 text-[#00236F] text-sm"
              type="text"
              name="username"
              value={FromData.username}
              onChange={handleChange}
              placeholder="👤 Username"
              required
            />
            <label className="text-[191C1E] text-sm mb-2 ">Email:</label>
            <input
              className="border p-1 rounded w-full mb-4 text-[#00236F] text-sm"
              type="email"
              name="email"
              value={FromData.email}
              onChange={handleChange}
              placeholder="📩    example@gmail.com"
              required
            />
            <label className="text-[191C1E] text-sm mb-2">Password:</label>
            <input
              className="border rounded text-[#00236F] text-sm p-1 w-full mb-4 font-bold text-lg"
              type="password"
              name="password"
              value={FromData.password}
              onChange={handleChange}
              required
              placeholder="🔐   ..................."
            />
            <button className="bg-[#00236F] rounded py-2 text-[#FFFFFF] font-bold text-sm">
              Create Account
            </button>
            <label className="text-[191C1E] font-bold text-sm mt-2">
              type ⬇️
            </label>
            <select name="role" value={FromData.role} onChange={handleChange} className="border p-2 border-[#fffd] bg-[#F2F4F6] rounded-full text-[#1E3A8A] font-bold mt-2">
              <option value="Job-Seeker">Job Seeker</option>
              <option value="Employer">Employer</option>
            </select>
          </form>
        </div>
      </div>
    </div>
  );
}
