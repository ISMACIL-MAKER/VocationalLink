import { Form, Link } from "react-router-dom";

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
          <form className="flex flex-col p-2 mb-10">
            <label className="text-[191C1E] text-sm mb-2 ">Email:</label>
            <input
              className="border p-1 rounded w-full mb-4 text-[#00236F] text-sm"
              type="email"
              placeholder="📩    example@gmail.com"
              required
            />
            <label className="text-[191C1E] text-sm mb-2">Password:</label>
            <input className="border rounded text-[#00236F] text-sm p-1 w-full mb-4 font-bold text-lg" type="password" required placeholder="🔐   ..................." />
            <button className="bg-[#00236F] rounded py-2 text-[#FFFFFF] font-bold text-sm">Sign in to Account</button>
            <label className="text-[191C1E] font-bold text-sm mt-2">type ⬇️</label>
            <select className="border p-2 border-[#fffd] bg-[#F2F4F6] rounded-full text-[#1E3A8A] font-bold mt-2">
                <option value="">Job Seeker</option>
                <option value="">Employer</option>
            </select>
          </form>
        </div>
      </div>
    </div>
  );
}
