import { FaShieldAlt, FaMobileAlt, FaCertificate } from "react-icons/fa";

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
            Built for the Somaliland Market
          </h2>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-[#00236F] rounded-xl h-fit text-lg">
              <FaCertificate />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#00236F]">Verified Skill Badge</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Every certificate a technician uploads is manually reviewed by our team
                before a Verified badge appears on their profile — so employers only see
                credentials they can trust.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-[#00236F] rounded-xl h-fit text-lg">
              <FaMobileAlt />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#00236F]">Zaad &amp; eDahab Ready</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Employers subscribe and post jobs using the mobile money platforms already
                part of daily business in Somaliland — no bank account required.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-[#00236F] rounded-xl h-fit text-lg">
              <FaShieldAlt />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#00236F]">Moderated Employers</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Company registrations are reviewed by our Super-Admin team before job
                posts go live, keeping the marketplace free of fake listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
