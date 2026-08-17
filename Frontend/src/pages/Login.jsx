import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { loginUser, clearAuthError } from "../features/authSlice";
import { DASHBOARD_BY_ROLE } from "../constants/roles";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [audience, setAudience] = useState("Job-Seeker");
  
  // State-yada lagu maareeyo khaladaadka (Validation Errors)
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Marka uu isticmaalku qoraal cusub bilaabo tirtir qaladkii hore
    if (name === "email" && emailError) setEmailError("");
    if (name === "password" && passwordError) setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    let hasError = false;
    setEmailError("");
    setPasswordError("");

    const emailTrimmed = formData.email.trim();

    // 1. Hubi haddii la geliyay nambar oo kaliya
    const isPhoneNumber = /^[0-9+\s-]+$/.test(emailTrimmed);
    if (isPhoneNumber) {
      const msg = "Nambarka mobaylka halkan ma geli kartid. Fadlan geli Email!";
      setEmailError(msg);
      toast.error(msg);
      hasError = true;
    } 
    // 2. Hubi qaabka saxda ah ee Email-ka
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        const msg = "Fadlan geli Email sax ah (tusaale: name@company.com)";
        setEmailError(msg);
        toast.error(msg);
        hasError = true;
      }
    }

    // 3. Hubi in Password-ku ka yarayn 6 xaraf/nambar
    if (formData.password.length < 6) {
      const msg = "Password-ku waa inuu ka badan yahay ama le'eg yahay 6 xaraf/nambar!";
      setPasswordError(msg);
      toast.error(msg);
      hasError = true;
    }

    // Haddii uu qalad ka jiro mid ka mid ah, jooji dirista
    if (hasError) return;

    // Haddii wax walba sax yihiin, dir foomka
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate(DASHBOARD_BY_ROLE[role] || "/");
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-alt">
      {/* LEFT — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-white flex-col justify-between p-12 relative overflow-hidden">
        <Link to="/" className="text-xl font-extrabold tracking-tight relative z-10">
          Vocational
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-tight mb-10 max-w-md">
            Connecting Somaliland's most skilled vocational talent.
          </h1>
          <p className="text-[11px] text-white/60 font-semibold tracking-wide mt-10">
            TRUSTED BY 500+ COMPANIES ACROSS SOMALILAND
          </p>
        </div>
        <div />
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-text text-2xl font-bold tracking-tight">Welcome back</h2>
            <Link
              to={`/Register?role=${audience}`}
              className="text-primary text-sm font-bold hover:underline"
            >
              Create an account
            </Link>
          </div>

          {/* AUDIENCE TOGGLE */}
          <div className="grid grid-cols-2 bg-surface-alt border border-border rounded-xl p-1 mb-6">
            {["Job-Seeker", "Employer"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setAudience(role)}
                className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                  audience === role
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
            {/* EMAIL FIELD */}
            <div>
              <label 
                className={`text-sm font-medium block mb-1.5 transition-colors ${
                  emailError ? "text-red-500 font-semibold" : "text-text"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                    emailError ? "text-red-500" : "text-text-secondary"
                  }`} 
                />
                <input
                  className={`border pl-9 pr-3 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:ring-1 transition-all bg-surface-alt/50 ${
                    emailError
                      ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  placeholder="name@company.com"
                  required
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1 font-medium">{emailError}</p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label 
                  className={`text-sm font-medium transition-colors ${
                    passwordError ? "text-red-500 font-semibold" : "text-text"
                  }`}
                >
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-text-secondary hover:text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FaLock 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                    passwordError ? "text-red-500" : "text-text-secondary"
                  }`} 
                />
                <input
                  className={`border pl-9 pr-9 py-2.5 rounded-xl w-full text-text text-sm focus:outline-none focus:ring-1 transition-all bg-surface-alt/50 tracking-widest ${
                    passwordError
                      ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-border focus:border-primary focus:ring-primary"
                  }`}
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              {passwordError && (
                <p className="text-red-500 text-xs mt-1 font-medium">{passwordError}</p>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-border text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-2 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in to Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}