import { FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-surface-alt border-t border-border py-12 px-6 text-text-secondary">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 pb-10 border-b border-border">

        {/* Logo & Description */}
        <div className="max-w-xs">
          <h3 className="text-lg font-bold text-primary">VocationalLink</h3>
          <p className="text-xs mt-2 leading-relaxed">
            Connecting skilled trades with world-class opportunities across Somaliland regions since 2024.
          </p>
        </div>

        {/* Links Navigation */}
        <div className="flex flex-wrap gap-8 text-xs font-semibold text-primary">
          <a href="#" className="hover:text-primary-dark transition-colors">ABOUT US</a>
          <a href="#" className="hover:text-primary-dark transition-colors">HELP CENTER</a>
          <a href="#" className="hover:text-primary-dark transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-primary-dark transition-colors">TERMS OF SERVICE</a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
        <p>©️ 2026 VocationalLink. All rights reserved.</p>

        {/* Language / Region Selector */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
          <FaGlobe className="text-sm" />
          <span className="font-medium">English (US)</span>
        </div>
      </div>
    </footer>
  );
}