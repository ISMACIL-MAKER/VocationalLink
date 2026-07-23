import { FaCheckCircle, FaProjectDiagram, FaTag } from "react-icons/fa";

export default function TrustSection() {
  return (
    <div className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Image Placeholder */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg h-80 bg-slate-800 flex items-center justify-center text-white">
          <img 
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000" 
            alt="Vocational Training" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Info */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#00236F]">
            Why Professionals Trust VocationalLink
          </h2>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-[#00236F] rounded-xl h-fit text-lg"><FaCheckCircle /></div>
            <div>
              <h3 className="font-bold text-sm text-[#00236F]">Verified Credentials</h3>
              <p className="text-xs text-[#64748B] mt-1">We manually verify all certifications and trade licenses across all Somaliland regions.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-[#00236F] rounded-xl h-fit text-lg"><FaProjectDiagram /></div>
            <div>
              <h3 className="font-bold text-sm text-[#00236F]">Smart Matching</h3>
              <p className="text-xs text-[#64748B] mt-1">Our system matches local market demand with regional skill requirements automatically.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-[#00236F] rounded-xl h-fit text-lg"><FaTag /></div>
            <div>
              <h3 className="font-bold text-sm text-[#00236F]">Transparent Pricing</h3>
              <p className="text-xs text-[#64748B] mt-1">No hidden fees. Direct communication between hiring managers and skilled trade professionals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}