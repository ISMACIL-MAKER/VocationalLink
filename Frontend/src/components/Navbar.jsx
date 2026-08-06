import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { DASHBOARD_BY_ROLE } from "../constants/roles";

export default function Navbar() {
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white/70 backdrop-blur-md flex justify-between items-center sticky top-0 z-50 px-8 py-4 border-b border-white/40 shadow-sm">
      {/* BRAND LOGO */}
      <Link to="/" className="flex items-center gap-2 group">
        <h2 className="text-primary font-extrabold text-xl tracking-tight transition-colors group-hover:text-primary-dark">
          Vocational<span className="text-success">Link</span>
        </h2>
      </Link>

      {/* NAVIGATION LINKS */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link
          className={`relative py-1 transition-colors duration-200 hover:text-primary ${
            isActive("/") ? "text-primary font-bold" : "text-text-secondary"
          }`}
          to="/"
        >
          Home
          {isActive("/") && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
          )}
        </Link>

        <Link
          className={`relative py-1 transition-colors duration-200 hover:text-primary ${
            isActive("/jobs") ? "text-primary font-bold" : "text-text-secondary"
          }`}
          to="/jobs"
        >
          Find Jobs
          {isActive("/jobs") && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
          )}
        </Link>

        <a className="text-text-secondary hover:text-primary transition-colors" href="#how-it-works">
          How it Works
        </a>
        <a className="text-text-secondary hover:text-primary transition-colors" href="#footer">
          Contact
        </a>
      </nav>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        {token && user ? (
          <Link
            className="bg-primary hover:bg-primary-dark border border-transparent text-white text-sm font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
            to={DASHBOARD_BY_ROLE[user.role] || "/"}
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              className="text-primary text-sm font-semibold py-2 px-4 rounded-lg hover:bg-surface-alt transition-all"
              to="/Register"
            >
              Register
            </Link>
            <Link
              className="bg-primary hover:bg-primary-dark border border-transparent text-white text-sm font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              to="/Login"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
