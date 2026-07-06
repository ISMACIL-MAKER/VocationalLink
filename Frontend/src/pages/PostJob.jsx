import { useState } from "react";
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaPercent, FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"; // 1. Soo import gareey Redux hooks
import { createJob } from "../features/JopSlice"; // 2. Soo import gareey thunk-ga

export default function PostJop() {
  const dispatch = useDispatch();
  
  // Ka soo akhriso loading-ka guud ama kan u gaarka ah JOP slice
  const { loading } = useSelector((state) => state.JOP);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    matchScore: "",
    location: "",
    Description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. U dir xogta Redux Thunk-ga
    const result = await dispatch(createJob(formData));

    if (createJob.fulfilled.match(result)) {
      alert("Shaqada si guul leh ayaa loo dhajiyey! 🎉");
      // Nadiifi form-ka marka uu guuleysto
      setFormData({ title: "", company: "", matchScore: "", location: "", Description: "" });
    } else {
      alert(result.payload || "Cilad ayaa dhacday intii shaqada la dhajinayay");
    }
  };

  return (
    <div className="bg-[#F8FAFC] w-full min-h-screen flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#F2F4F6] shadow-md p-8">
        
        {/* HEADER */}
        <div className="mb-6 border-b border-[#F2F4F6] pb-4">
          <h2 className="text-[#1E3A8A] text-2xl font-bold">Post a New Job</h2>
          <p className="text-[#64748B] text-xs mt-1">
            Fill in the details below to add a new job recommendation via Redux.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191C1E] mb-1">Job Title</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                  <FaBriefcase />
                </span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Full Stack Developer"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#00236F] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191C1E] mb-1">Company Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                  <FaBuilding />
                </span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g., VocationalLink"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#00236F] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Match Score & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191C1E] mb-1">Match Score (%)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                  <FaPercent />
                </span>
                <input
                  type="number"
                  name="matchScore"
                  value={formData.matchScore}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  placeholder="e.g., 90"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#00236F] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191C1E] mb-1">Location</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                  <FaMapMarkerAlt />
                </span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Hargeisa, Somalia"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#00236F] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-[#191C1E] mb-1">Job Description</label>
            <div className="relative">
              <span className="absolute top-3 left-0 flex items-start pl-3 text-[#64748B]">
                <FaFileAlt />
              </span>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the job position in detail..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#00236F] transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00236F] hover:bg-[#1E3A8A] disabled:bg-[#C5C5D3] text-white text-sm font-bold py-3 px-4 rounded-xl transition-colors shadow-sm flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing via Redux...
                </span>
              ) : (
                "Publish Job Offer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}