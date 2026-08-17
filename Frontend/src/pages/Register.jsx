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
} from "react-icons/fa";
import { registerUser, clearAuthError } from "../features/authSlice";

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

  // State-yada lagu maareeyo khalaadaadka (Validation Errors)
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Marka uu isticmaalku qoraal cusub bilaabo tirtir qaladkii horay ugu jiray field-kaas
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    let hasError = false;
    const newErrors = { username: "", email: "", password: "" };

    // 1. Hubi Full Name (Ugu yaraan 3 xaraf)
    if (formData.username.trim().length < 3) {
      newErrors.username = "Magacu waa inuu ka badan yahay ama le'eg yahay 3 xaraf!";
      toast.error(newErrors.username);
      hasError = true;
    }

    // 2. Hubi Email-ka (Sidoo kale nambar oo kaliya laguma geli karo)
    const emailTrimmed = formData.email.trim();
    const isPhoneNumber = /^[0-9+\s-]+$/.test(emailTrimmed);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isPhoneNumber) {
      newErrors.email = "Nambarka mobaylka halkan ma geli kartid. Fadlan geli Email!";
      toast.error(newErrors.email);
      hasError = true;
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = "Fadlan geli Email sax ah (tusaale: name@company.com)";
      toast.error(newErrors.email);
      hasError = true;
    }

    // 3. Hubi Password-ka (Ugu yaraan 6 xaraf/nambar)
    if (formData.password.length < 6) {
      newErrors.password = "Password-ku waa inuu ka badan yahay ama le'eg yahay 6 xaraf/nambar!";
      toast.error(newErrors.password);
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Haddii wax walba sax yihiin, dir foomka
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
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
          Vocational
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

          {/* Redux Server Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-semibold text-center border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* FULL NAME FIELD */}
            <div>
              <label 
                className={`text-sm font-medium block mb-1.5 transition-colors ${
                  errors.username ? "text-red-500 font-semibold" : "text-text"
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <FaUser 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                    errors.username ? "text-red-500" : "text-text-secondary"
                  }`} 
                />
                <input
                  className={`border pl-9 pr-3 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:ring-1 transition-all bg-surface-alt/50 ${
                    errors.username
                      ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.username}</p>
              )}
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label 
                className={`text-sm font-medium block mb-1.5 transition-colors ${
                  errors.email ? "text-red-500 font-semibold" : "text-text"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                    errors.email ? "text-red-500" : "text-text-secondary"
                  }`} 
                />
                <input
                  className={`border pl-9 pr-3 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:ring-1 transition-all bg-surface-alt/50 ${
                    errors.email
                      ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label 
                className={`text-sm font-medium block mb-1.5 transition-colors ${
                  errors.password ? "text-red-500 font-semibold" : "text-text"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <FaLock 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                    errors.password ? "text-red-500" : "text-text-secondary"
                  }`} 
                />
                <input
                  className={`border pl-9 pr-9 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:ring-1 transition-all bg-surface-alt/50 tracking-widest ${
                    errors.password
                      ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
              )}
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