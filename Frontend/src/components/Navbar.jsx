import { Link } from "react-router-dom";

{
  /*
     #1E3A8A
     #10B981
     #64748B
     #F8FAFC
    */
}

function Navbar() {
  return (
    <div className="bg-[#F8FAFC] flex justify-between items-center sticky top-0 z-50  p-4 border border-gray-200">
      <h2 className="text-[#1E3A8A] font-bold text-xl">VocationalLink</h2>
      <nav className="flex gap-8 text-[#64748B]  ">
        <Link
          className=" font-bold text-[#1E3A8A] hover:font-bold hover:text-lg"
          to="/"
        >
          Home
        </Link>
        <Link className="hover:text-[#1E3A8A] hover:font-bold" to="/Messages">
          Jobs
        </Link>
        <Link className="hover:text-[#1E3A8A] hover:font-bold" to="/Explore">
          Skills
        </Link>
        <Link className="hover:text-[#1E3A8A] hover:font-bold" to="/Explore">
          About
        </Link>
      </nav>
      <div className="flex gap-8">
        <Link
          className="bg-[#F8FAFC] py-1 px-6 rounded-full text-[#1E3A8A] font-bold hover:bg-[#F8FAFC] border border-[#1E3A8A] hover:text-[#1E3A8A] hover:px-10 "
          to="/Login"
        >
          Login
        </Link>
        <Link
          className="bg-[#1E3A8A] py-1 px-6 rounded-full text-[#F8FAFC] font-bold hover:bg-[#F8FAFC] border border-[#10B981] hover:text-[#1E3A8A] hover:px-10 "
          to="Register"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
