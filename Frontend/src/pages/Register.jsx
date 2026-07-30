import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "../features/authSlice";
import { DASHBOARD_BY_ROLE } from "../constants/roles";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Job-Seeker",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate(DASHBOARD_BY_ROLE[role] || "/");
    }
  };

  return (
    <div className="bg-[#F8FAFC] h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] shadow-2xl border border-[#F2F4F6] rounded-2xl p-8 transition-all">

        {/* HEADER SECTION */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-[#00236F] font-extrabold text-2xl tracking-tight mb-2">
            Vocational<span className="text-[#10B981]">Link</span>
          </h2>
          <p className="text-[#64748B] text-sm text-center">
            Already have an account?{" "}
            <Link className="text-[#00236F] font-bold hover:underline" to="/Login">
              Sign in
            </Link>
          </p>
        </div>

        {/* FARRIIMAHA CILADDA */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-semibold text-center border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[#191C1E] text-sm font-medium block mb-1">Full Name:</label>
            <input
              className="border border-[#C5C5D3] p-2.5 rounded-xl w-full text-[#191C1E] text-sm focus:outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F] transition-all bg-[#F8FAFC]/50"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="👤 Username"
              required
            />
          </div>

          <div>
            <label className="text-[#191C1E] text-sm font-medium block mb-1">Email Address:</label>
            <input
              className="border border-[#C5C5D3] p-2.5 rounded-xl w-full text-[#191C1E] text-sm focus:outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F] transition-all bg-[#F8FAFC]/50"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="📩  example@gmail.com"
              required
            />
          </div>

          <div>
            <label className="text-[#191C1E] text-sm font-medium block mb-1">Password:</label>
            <input
              className="border border-[#C5C5D3] p-2.5 rounded-xl w-full text-[#191C1E] text-sm focus:outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F] transition-all bg-[#F8FAFC]/50 font-sans"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="🔐  ••••••••••••"
            />
          </div>

          <div>
            <label className="text-[#191C1E] text-sm font-bold block mb-1">Account Type ⬇️</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2.5 bg-[#F2F4F6] rounded-xl text-[#1E3A8A] font-bold w-full focus:outline-none focus:ring-1 focus:ring-[#00236F]"
            >
              <option value="Job-Seeker">Job Seeker</option>
              <option value="Employer">Employer</option>
            </select>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#C5C5D3] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-2 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="pt-10 text-sm text-red-900" onClick={()=> navigate("/") }>
          Back home ⬅️
        </div>
      </div>
    </div>
  );
}
