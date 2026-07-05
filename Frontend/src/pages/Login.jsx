import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate(); // Badhanka weyn 'navigate' variable-ka xaraf yar ka dhig
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/User/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Magaca xaraf yar ka dhig 'data' si uu u n someeyo clean code

      if (!response.ok) {
        throw new Error(data.message || "Email ama Password khaldan!");
      }

      localStorage.setItem("token", data.Token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Toos u kala hage doorka isticmaalaha (Role-Based Routing)
      if (data.user.role === "Job-Seeker") {
        navigate("/Jop-seeker-Dashboard");
      } else if (data.user.role === "Employer") {
        navigate("/emmploye-Dashoard");
      }
   
    } catch (error) {
      setError(error.message || "Cilad ayaa dhacday intii lagu guda jiray login-ka");
    } finally {
      setLoading(false); // Had iyo jeer dami loading-ka marka shaqadu dhamaato
    }
  };

  return (
    <div className="bg-[#F8FAFC] h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] shadow-2xl border border-[#F2F4F6] rounded-2xl p-8 transition-all">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-[#00236F] font-extrabold text-2xl tracking-tight mb-2">
            Vocational<span className="text-[#10B981]">Link</span>
          </h2>
          <p className="text-[#64748B] text-sm text-center">
            Don't have an account?{" "}
            <Link className="text-[#00236F] font-bold hover:underline" to="/Register">
              Register here
            </Link>
          </p>
        </div>

        {/* CILADDA (ERROR MESSAGE) */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-semibold text-center border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-[#191C1E] text-sm font-medium block mb-1.5">Email Address:</label>
            <input
              className="border border-[#C5C5D3] p-2.5 rounded-xl w-full text-[#191C1E] text-sm focus:outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F] transition-all bg-[#F8FAFC]/50"
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              placeholder="📩  example@gmail.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#191C1E] text-sm font-medium">Password:</label>
              <Link to="/forgot-password" className="text-xs text-[#64748B] hover:text-[#00236F] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              className="border border-[#C5C5D3] p-2.5 rounded-xl w-full text-[#191C1E] text-sm focus:outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F] transition-all bg-[#F8FAFC]/50 font-sans tracking-widest"
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="🔐  ••••••••••••"
            />
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
                Processing...
              </>
            ) : (
              "Sign In"
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