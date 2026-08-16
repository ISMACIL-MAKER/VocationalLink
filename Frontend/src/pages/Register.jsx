import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaGoogle,
  FaLinkedin,
} from "react-icons/fa";
import { registerUser, clearAuthError } from "../features/authSlice";
import { DASHBOARD_BY_ROLE } from "../constants/roles";

const PERKS = [
  "Verified skill badges employers actually trust",
  "Post jobs and pay with Zaad or eDahab",
  "Real-time application pipeline tracking",
];

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: searchParams.get("role") === "Employer" ? "Employer" : "Job-Seeker",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate("/Login");
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-alt">
      {/* LEFT — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-white flex-col justify-between p-12 relative overflow-hidden">
      

        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight relative z-10"
        >
          Vocational<span className="text-success">Link</span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-tight mb-8 max-w-md">
            Join Somaliland's fastest-growing vocational talent network.
          </h1>
        </div>

        <div />
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-text text-2xl font-bold tracking-tight">
              Create an account
            </h2>
            <Link
              to="/Login"
              className="text-primary text-sm font-bold hover:underline"
            >
              Sign in
            </Link>
          </div>

          {/* ROLE TOGGLE */}
          <div className="grid grid-cols-2 bg-surface-alt border border-border rounded-xl p-1 mb-6">
            {["Job-Seeker", "Employer"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ ...formData, role })}
                className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                  formData.role === role
                    ? "bg-surface text-primary shadow-sm"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {role === "Job-Seeker" ? "Job Seeker" : "Employer"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-semibold text-center border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-text text-sm font-medium block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm" />
                <input
                  className="border border-border pl-9 pr-3 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface-alt/50"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-text text-sm font-medium block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm" />
                <input
                  className="border border-border pl-9 pr-3 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface-alt/50"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-text text-sm font-medium block mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm" />
                <input
                  className="border border-border pl-9 pr-9 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface-alt/50 tracking-widest"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-border text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-2 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
