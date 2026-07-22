import { Link, useLocation, useNavigate } from "react-router-dom";


export default function Navbar() {
  const location = useLocation();
  const navigate =useNavigate();

  // Function lagu ogaanayo bogga uu taagan yahay si loogu iftiimiyo
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-50 px-8 py-4 border-b border-[#F2F4F6] shadow-sm">
      
      {/* BRAND LOGO */}
      <Link to="/" className="flex items-center gap-2 group">
        <h2 className="text-[#00236F] font-extrabold text-xl tracking-tight transition-colors group-hover:text-[#1E3A8A]">
          Vocational<span className="text-[#10B981]">Link</span>
        </h2>
      </Link>

      {/* NAVIGATION LINKS */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link
          className={`relative py-1 transition-colors duration-200 hover:text-[#00236F] ${
            isActive("/") ? "text-[#00236F] font-bold" : "text-[#64748B]"
          }`}
          to="/"
        >
          Home
          {isActive("/") && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00236F] rounded-full" />
          )}
        </Link>

        <a className="text-[#64748B] hover:text-[#00236F] transition-colors" href="#features" onClick={()=> navigate("/CategoriesSection")}>
          Features
        </a>
        <a className="text-[#64748B] hover:text-[#00236F] transition-colors" href="#how-it-works">
          How it Works
        </a>
        <a className="text-[#64748B] hover:text-[#00236F] transition-colors" href="#footer">
          Contact
        </a>
      </nav>

      {/* ACTION BUTTON */}
      <div className="flex items-center gap-3">
        <Link
          className="text-[#00236F] text-sm font-semibold py-2 px-4 rounded-lg hover:bg-[#F2F4F6] transition-all"
          to="/Register"
        >
          Register
        </Link>
        <Link
          className="bg-[#00236F] hover:bg-[#1E3A8A] border border-transparent text-white text-sm font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
          to="/Login"
        >
          Login
        </Link>
      </div>

    </div>
  );
}