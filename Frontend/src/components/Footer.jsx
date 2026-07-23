import { FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-12 px-6 text-[#64748B]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 pb-10 border-b border-[#E2E8F0]">
        
        {/* Logo & Description */}
        <div className="max-w-xs">
          <h3 className="text-lg font-bold text-[#00236F]">VocationalLink</h3>
          <p className="text-xs mt-2 leading-relaxed">
            Connecting skilled trades with world-class opportunities across Somaliland regions since 2024.
          </p>
        </div>

        {/* Links Navigation */}
        <div className="flex flex-wrap gap-8 text-xs font-semibold text-[#00236F]">
          <a href="#" className="hover:text-[#1E3A8A] transition-colors">ABOUT US</a>
          <a href="#" className="hover:text-[#1E3A8A] transition-colors">HELP CENTER</a>
          <a href="#" className="hover:text-[#1E3A8A] transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-[#1E3A8A] transition-colors">TERMS OF SERVICE</a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
        <p>©️ 2026 VocationalLink. All rights reserved.</p>
        
        {/* Language / Region Selector */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-[#00236F]">
          <FaGlobe className="text-sm" />
          <span className="font-medium">English (US)</span>
        </div>
      </div>
    </footer>
  );
}